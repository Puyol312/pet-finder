import { State } from "../../state";
import { Geolocation } from "../../types/types-state";
import { PetWanted } from "../../types/types-mascota";

//@ts-ignore
import "./mascotas.css"
import Swal from "sweetalert2";

import getHeader from "../../components/header/header";
import {
  getMascotasCercaTest as getMascotasCerca,
  enviarReporteMascota as enviarReporteMascota
} from '../../utils/API/mascotas-controller';

// PRE: Todos los datos de la tarjeta existen y no son nulos; contenedor es un HTMLElement válido
// POST: Se crea y agrega una tarjeta al contenedor con imagen, info y botón "Reportar"
function agregarTarjeta({ name, img, city, street, id }: PetWanted, contenedor: HTMLElement) {
  const reportSVG = new URL('./IconParkTwotoneReport.svg', import.meta.url).href;
  const col = document.createElement('div');
  col.classList.add('col');

  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'shadow-sm');
  card.innerHTML = `
    <div class="card bg-dark text-light border-secondary shadow">
      <img src="${img}" class="card-img-top" alt="Foto de ${name}" style="max-width:100%; max-height:200px; object-fit:cover;">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${street}, ${city}</p>
        <button class="btn btn-success open-form d-flex align-items-center gap-2" data-id="${id}" data-name="${name}">
          <img src="${reportSVG}" alt="Editar" style="width:18px; height:18px;">
          Reportar
        </button>
      </div>
    </div>
  `;

  col.appendChild(card);
  contenedor.appendChild(col);
}
// PRE: -
// POST: debe devolver un formulario en string con id="info-form", un campo texto corto "nombre", un campo string "telefono", y un text area "Donde".
function getFormulario(): string {
  return `
  <form id="info-form" class="p-4 rounded shadow w-100 bg-dark text-light" style="max-width: 500px;">
    <!-- Título dinámico -->

    <!-- Nombre -->
    <div class="mb-3">
      <label for="name" class="form-label fw-bold">Nombre</label>
      <input type="text" class="form-control" id="name" name="name" placeholder="Ingresa tu nombre" required>
    </div>

    <!-- Teléfono -->
    <div class="mb-3">
      <label for="tel" class="form-label fw-bold">Teléfono</label>
      <input type="tel" class="form-control" id="tel" name="tel" placeholder="Ingresa tu teléfono" required>
    </div>

    <!-- Mensaje -->
    <div class="mb-3">
      <label for="message" class="form-label fw-bold">Mensaje</label>
      <textarea class="form-control" id="message" name="message" rows="5" placeholder="Escribe tu mensaje aquí..." required></textarea>
    </div>

    <!-- Botón enviar -->
    <button type="submit" class="btn btn-primary w-100">Enviar reporte</button>
  </form>
  `;
}
// Pre: container contiene botones .open-form con data-id y data-name; existen #form-container, #overlay y #info-form
// Post: al hacer click en un botón válido se muestra el formulario, se actualiza input hidden y título con la info de la tarjeta
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
      titleName.id = 'dog_name';
      titleName.classList.add('mb-4','text-center')
      formContainer.querySelector("#info-form")!.appendChild(titleName);
      form.insertBefore(titleName, form.firstChild);
    }
    titleName.innerText = `Reportar info de ${name} `
  });
}
// PRE: formContainer y overlay son HTMLElement válidos y existen en el DOM
// POST: Al hacer click fuera del formulario, se oculta formContainer y overlay
function handleClickOutsideForm(formContainer: HTMLElement, overlay: HTMLElement) {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    e.stopPropagation();

    if (formContainer.classList.contains("hidden") && overlay.classList.contains("hidden")) return;

    // Click dentro del formulario no hacer nada
    if (formContainer.contains(target)) return;

    // Si llegamos acá ocultar formulario
    formContainer.classList.add('hidden');
    overlay.classList.add('hidden');
  });
}
// PRE: formContainer y overlay son HTMLElement válidos; #info-form existe dentro de formContainer
// POST: Al enviar el formulario, se previene comportamiento por defecto, se maneja la data, se oculta el formulario y se resetea
function handleFormSubmit(formContainer: HTMLElement, overlay: HTMLElement) { 
  const form = formContainer.querySelector('#info-form') as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = new FormData(form as HTMLFormElement);
    const payload = Object.fromEntries(data.entries());
    // ------------------------------ DELETE -----------------------------------------
    console.log("Enviando al back:", payload);
    // const [name, tel, message, cardId] = ['testNombre', 'testTel', 'testMessage', 0];
    // ----------------------------------------------------------------------------------
    const name = payload.name?.toString() ?? '';
    const tel = payload.tel?.toString() ?? '';
    const message = payload.message?.toString() ?? '';
    const cardId = Number(payload.cardId); 
    enviarReporteMascota(name, tel, message, cardId)
      .then(respuesta => {
        Swal.fire({
          icon: 'success',
          title: '¡Reporte enviado!',
          text: 'El reporte fue recibido correctamente',
          timer: 2000,      // desaparece solo
          showConfirmButton: false
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo enviar el reporte. Intente nuevamente',
          timer: 3000,
          showConfirmButton: false
        });
      });
    // Cerrar formulario
    formContainer.classList.add('hidden');
    overlay.classList.add('hidden');

    // Limpiar formulario
    form.reset();
  });
}
// PRE: router es válido; State contiene geolocalización; getFormulario y getHeader devuelven HTML válido
// POST: Se construye y retorna el contenedor de la página de mascotas con tarjetas cargadas, formulario listo y manejadores de eventos activos
export function initMascotas(router: any): HTMLElement {
  const state = State.getInstance();
  const container = document.createElement("div");
  if (!state.EstaUbicado()) {
    Swal.fire({
        icon: 'error',
        title: '¡Se requiere ubicacion!',
        text: 'Para continuar se requiere su ubicacion.',
        timer: 2000,
        showConfirmButton: false
    });
    setTimeout(() => router.goTo("/home"), 0);
    return container;
  }
  const geolocation = state.getState()?.geolocation;
  const header = getHeader();
  
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
  formContainer.classList.add('hidden', 'bg-dark');
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
    try {
      const mascotasCerca = await getMascotasCerca(geolocation);
      if (!mascotasCerca || mascotasCerca.length === 0) {
        row.innerHTML = `<p class='text-center'>No hay mascotas perdidas cerca de usted.</p>`;
      } else {
        row.innerHTML = '';
        mascotasCerca.forEach((tarjeta) => agregarTarjeta(tarjeta, row));
      }
    } catch (error) {
      console.error("Error al obtener mascotas cerca:", error);
      row.innerHTML = `<p class='text-center'>Ocurrió un error al cargar las mascotas cercanas.</p>`;
    }
  })();
  
  handleClickForm(row);
  handleClickOutsideForm(formContainer, overlay);
  handleFormSubmit(formContainer, overlay);

  return mascotasPage;
}