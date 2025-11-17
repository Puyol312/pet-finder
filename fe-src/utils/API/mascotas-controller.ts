import { PetWanted, DtReporte } from "../../types/types-mascota";
import { Geolocation, User } from "../../types/types-state";
import { API_BASE_URL } from "../../config";

type ReporteResponse = { message: string; reporteId: number; };
type IEnviarReporte = (name: string, tel: string, message: string, reportId: number) => Promise<ReporteResponse>;
type IAltaReporteMascota = (token: string, newReport:DtReporte) => Promise<ReporteResponse>;
type IEditarReporteMascota = (token: string, id:number, newReport:DtReporte) => Promise<ReporteResponse>;
type IGetMiReporteById = (token: string, id: number) => Promise<DtReporte>;
type IGetMascotas = (user: User) => Promise<PetWanted[] | null>;
type IGetMascotasCerca = ({ lat, lng }: Geolocation) => Promise<PetWanted[] | null>;

// --- Obtener Reportes ---

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
// PRE: Se reciben coordenadas válidas (lat, lng)
// POST: Retorna una lista mock de mascotas para pruebas sin realizar peticiones reales
const getMascotasCercaTest: IGetMascotasCerca = async ({lat,lng}) => { 
  const datosMock: PetWanted[] = [
    {
      name: 'Test 1',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum1",
      city: 'loremipsum1',
      id:1
    },
    {
      name: 'Test 2',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum2",
      city: 'loremipsum2',
      id:2
    },
    {
      name: 'Test 3',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum3",
      city: 'loremipsum3',
      id:3
    },
    {
      name: 'Test 4',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum4",
      city: 'loremipsum4',
      id:4
    },
    {
      name: 'Test 5',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum5",
      city: 'loremipsum5',
      id:5
    },
  ];
  return datosMock; 
}
// --- Reportar Mascota cerca ---

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
// PRE: Se reciben parámetros válidos (name, tel, message, reportId)
// POST: Retorna una promesa resuelta simulando una respuesta exitosa del backend tras 2 segundos
const enviarReporteMascotaOk: IEnviarReporte = async (name: string, tel: string, message: string, reportId: number) => {
  return new Promise<ReporteResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Todo salió bien.",
        reporteId: 20
      });
    }, 2000);
  });
}
// PRE: Se reciben parámetros válidos (name, tel, message, reportId)
// POST: Lanza un error simulado para probar el manejo de fallos en el envío de reportes
const enviarReporteMascotaError: IEnviarReporte = async (name: string, tel: string, message: string, reportId: number) => {
  throw new Error(`Error al enviar reporte: Simulacro de error`);
}
// --- Obtener mis reportes ---

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
// PRE: Se recibe un usuario válido (user)
// POST: Retorna una lista mock de mascotas reportadas para pruebas sin realizar peticiones reales
const getMisMascotasReportadasTest: IGetMascotas = async (user: User) => { 
   const datosMock: PetWanted[] = [
    {
      name: 'Test 1',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum1",
      city: 'loremipsum1',
      id:1
    },
    {
      name: 'Test 2',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum2",
      city: 'loremipsum2',
      id:2
    },
    {
      name: 'Test 3',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum3",
      city: 'loremipsum3',
      id:3
    },
    {
      name: 'Test 4',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum4",
      city: 'loremipsum4',
      id:4
    },
    {
      name: 'Test 5',
      img: 'https://lipsum.app/640x480/',
      street: "loremipsum5",
      city: 'loremipsum5',
      id:5
    },
  ];
  return datosMock;
}
// --- Alta reporte mascota --- 

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
const altaReporteMascotaOk: IAltaReporteMascota = async (token: string, newReport:DtReporte) => {
    return new Promise<ReporteResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Todo salió bien.",
        reporteId: 20
      });
    }, 2000);
  });
}
const altaReporteMascotaError: IAltaReporteMascota = async (token: string, newReport:DtReporte) => {
  throw new Error(`Error al enviar reporte: Simulacro de error`);
}
// --- Obtener mi reporte ---

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
const getMiReporteByIdOk: IGetMiReporteById = async (token: string, id: number) => { 
  const imagen = new File(["contenido falso"], "mascota.jpg", { type: "image/jpeg" });
  const [latitud, longitud, nombre, ciudad, pais] = [10, -20, 'testNombre', 'testCity', 'testPais'];
  return {
    location: { lat: latitud, lng: longitud },
    name: nombre,
    city: ciudad,
    country: pais,
    img:imagen
  }
}
const getMiReporteByIdError: IGetMiReporteById = async (token: string, id: number) => { 
  throw new Error(`Error al obtener reporte simulacro (status 404)`);
}

// --- Editar Reporte ---
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
const editarReporteMascotaOk: IEditarReporteMascota = async (token: string, id: number, newReport: DtReporte) => { 
  return new Promise<ReporteResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Todo salió bien.",
        reporteId: 20
      });
    }, 2000);
  });
}
const editarReporteMascotaError: IEditarReporteMascota = async (token: string, id: number, newReport: DtReporte) => { 
  throw new Error(`Error al enviar reporte: Simulacro de Error`);
}
// --- Exportaciones ---

//Produccion
export const controladorMascotas = {
  getMascotasCerca: getMascotasCercaApi,
  enviarReporteMascota: enviarReporteMascota,
  getMisMascotasReportadas: getMisMascotasReportadasApi,
  altaReporteMascota: altaReporteMascotaApi,
  getMiReporteById: getMiReporteByIdApi,
  editarReporteMascota:editarReporteMascotaApi
};
//Desarrollo
export {
  getMascotasCercaApi,
  getMascotasCercaTest,
  enviarReporteMascota,
  enviarReporteMascotaOk,
  enviarReporteMascotaError,
  getMisMascotasReportadasApi,
  getMisMascotasReportadasTest,
  altaReporteMascotaApi,
  altaReporteMascotaOk,
  altaReporteMascotaError,
  getMiReporteByIdApi,
  getMiReporteByIdOk,
  getMiReporteByIdError,
  editarReporteMascotaApi,
  editarReporteMascotaOk,
  editarReporteMascotaError
}