export default function getHeader({ userName }: any): HTMLElement {
  const logo = new URL('../../assets/img/logo.png', import.meta.url).href;
  const header = document.createElement("div");
  header.innerHTML = `
    <nav class="navbar bg-body-tertiary fixed-top" data-bs-theme="dark">
      <div class="container-fluid">
            <a class="navbar-brand" href="/home">
              <img src=${logo} alt="Logo" width="30" height="24" class="d-inline-block align-text-top">
              PetFinder
            </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Pet Finder</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/me">Mis Datos</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/mascotasReportada" >Mascotas Reportadas</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/reportarMascota" >Reportar nueva Mascota</a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Usuario
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/logIn">Iniciar sesion</a></li>
                  <li><a class="dropdown-item" href="/config">Configuraciones</a></li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li><a class="dropdown-item" href="/logout">Cerrar sesion</a></li>
                </ul>
              </li>
            </ul>
            <div class="mt-4 text-center small text-secondary">
              ${userName ? `Usuario: ${userName}` : "Usuario no registrado"}
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;
  return header;
}