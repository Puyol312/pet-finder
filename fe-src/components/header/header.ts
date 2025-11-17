import { State } from "../../state";

export default function getHeader(): HTMLElement {
  const state = State.getInstance();
  const logo = new URL('../../assets/img/logo.png', import.meta.url).href;

  const header = document.createElement("div");

  function render() {
    const userName = state.getState()?.user?.email ?? null;

    header.innerHTML = `
      <nav class="navbar bg-body-tertiary fixed-top" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="/home">
            <img src="${logo}" alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
            PetFinder
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="offcanvas offcanvas-end" id="offcanvasNavbar">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title">Pet Finder</h5>
              <button class="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
              <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item"><a class="nav-link" href="/mascotas">Mascotas Reportadas</a></li>
              <li class="nav-item"><a class="nav-link" href="/reportarmascota">Mis Mascota Reportadas</a></li>
                <li class="nav-item"><a class="nav-link" href="/reportarnuevamascota">Reportar Nueva Mascota</a></li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="/me" data-bs-toggle="dropdown">Usuario</a>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="/signin">Iniciar sesión</a></li>
                    <li><a class="dropdown-item" href="/signup">Registrarse</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a id="btnLogout" class="dropdown-item" href="/home">Cerrar sesión</a></li>
                  </ul>
                </li>
              </ul>
              <div class="mt-4 text-center small text-secondary user-info-text">
                ${userName ? `${userName}` : "Usuario no registrado"}
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  render();
  header.querySelector('#btnLogout')?.addEventListener('click', (e) => { 
    e.stopPropagation();
    State.getInstance().clearUser();
  })
  state.subscribe(() => {
    render();
  });

  return header;
}
