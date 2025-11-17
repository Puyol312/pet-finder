import { API_BASE_URL } from "../../config";
type IverificarUsuario = (email: string, password: string) => Promise<string>;
type IcrearUsuario = (email: string, password: string) => Promise<string>;

// --- Log in Usuario ---
const verificarUsuario: IverificarUsuario = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    throw err.message || "Error en login";
  }

  const data = await res.json();
  return data.token;
}
const verificarUsuarioOk: IverificarUsuario = (email: string, password: string) => { 
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve('tokenfalso');
    }, 2000)
  });
} 
const verificarUsuarioError: IverificarUsuario = (email: string, password: string) => {
  return new Promise<string>((_resolve, reject) => {
    setTimeout(() => {
      reject("Error al verificar usuario: Simulacro de error");
    }, 2000);
  });
}
// --- Alta Usuario ---
const crearUsuario: IcrearUsuario = async (email: string, password: string) => { 
    const res = await fetch(`${API_BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const err = await res.json();
    throw err.message || "Error en signup";
  }

  const data = await res.json();
  return data.token;
}
const crearUsuarioOk: IcrearUsuario = (email: string, password: string) => { 
  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve('tokenfalso');
    }, 2000)
  });
}
const crearUsuarioError: IcrearUsuario = (email: string, password: string) => { 
  return new Promise<string>((_resolve, reject) => {
    setTimeout(() => {
      reject("Error al verificar usuario: Simulacro de error");
    }, 2000);
  });
}
// --- Obtener Mis Datos ---  
// --- Exportaciones ---
export const controladorUsuario = {
  crearUsuario: crearUsuario,
  verificarUsuario: verificarUsuario,
}
export { verificarUsuario, verificarUsuarioOk, verificarUsuarioError, crearUsuario, crearUsuarioOk, crearUsuarioError }