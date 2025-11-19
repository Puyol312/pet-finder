import { PetWanted, DtReporte } from "./types-mascota";
import { Geolocation, User } from "./types-state";

type ReporteResponse = { message: string; reporteId: number; };
type IEnviarReporte = (name: string, tel: string, message: string, reportId: number) => Promise<ReporteResponse>;
type IAltaReporteMascota = (token: string, newReport:DtReporte) => Promise<ReporteResponse>;
type IEditarReporteMascota = (token: string, id:number, newReport:DtReporte) => Promise<ReporteResponse>;
type IGetMiReporteById = (token: string, id: number) => Promise<DtReporte>;
type IGetMascotas = (user: User) => Promise<PetWanted[] | null>;
type IGetMascotasCerca = ({ lat, lng }: Geolocation) => Promise<PetWanted[] | null>;
type IverificarUsuario = (email: string, password: string) => Promise<string>;
type IcrearUsuario = (email: string, password: string) => Promise<string>;


export { 
  ReporteResponse,
  IEnviarReporte,
  IAltaReporteMascota,
  IEditarReporteMascota,
  IGetMascotas,
  IGetMiReporteById,
  IGetMascotasCerca,
  IverificarUsuario,
  IcrearUsuario
}