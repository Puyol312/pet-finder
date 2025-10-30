import { initHome } from "./pages/home";
import { initMascotas } from "./pages/mascotas";
// import { initGame } from "./pages/game";
// import { initResult } from "./pages/result";

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
  // {
  //   path: /\/step-2/,
  //   component:initGame
  // },
  // {
  //   path: /\/step-3/,
  //   component:initResult
  // }
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