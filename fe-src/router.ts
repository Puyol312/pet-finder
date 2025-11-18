import { initHome } from "./pages/Home";
import { initMascotas } from "./pages/Reportes";
import { initSignIn } from "./pages/SignIn";
import { initSignUp } from "./pages/SignUp";
import { initReportarMascotas } from "./pages/MisReportes";
import { initReportarNuevaMascota } from "./pages/NuevoReporte";
import { initEditarReporteMascota } from "./pages/EditarReporte";
import { initHelp } from "./pages/help";

const basePath = "/petfinder";

const routes = [
  {
    path: /\/home/,
    component:initHome
  },
  {
    path: /\/mascotas/,
    component:initMascotas
  },
  {
    path: /\/signin/,
    component:initSignIn
  },
  {
    path: /\/signup/,
    component:initSignUp
  },
  {
    path: /\/reportarmascota/,
    component:initReportarMascotas
  },
  {
    path: /\/reportarnuevamascota/,
    component:initReportarNuevaMascota
  },
  {
    path: /\/editarreportemascota\/(.+)/,
    component:initEditarReporteMascota
  },
  {
    path: /\/help/,
    component:initHelp
  }
];

export function initRouter(container: Element) {

  function goTo(path:string) { 
    history.pushState({}, "", basePath + path);
    handleRoute(path);
  }
  function getCurrentPath() {
    return location.pathname.replace(basePath, "") || "/";
  }
  function handleRoute(route:any) {
    let found = false;

    for (const r of routes) {
      if (r.path.test(route)) {
        const el = r.component({ goTo: goTo });
        if (container.firstChild) {
          container.firstChild.remove();
        }
        container.appendChild(el);
        found = true;
        break;
      }
    }

    // Si no se encontró ninguna ruta, redirigimos a /home
    if (!found) {
      goTo("/home");
    }
  }

  if (getCurrentPath() == "/") {
    goTo("/home")
  } else { 
    handleRoute(getCurrentPath());
  }
  //para poder que funcione para atras y para adelante
  window.onpopstate = function (event) { 
    handleRoute(getCurrentPath());
  }
}