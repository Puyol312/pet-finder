import Swal from "sweetalert2";

import { State } from "../../state"

import getHeader from "../../components/header/header";
import { getFooter } from "../../components/footer";

import { verificarUsuario as verificarUsuario } from '../../utils/API/users-controller';

function getBody(): HTMLElement { 
  const img = new URL('./undraw_login_re_4vu2 1.svg', import.meta.url).href;
  const section = document.createElement('section');
  section.classList.add('vh-100');
  section.innerHTML = `
<div class="container-fluid d-flex align-items-center justify-content-center py-5" style="min-height: calc(100vh - 70px); background: #f8f9fa;">
  <div class="row w-100 justify-content-center align-items-center">

    <!-- Imagen -->
    <div class="col-12 col-md-6 d-flex justify-content-center mb-4 mb-md-0">
      <img 
        src="${img}" 
        alt="Login Illustration"
        class="img-fluid"
        style="max-width: 330px;"
      >
    </div>

    <!-- Formulario -->
    <div class="col-12 col-md-5 col-lg-4">
      <div class="p-4 p-md-5 bg-white shadow rounded">
        
        <h3 class="mb-4 text-center text-md-start fw-bold">Iniciar sesión</h3>

        <div id="login-error" class="alert alert-danger py-2 text-center d-none"></div>
        
        <form id="login-form">
          
          <div class="mb-3">
            <label for="email" class="form-label"><strong>Email</strong></label>
            <input id="email" type="email" class="form-control" placeholder="example@gmail.com" required>
          </div>

          <div class="mb-3">
            <label for="pass" class="form-label"><strong>Contraseña</strong></label>
            <input id="pass" type="password" class="form-control" placeholder="Tu contraseña" required>
          </div>

          <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="form-check m-0">
              <input class="form-check-input" type="checkbox" id="remember">
              <label class="form-check-label" for="remember">
                Recordarme
              </label>
            </div>
            <a href="/helppassword" class="text-primary small">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" class="btn btn-primary w-100 py-2 mb-2">Ingresar</button>

          <p class="mt-3 text-center small">
            ¿No tenés cuenta?
            <a href="/signup" class="text-primary fw-bold">Registrate</a>
          </p>

        </form>
      </div>
    </div>

  </div>
</div>
  `;
  return section;
}
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
function handleSubmit(form: HTMLFormElement, errorBox: HTMLElement, state: State, router: any) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailEl = form.querySelector<HTMLInputElement>("#email");
    const passEl = form.querySelector<HTMLInputElement>("#pass");
    const rememberEl = form.querySelector<HTMLInputElement>("#remember");

    const email = emailEl?.value.trim() ?? "";
    const pass = passEl?.value.trim() ?? "";
    const remember = rememberEl?.checked ?? false;

    if (!email || !pass) {
      errorBox.textContent = "Completá email y contraseña";
      errorBox.classList.remove("d-none");
      setTimeout(() => errorBox.classList.add("d-none"), 5000);
      return;
    }

    try {
      const token = await verificarUsuario(email, pass);

      state.setUser({
        email,
        token,
        record: remember,
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
      errorBox.textContent = String(err) || "Error iniciando sesión";
      errorBox.classList.remove("d-none");
      setTimeout(() => errorBox.classList.add("d-none"), 5000);
    }
  });
}
export function initSignIn(router: any): HTMLElement {
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
    setTimeout(() => router.goTo("/reportarmascota"), 0);
    return container;
  }
  const header = getHeader();
  const footer = getFooter();
  const body = getBody();

  const singInPage = document.createElement('div');
  singInPage.classList.add('singInPage');
  singInPage.append(header, body, footer);

  handleSubmit(body.querySelector<HTMLFormElement>('#login-form')!, body.querySelector<HTMLElement>('#login-error')!, state, router);
  return singInPage;
}