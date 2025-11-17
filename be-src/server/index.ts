import express from "express";
import cors from "cors";
import * as jwt from "jsonwebtoken";
import path from "path";

import { sequelize } from "../db/sequelize";
import { User } from "../db/models";
import { Auth } from "../db/models";
import { Report } from "../db/models";
import { index } from "../lib/algolia";

import { getSHA256 } from "../lib/crypto";
import { authMiddleware } from "./middlewares/auth-middleware";
import { multerMiddleware } from "./middlewares/multer-middleware";
import { escapeHtml } from "./middlewares/html-middleware";

import { SECRET, PORT } from "../config";

import { cloudinary } from "../lib/cloudinary";
import { resend } from "./resend";

// --- Herramientas ---
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../../dist")));
// --- Registrarse ---
app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Falta email o password" });
  }
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email ya registrado" });
    }
    const user = await User.create({ email });
    const auth = await Auth.create({
      email,
      password: getSHA256(password),
      user_id: user.get("id")
    });

    const token = jwt.sign({ id: user.get("id") }, SECRET);
    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
});
// --- Iniciar Sesion ---
app.post("/auth/token", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Falta email o password" });
  }
  const auth = await Auth.findOne({ where: { email } });
  if (!auth) {
    return res.status(404).json({ message: "Email o password incorrectos" });
  }
  if (auth.get("password") !== getSHA256(password)) {
    return res.status(404).json({ message: "Email o password incorrectos" });
  }
  const token = jwt.sign({ id: auth.get("user_id") }, SECRET);
  res.json({ token });
});
// --- Alta Reporte ---
app.post("/misreportes", authMiddleware, multerMiddleware("imagen"), async (req, res) => {
  const file = req.file;
  const { nombreMascota, ciudad, pais, lat, lng } = req.body;
  if (!nombreMascota || !ciudad || !pais || !lat || !lng) return res.status(400).json({ error: "Datos faltantes" });
  if (!file) return res.status(400).json({ error: "No se envió imagen" });
  const latNum = Number(lat);
  const lngNum = Number(lng);
  try {
    // --- Guardar en cloudinary ---
    const b64 = file.buffer.toString("base64");
    const dataURI = "data:" + file.mimetype + ";base64," + b64;
    const uploadResp = await cloudinary.uploader.upload(dataURI, {
      folder: "petfinder",
    });
    if (!uploadResp || !uploadResp.secure_url) {
      return res.status(500).json({ error: "No se pudo obtener URL de Cloudinary" });
    }
    const imageUrl = uploadResp.secure_url;
    // --- Guardar en SQL ---
    const newReport = new Report({
      name: nombreMascota,
      city: ciudad,
      country: pais,
      img: imageUrl,
      lat:latNum,
      lng:lngNum,
      user_id: (req as any).user.id
    })
    await newReport.save();
    // --- Guardar en Algolia ---
    const algoliaRes = await index.saveObject({
      objectID: newReport.get("id"),
      name: newReport.get('name'),
      city: newReport.get('city'),
      country: newReport.get('country'),
      img: newReport.get('img'),
      _geoloc: {
        lat:latNum,
        lng:lngNum
      }
    });
    res.json({ message: 'Reporte creado correctamente', reporteId: newReport.get('id') });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error al subir imagen" });
  }
});
// --- Editar Reporte ---
app.put("/misreportes/:id", authMiddleware, multerMiddleware("imagen"), async (req, res) => {
  // --- Verifiacion de datos ---
  const { id } = req.params;
  const file = req.file;
  const { nombreMascota, ciudad, pais, lat, lng } = req.body;
  if (!nombreMascota || !ciudad || !pais || !lat || !lng) {
    return res.status(400).json({ error: "Datos faltantes" });
  }
  const latNum = Number(lat);
  const lngNum = Number(lng);
  try {
    // --- Encontrar recurso ---
    const report = await Report.findByPk(id);
    if (!report) return res.status(404).json({ error: "Reporte no encontrado" });
    if (report.get("user_id") !== (req as any).user.id) {
      return res.status(403).json({ error: "No autorizado" });
    }
    let imageUrl = report.get("img");
    // --- Actualizacion Cloudinary ---
    if (file) {
      const b64 = file.buffer.toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;
      const uploadResp = await cloudinary.uploader.upload(dataURI, {
        folder: "petfinder",
        overwrite: true,
        invalidate: true
      });

      if (!uploadResp.secure_url) {
        return res.status(500).json({ error: "Error subiendo imagen a Cloudinary" });
      }
      
      imageUrl = uploadResp.secure_url;
    }
    // --- Actulizacion en SQL ---
    await report.update({
      name: nombreMascota,
      city: ciudad,
      country: pais,
      img: imageUrl,
      lat: latNum,
      lng: lngNum,
    });
    // --- Actualizacion en ALgolia --- 
    await index.partialUpdateObject({
      objectID: report.get("id"),
      _geoloc: {
        lat: latNum,
        lng: lngNum,
      },
    });
    return res.json({
      message: "Reporte actualizado correctamente",
      reporteId: report.get("id"),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Error al actualizar reporte" });
  }
});
// --- Get reporte ID ---
app.get("/misreportes/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Report.findByPk(id);
    if (!reporte) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }
    return res.json({
      name: reporte.get('name'),
      city: reporte.get('city'),
      country: reporte.get('country'),
      location: {
        lat: reporte.get('lat'),
        lng: reporte.get('lng'),
      },
      imgUrl: reporte.get('img'),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
// --- Get Mis Reportes ---
app.get("/misreportes", authMiddleware, async (req, res) => {
  const id = (req as any).user?.id;
  try {
    const reports = await Report.findAll({
      where: {
        user_id: id
      }
    });
    const cleanReports = reports.map((r) => ({
        id: r.get('id'),
        name: r.get('name'),
        street: r.get('city'),
        city: r.get('country'),
        img: r.get('img')
      })
    );
    return res.json(cleanReports);
  } catch (e) { 
    console.error(e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
// --- Get Reportes cerca ---
app.get("/reportes", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "Informacion faltante." });
  const latNum = parseFloat(lat as string);
  const lngNum = parseFloat(lng as string);
  if (isNaN(latNum) || isNaN(lngNum)) {
    return res.status(400).json({ error: "Lat o lng inválidos." });
  }
  try {
    const result = await index.search("", {
      aroundLatLng: `${latNum}, ${lngNum}`, 
      aroundRadius: 20000 
    }) as any;
    const cleanReports = result.hits.map((r: any) => ({
      name: r.name,
      img: r.img,
      street: r.city,
      city: r.country,
      id: r.objectID
    }));
    res.json(cleanReports);
  } catch (e) { 
    console.error(e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
// --- Post seing report ---
app.post('/reportes', async (req, res) => {
  const { name, tel, message, reportId } = req.body;
  if (!name || !tel || !message || !reportId) return res.status(400).json({ error: "Informacion faltante." });
  if (typeof name !== "string" || typeof tel !== "string" || typeof message !== "string" || typeof reportId !== "number") {
    return res.status(400).json({ error: "Datos inválidos." })
  };
  try {
    const report = await Report.findByPk(reportId, { include: User }) as any;
    if (!report) return res.status(404).json({ error: "Reporte no encontrado." });
    const user = report.User as User;
    if (!user) return res.status(404).json({ error: "Usuario no encontrado." });
    const to = user.get('email') as string;
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject:`Un avistamiento de ${report.get('name')}`,
      html: `
        <p>Este mensaje te dejó <strong>${escapeHtml(name)}</strong>:</p>
        <p>${escapeHtml(message)}</p>
        <p>Teléfono: <strong>${escapeHtml(tel)}</strong></p>
      `,
    });
    res.json({ message: 'Mensaje enviado correctamente', reporteId:reportId });
  } catch (e) { 
    console.error(e);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist", "index.html"));
});
// --- Servidor ---
const startServer = async () => { 
  try {
    await sequelize.sync({ alter : true});
    app.listen(PORT, () => { 
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    })
  } catch (error) { 
    console.error('Error al sincronizar la base de datos:', error);
  }
}
startServer();