import { State } from "../../state";
import { Geolocation } from "../../types/types-state";
import { PetWanted } from "../../types/types-cards";

//@ts-ignore
import "./mascotas.css"

import getHeader from "../../components/header/header";
import { getMascotasCercaTest as getMascotasCerca } from '../../utils/mascotas/obtenerMascotas'

function agregarTarjeta({ name, img, city, street, id }: PetWanted, contenedor: HTMLElement) {
  const col = document.createElement('div');
  col.classList.add('col');

  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'shadow-sm');
  card.innerHTML = `
    <img src="${img}" class="card-img-top" alt="Foto de ${name}" style="max-width:100%; max-height:200px; object-fit:cover;">
    <div class="card-body">
      <h5 class="card-title">${name}</h5>
      <p class="card-text">${street}, ${city}</p>
      <button class="btn btn-primary open-form" data-id="${id}">Reportar</button>
    </div>
  `;

  col.appendChild(card);
  contenedor.appendChild(col);
}
// POST: debe devolver un formulario con id="info-form", con un boton de submit, y con los campos:  
function getFormulario(): string {
  return `
  <form id="info-form">
      <h3>Formulario</h3>
      <label>Mensaje:</label>
      <input type="text" name="mensaje" />
      <button type="submit">Enviar</button>
  </form>
  `;
}
function handleClickForm(container: HTMLElement) {
  // Delegación de eventos: click en botón "Reportar"
  container.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".open-form");
    if (!(btn instanceof HTMLButtonElement)) return;
    e.stopPropagation();
    const id = btn.dataset.id;
    if (!id) return;

    // Mostrar formulario
    const formContainer = document.querySelector("#form-container") as HTMLElement;
    if (!formContainer) return;
    formContainer.classList.remove("hidden");
    
    // Insertar o actualizar input hidden con el id de la tarjeta
    let hiddenInput = formContainer.querySelector<HTMLInputElement>('input[name="cardId"]');
    if (!hiddenInput) {
      hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "cardId";
      formContainer.querySelector("#info-form")!.appendChild(hiddenInput);
    }
    hiddenInput.value = id;
  });
}
function handleClickOutsideForm(formContainer: HTMLElement) {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    e.stopPropagation();

    // Si el formulario está oculto, no hacer nada
    if (formContainer.classList.contains("hidden")) return;

    // Si el click es dentro del formulario, tampoco hacer nada
    if (formContainer.contains(target)) return;

    // Si llegamos acá, el click fue fuera → ocultar formulario
    formContainer.classList.add('hidden');
  });
}
function handleFormSubmit(formContainer: HTMLElement) { 
  const form = formContainer.querySelector('#info-form') as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = new FormData(form as HTMLFormElement);
    const payload = Object.fromEntries(data.entries());

    console.log("Enviando al back:", payload);

    // Cerrar formulario
    formContainer.classList.add('hidden');

    // Limpiar formulario si querés
    form.reset();
  });
}
export function initMascotas(router: any): HTMLElement {
  const state = State.getInstance();
  const geolocation = state.getState()?.geolocation;
  const userEmail = state.getState()?.user?.email ?? null;
  const header = getHeader({ userEmail });
  
  // Crear elementos base
  const body = document.createElement('div');
  body.classList.add('container', 'my-5');

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-center', 'g-4');
  row.id = 'cards-container';
  row.innerHTML = `<p class="text-center">Cargando mascotas cerca de usted...</p>`;

  body.appendChild(row);

  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';
  formContainer.classList.add('hidden');
  formContainer.innerHTML = getFormulario();


  const mascotasPage = document.createElement("div");
  mascotasPage.classList.add('mascotas');
  mascotasPage.append(header, body, formContainer);

  if (!geolocation) {
    console.warn("No se encontró la geolocalización en el estado.");
    router.goTo('/home');
    return mascotasPage;
  }

  (async () => {
    const mascotasCerca = await getMascotasCerca(geolocation);

    if (!mascotasCerca || mascotasCerca.length === 0) {
      row.innerHTML = `<p>No hay mascotas perdidas cerca de usted.</p>`;
    } else {
      row.innerHTML = '';
      mascotasCerca.forEach((tarjeta) => agregarTarjeta(tarjeta, row));
    }
  })();
  
  handleClickForm(row);
  handleClickOutsideForm(formContainer);
  handleFormSubmit(formContainer);

  return mascotasPage;
}