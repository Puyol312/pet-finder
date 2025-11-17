import { State } from "../../state";

import getHeader from "../../components/header/header";
import { getFooter } from "../../components/footer";

//@ts-ignore
import './home.css'

// PRE: router es válido
// POST: Redirige al usuario a la ruta /help
function handleHelpClick(router: any) {
  router.goTo('/help');
}
// PRE: router y state son válidos; navegador soporta geolocation o se maneja el fallback
// POST: Si se obtiene ubicación, se guarda en state y se navega a /mascotas; si falla o no hay geolocación, se navega a /help
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
      router.goTo('/mascotas');
    },
    (error) => {
      console.error("Error al obtener la ubicación:", error);
      router.goTo('/help');
    }
  );
}
// PRE: homePage contiene los botones #help y #location; router y state son válidos
// POST: Se vinculan los botones a sus handlers correspondientes; si faltan botones, se aborta sin fallar
function enrutarBotones(homePage: HTMLElement, router: any, state: State) {
  const helpButton = homePage.querySelector<HTMLButtonElement>('#help');
  const ubiButton = homePage.querySelector<HTMLButtonElement>('#location');

  if (!helpButton || !ubiButton) {
    console.error("Botones de la página Home nulos.");
    return;
  }

  helpButton.addEventListener('click', () => handleHelpClick(router));
  ubiButton.addEventListener('click', () => handleLocationClick(router, state));
}
// PRE: router es válido; State disponible; getHeader() y enrutarBotones() existen
// POST: Se crea y retorna la página de inicio con botones configurados y header renderizado
export function initHome(router: any): HTMLElement {
  const state = State.getInstance();
  const imgHome = new URL('./undraw_beach_day_cser 1.png', import.meta.url).href;

  const header = getHeader();
  const footer = getFooter();

  const body = document.createElement("div");
  body.classList.add("home__body");
  body.innerHTML = `
    <img src="${imgHome}" alt="foto-playa">
    <h2 class="text-pink-custom">Pet Finder App</h2>
    <p class="text-simple">Encontrá y reportá mascotas perdidas cerca de tu ubicación</p>
    <div class="home__body__buttons">
      <button id="location" type="button" class="btn btn-primary">Dar mi ubicación actual</button>
      <button id="help" type="button" class="btn btn-success">¿Cómo funciona Pet Finder?</button>
    </div>
  `;

  const homePage = document.createElement("div");
  homePage.classList.add('home');
  homePage.append(header, body, footer);

  enrutarBotones(homePage, router, state);

  return homePage;
}