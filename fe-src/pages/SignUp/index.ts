import { State } from "../../state"
import getHeader from "../../components/header/header";
import { getFooter } from "../../components/footer";
import { crearUsuario as crearUsuario } from '../../utils/API/users-controller';

//@ts-ignore
import './signup.css'
import Swal from "sweetalert2";

// PRE: Requiere acceso al recurso SVG
// POST: Retorna un elemento <section> con el formulario de registro completamente estructurado
function getBody(): HTMLElement { 
  const img = new URL('./Mobile login-amico.svg', import.meta.url).href;
  const section = document.createElement('section');
  section.classList.add('vh-100');
  section.innerHTML = `
<div class="container-fluid d-flex align-items-center justify-content-center py-5" style="min-height: calc(100vh - 70px); background: #f8f9fa;">
  <div class="row w-100 justify-content-center align-items-center">

    <!-- Imagen -->
    <div class="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
      <img 
        src="${img}" 
        alt="Register Illustration"
        class="img-fluid"
        style="max-width: 330px;"
      >
    </div>

    <!-- Formulario -->
    <div class="col-12 col-md-5 col-lg-4">
      <div class="p-4 p-md-5 bg-white shadow rounded">
        
        <h3 class="mb-4 text-center text-md-start fw-bold">Crear cuenta</h3>

        <div id="logup-error" class="alert alert-danger py-2 text-center d-none"></div>
        
        <form id="logup-form">
          
          <div class="mb-3">
            <label for="email" class="form-label"><strong>Email</strong></label>
            <input id="email" type="email" class="form-control" placeholder="example@gmail.com" required>
          </div>

          <div class="mb-3">
            <label for="pass" class="form-label"><strong>Contraseña</strong></label>
            <input id="pass" type="password" class="form-control" placeholder="Tu contraseña" required>
          </div>

          <div class="mb-3">
            <label for="confirm" class="form-label"><strong>Confirmar contraseña</strong></label>
            <input id="confirm" type="password" class="form-control" placeholder="Confirmar contraseña" required>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 mb-2">Crear cuenta</button>

          <p class="mt-3 text-center small">
            ¿Ya tenés una cuenta?
            <a href="/signin" class="text-primary fw-bold">Iniciar sesión</a>
          </p>

        </form>
      </div>
    </div>

  </div>
</div>

  `;
  return section;
}
// PRE: router y state son válidos; navegador soporta geolocation o se maneja el fallback
// POST: Si se obtiene ubicación, se guarda en state y se navega a /reportarmascota; si falla, se redirige a /help
function handleLocationClick(router: any, state: State) {
  if (!("geolocation" in navigator)) {
    router.goTo('/help');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      state.setGeolocation(geolocation);
      router.goTo('/reportarmascota');
    },
    (error) => {
      console.error("Error al obtener la ubicación:", error);
      router.goTo('/help');
    }
  );
}
// PRE: El formulario, el contenedor de errores, el estado global (state) y el router son válidos. 
//      La función crearUsuario y handleLocationClick están definidas. 
//      El formulario contiene los campos #email, #pass y #confirm.
// POST: Al enviar el formulario:
//       - Si faltan campos o las contraseñas no coinciden, se muestra un mensaje de error temporal.
//       - Si los datos son válidos, se crea el usuario, se guarda en state (email, token, record=true).
//       - Si el usuario tiene ubicación, se redirige a /reportarmascota.
//       - Si no tiene ubicación, se muestra una alerta y se solicita ubicación mediante handleLocationClick.
//       - En caso de error en la creación del usuario, se muestra un mensaje de error temporal.
function handleSubmit(form: HTMLFormElement, errorBox: HTMLElement, state: State, router: any) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailEl = form.querySelector<HTMLInputElement>("#email");
    const passEl = form.querySelector<HTMLInputElement>("#pass");
    const confirmPassEl = form.querySelector<HTMLInputElement>("#confirm");

    const email = emailEl?.value.trim() ?? "";
    const pass = passEl?.value.trim() ?? "";
    const confirm = confirmPassEl?.value.trim() ?? "";

    if (!email || !pass || !confirm) {
      errorBox.textContent = "Completá email, contraseña y confirmacion";
      errorBox.classList.remove("d-none");
      setTimeout(() => errorBox.classList.add("d-none"), 5000);
      return;
    }

    if (pass !== confirm) { 
      errorBox.textContent = "contraseña y confirmacion diferentes";
      errorBox.classList.remove("d-none");
      setTimeout(() => errorBox.classList.add("d-none"), 5000);
      return;
    }

    try {
      const token = await crearUsuario(email, pass);

      state.setUser({
        email,
        token,
        record: true,
      });
      if (state.EstaUbicado()) {
        router.goTo('/reportarmascota');
      } else {
        Swal.fire({
          icon: 'error',
          title: '¡Se requiere ubicacion!',
          text: 'Para continuar se requiere su ubicacion.',
          timer: 2000,
          showConfirmButton: false
        });
        handleLocationClick(router, state);
      }
    } catch (err) {
      errorBox.textContent = String(err) || "Error al momento de registrarse";
      errorBox.classList.remove("d-none");
      setTimeout(() => errorBox.classList.add("d-none"), 5000);
    }
  });
}
// PRE: router tiene goTo(); State, getHeader, getFooter, getBody y handleSubmit están definidos.
// POST: Devuelve el elemento de registro. Si el usuario ya está registrado, lo redirige a /mascotas (pidiendo ubicación si falta). Si no, genera la vista y configura el formulario.
export function initSignUp(router: any): HTMLElement {
  // Data del usuario
  const state = State.getInstance();

  const container = document.createElement("div");
  if (state.EstaUsuarioRegistrado()) {
    if (!state.EstaUbicado()) {
      Swal.fire({
          icon: 'error',
          title: '¡Se requiere ubicacion!',
          text: 'Para continuar se requiere su ubicacion.',
          timer: 2000,
          showConfirmButton: false
      });
      handleLocationClick(router, state);
    }
    setTimeout(() => router.goTo("/mascotas"), 0);
    return container;
  }
  
  const header = getHeader();
  const footer = getFooter();
  const body = getBody();

  const singUpPage = document.createElement('div');
  singUpPage.classList.add('singUpPage');
  singUpPage.append(header, body, footer);

  handleSubmit(body.querySelector<HTMLFormElement>('#logup-form')!, body.querySelector<HTMLElement>('#logup-error')!, state, router);
  return singUpPage;
}