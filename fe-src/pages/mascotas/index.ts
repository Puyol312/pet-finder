import { State } from "../../state";
import { Geolocation } from "../../types/types-state";
import { PetWanted } from "../../types/types-cards";

//@ts-ignore
import "./mascotas.css"

import getHeader from "../../components/header/header";
import { getMascotasCercaTest as getMascotasCerca } from '../../utils/mascotas/obtenerMascotas'

//PRE: Todos los datos existen y no son nulos.
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
      <button class="btn btn-primary open-form" data-id="${id}" data-name="${name}">Reportar</button>
    </div>
  `;

  col.appendChild(card);
  contenedor.appendChild(col);
}
// POST: debe devolver un formulario con id="info-form", un campo texto corto "nombre", un campo numerico "telefono", y un text area "Donde"
function getFormulario(): string {
  return `
  <form id="info-form">
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
    const name = btn.dataset.name;
    if (!id || !name) return;

    // Mostrar formulario
    const formContainer = document.querySelector("#form-container") as HTMLElement;
    const overlay = document.querySelector("#overlay") as HTMLElement;
    if (!formContainer) return;
    formContainer.classList.remove("hidden");
    overlay.classList.remove("hidden");
    
    // Insertar o actualizar input hidden con el id de la tarjeta
    let hiddenInput = formContainer.querySelector<HTMLInputElement>('input[name="cardId"]');
    if (!hiddenInput) {
      hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "cardId";
      formContainer.querySelector("#info-form")!.appendChild(hiddenInput);
    }
    hiddenInput.value = id;
    // Insertar o actualizar h3 con el name de la tarjeta
    let titleName = formContainer.querySelector<HTMLHeadingElement>('#dog_name');
    const form = formContainer.querySelector<HTMLFormElement>('#info-form')!;
    if (!titleName) {
      titleName = document.createElement('h3');
      // ToDo: agregarle los estilso al titulo 
      titleName.id = 'dog_name';
      formContainer.querySelector("#info-form")!.appendChild(titleName);
      form.insertBefore(titleName, form.firstChild);
    }
    titleName.innerText = `Reportar info de ${name} `
  });
}
function handleClickOutsideForm(formContainer: HTMLElement, overlay: HTMLElement) {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    e.stopPropagation();

    // Si el formulario está oculto, no hacer nada
    if (formContainer.classList.contains("hidden") && overlay.classList.contains("hidden")) return;

    // Si el click es dentro del formulario, tampoco hacer nada
    if (formContainer.contains(target)) return;

    // Si llegamos acá, el click fue fuera → ocultar formulario
    formContainer.classList.add('hidden');
    overlay.classList.add('hidden');
  });
}
function handleFormSubmit(formContainer: HTMLElement, overlay: HTMLElement) { 
  const form = formContainer.querySelector('#info-form') as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = new FormData(form as HTMLFormElement);
    const payload = Object.fromEntries(data.entries());

    console.log("Enviando al back:", payload);

    // Cerrar formulario
    formContainer.classList.add('hidden');
    overlay.classList.add('hidden');

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

  const overlay = document.createElement('div');
  overlay.id = 'overlay';
  overlay.classList.add('hidden');

  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';
  formContainer.classList.add('hidden');
  formContainer.innerHTML = getFormulario();


  const mascotasPage = document.createElement("div");
  mascotasPage.classList.add('mascotas');
  mascotasPage.append(header, body, overlay, formContainer);

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
  handleClickOutsideForm(formContainer, overlay);
  handleFormSubmit(formContainer, overlay);

  return mascotasPage;
}