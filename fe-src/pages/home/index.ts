import getHeader from "../../components/header/header";
import { State } from "../../state";

//@ts-ignore
import './home.css'

function handleHelpClick(router: any) {
  router.goTo('/help');
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
      router.goTo('/mascotas');
    },
    (error) => {
      console.error("Error al obtener la ubicación:", error);
      router.goTo('/help');
    }
  );
}

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

export function initHome(router: any): HTMLElement {
  const state = State.getInstance();
  const userEmail = state.getState()?.user?.email ?? null;
  const imgHome = new URL('./undraw_beach_day_cser 1.png', import.meta.url).href;

  const header = getHeader({ userEmail });

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
  homePage.append(header, body);

  enrutarBotones(homePage, router, state);

  return homePage;
}