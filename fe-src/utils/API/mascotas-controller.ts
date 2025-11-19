import { PetWanted, DtReporte } from "../../types/types-mascota";
import { Geolocation, User } from "../../types/types-state";
import { API_BASE_URL } from "../../config";
import {
  IGetMascotasCerca, 
  IEnviarReporte,
  IGetMascotas,
  IAltaReporteMascota,
  IEditarReporteMascota,
  IGetMiReporteById
} from "../../types/types-controlador";
// PRE: Se reciben coordenadas válidas (lat, lng)
// POST: Retorna un array de mascotas cercanas o null si ocurre un error en la petición
const getMascotasCercaApi:IGetMascotasCerca = async ({ lat, lng }: Geolocation) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reportes?lat=${lat}&lng=${lng}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Error al obtener las mascotas:", response.statusText);
      return null;
    }
    const data: PetWanted[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la petición de mascotas:", error);
    return null;
  }
}
// PRE: Se reciben parámetros válidos (name, tel, message, reportId) y API_BASE_URL definido
// POST: Envía el reporte al backend y retorna la respuesta JSON o lanza un error si falla
const enviarReporteMascota:IEnviarReporte = async (name: string, tel: string, message: string, reportId:number)=> { 
  try {
    const res = await fetch(`${API_BASE_URL}/reportes`, { 
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        tel,
        message,
        reportId
      }),
    });
    if (!res.ok) {
      // El servidor respondió con error (400, 500, etc)
      const errorText = await res.text();
      throw new Error(`Error al enviar reporte: ${errorText}`);
    }

    const data = await res.json(); 
    console.log("Reporte enviado correctamente:", data); // <------------------ DELETE ------------
    return data;
  } catch (err) {
    console.error("Error al enviar reporte:", err); // <------------------ DELETE ------------
    throw err;
  }
}
// PRE: Se recibe un usuario válido con token y API_BASE_URL definido
// POST: Retorna las mascotas reportadas del usuario o null si ocurre un error en la petición
const getMisMascotasReportadasApi: IGetMascotas = async (user: User) => { 
  const res = await fetch(`${API_BASE_URL}/misreportes`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${user.token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener las mascotas (status ${res.status}): ${errorText}`);
  }

  return await res.json() as PetWanted[];
}
// PRE: Se recibe un token válido y un DtReporte con todos los campos completos (name, city, country, lat, lng, img)
// POST: Envía el formulario al backend y retorna la respuesta JSON o lanza un error si ocurre un fallo
const altaReporteMascotaApi: IAltaReporteMascota = async (token: string, newReport:DtReporte) => {
  try {
    const formData = new FormData();
    formData.append("nombreMascota", newReport.name);
    formData.append("lat", newReport.location.lat.toString());
    formData.append("lng", newReport.location.lng.toString());
    formData.append("ciudad", newReport.city);
    formData.append("pais", newReport.country);
    formData.append("imagen", newReport.img);
    const res = await fetch(`${API_BASE_URL}/misreportes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    if (!res.ok) {
      // El servidor respondió con error (400, 500, etc)
      const errorText = await res.text();
      throw new Error(`Error al enviar reporte: ${errorText}`);
    }

    const data = await res.json(); 
    console.log("Reporte enviado correctamente:", data); // <------------------ DELETE ------------
    return data;
  } catch (err) {
    console.error("Error al enviar reporte:", err); // <------------------ DELETE ------------
    throw err;
  }
}
// PRE: Se recibe un token válido y un id numérico existente del reporte
// POST: Retorna los datos del reporte y la imagen convertida a File, o lanza un error si falla la petición
const getMiReporteByIdApi: IGetMiReporteById = async (token: string, id: number) => { 
  const res = await fetch(`${API_BASE_URL}/misreportes/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener reporte (status ${res.status}): ${errorText}`);
  }

  const data = await res.json();

  const imgBlob = await fetch(data.imgUrl).then((r) => r.blob());
  const imgFile = new File([imgBlob], "reporte.jpg", {
    type: imgBlob.type || "image/jpeg",
  });

  return {
    name: data.name,
    city: data.city,
    country: data.country,
    location: data.location,
    img: imgFile,
  };
}
// PRE: Se reciben un token válido, un id existente y un objeto newReport con datos correctos
// POST: Actualiza el reporte y retorna la respuesta JSON o lanza un error si falla la petición
const editarReporteMascotaApi: IEditarReporteMascota = async (token: string, id: number, newReport: DtReporte) => { 
  try {
    const formData = new FormData();
    formData.append("nombreMascota", newReport.name);
    formData.append("lat", newReport.location.lat.toString());
    formData.append("lng", newReport.location.lng.toString());
    formData.append("ciudad", newReport.city);
    formData.append("pais", newReport.country);
    formData.append("imagen", newReport.img);
    const res = await fetch(`${API_BASE_URL}/misreportes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    if (!res.ok) {
      // El servidor respondió con error (400, 500, etc)
      const errorText = await res.text();
      throw new Error(`Error al enviar reporte: ${errorText}`);
    }

    const data = await res.json(); 
    console.log("Reporte enviado correctamente:", data); // <------------------ DELETE ------------
    return data;
  } catch (err) {
    console.error("Error al enviar reporte:", err); // <------------------ DELETE ------------
    throw err;
  }
}

export {
  getMascotasCercaApi,
  enviarReporteMascota,
  getMisMascotasReportadasApi,
  altaReporteMascotaApi,
  getMiReporteByIdApi,
  editarReporteMascotaApi,
}