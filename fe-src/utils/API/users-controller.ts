import { API_BASE_URL } from "../../config";
import { IverificarUsuario, IcrearUsuario } from "../../types/types-controlador";

// PRE: Se reciben email y password válidos (strings no vacíos)
// POST: Retorna el token JWT si las credenciales son correctas o lanza un error si falla la autenticación
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
// PRE: Se reciben email y password válidos (strings no vacíos)
// POST: Retorna el token JWT generado tras crear el usuario o lanza un error si ocurre un fallo en el registro
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
export {
  verificarUsuario,
  crearUsuario,
}