import Swal from "sweetalert2";
import L from 'leaflet';

//@ts-ignore
import 'leaflet/dist/leaflet.css'; 

import { State } from "../../state";
import { getFooter } from "../../components/footer";
import getHeader from "../../components/header/header";
import { DtReporte } from "../../types/types-mascota";

import {
  getMiReporteByIdApi as getMiReporteById,
  editarReporteMascotaApi as editarReporteMascota
} from "../../utils/API/mascotas-controller";

//PRE:-
//POST: La funcion devuelve el id asociado al reporte mascota asignado en la url, en caso de no existir retorna -1. 
function obtenerIdURL(): number { 
  const path = window.location.pathname;

  const match = path.match(/editarreportemascota\/([^/]+)$/);

  if (match) {
    return Number(match[1]);
  }
  return -1;
}
// PRE: El formulario contiene los datos del reporte y el router está disponible.
// POST: Envía el reporte al backend. Si la operación es exitosa, muestra un mensaje de confirmación y redirige; si falla, muestra un mensaje de error.
function handleFormSubmit(form: HTMLFormElement, router: any) {
  const id = obtenerIdURL();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = new FormData(form);
    const nombre = data.get("nombre")?.toString() ?? "";
    const ubicacion = data.get("ubicacion")?.toString() ?? "";
    const [latitud, longitud] = ubicacion.split(",").map(Number);
    const ciudad = data.get("ciudad")?.toString() ?? "";
    const pais = data.get("pais")?.toString() ?? "";
    const token = data.get("token")?.toString() ?? "";
    const imagen = data.get("imagen") as File;
    // ------------------------------ DELETE -----------------------------------------
    const plainData = Object.fromEntries(data.entries());
    console.log("Payload final:", plainData);
    // const imagen = new File(["contenido falso"], "mascota.jpg", { type: "image/jpeg" });
    // const [token, latitud, longitud, nombre, ciudad, pais] = ['testToken', 0, 0, 'testNombre', 'testCity', 'testPais'];
    // -------------------------------------------------------------------------------

    editarReporteMascota(token, id, { location: { lat: latitud, lng: longitud }, name: nombre, city: ciudad, country: pais, img: imagen })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Reporte enviado!',
          text: 'El reporte fue recibido correctamente',
          timer: 2000,
          showConfirmButton: false
        });
        form.reset();
        router.goTo('/reportarmascota');
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo enviar el reporte. Intente nuevamente',
          timer: 3000,
          showConfirmButton: false
        });
      });
  });
}
// PRE: El formulario incluye un botón con id="cancelBtn" y un router válido.
// POST: Al hacer clic en cancelar, redirige al usuario a /reportarmascota.
function handleFormCancel(form: HTMLFormElement, router: any) { 
  form.querySelector("#cancelBtn")?.addEventListener("click", () => {
  router.goTo("/reportarmascota");
});
}
// PRE: No requiere parámetros. Usa Bootstrap para estilos.
// POST: Devuelve un formulario completo para reportar una mascota, con campos de texto, imagen, mapa y botones de envío/cancelación.
function getFormulario(): HTMLFormElement {
  const formEl = document.createElement('form');
  formEl.id = 'reportarMascota';
  formEl.innerHTML = `
    <h4 class="mb-4 text-center fw-bold text-primary">Reportar Mascota</h4>

    <!-- Nombre -->
    <div class="mb-3">
      <label for="nombre" class="form-label">Nombre de la mascota</label>
      <input type="text" id="nombre" name="nombre" class="form-control" required placeholder="Ej: Firulais" />
    </div>

    <!-- Imagen -->
    <div class="mb-3 text-center">
      <label for="imagen" class="form-label d-block">Foto de la mascota</label>
      <input type="file" id="imagen" name="imagen" accept="image/*" style="display: none;" />
      
      <img id="imagePreview" alt="Vista previa" class="img-thumbnail mb-2 d-none" style="max-width: 200px;">
      
      <div class="d-flex flex-column align-items-center">
        <button type="button" id="addImageBtn" class="btn btn-outline-primary btn-sm mb-2">
          <i class="bi bi-camera me-1"></i> Agregar foto
        </button>
        <span id="imageName" class="text-muted small">Ninguna imagen seleccionada</span>
      </div>
    </div>

    <!-- Mapa -->
    <div class="mb-3">
      <label class="form-label">Ubicación</label>
      <div id="map" class="border rounded" style="height: 250px;"></div>
      <p class="form-text mt-2 text-muted text-center">Haz clic en el mapa para seleccionar la ubicación</p>
    </div>

    <!-- Ciudad y país -->
    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="ciudad" class="form-label">Ciudad</label>
        <input type="text" id="ciudad" name="ciudad" class="form-control" placeholder="Ej: Montevideo" required />
      </div>
      <div class="col-md-6 mb-3">
        <label for="pais" class="form-label">País</label>
        <input type="text" id="pais" name="pais" class="form-control" placeholder="Ej: Uruguay" required />
      </div>
    </div>

    <!-- Inputs ocultos -->
    <input type="hidden" id="ubicacion" name="ubicacion" required />
    <input type="hidden" id="token" name="token" required />

    <!-- Botones -->
    <div class="d-flex justify-content-between mt-4">
      <button type="submit" class="btn btn-primary px-4">Enviar</button>
      <button type="reset" class="btn btn-outline-secondary px-4" id="cancelBtn">Cancelar</button>
    </div>
  `;

  // Evento para seleccionar imagen
  const inputImagen = formEl.querySelector('#imagen') as HTMLInputElement;
  const imageName = formEl.querySelector('#imageName') as HTMLElement;
  const preview = formEl.querySelector('#imagePreview') as HTMLImageElement;
  const addBtn = formEl.querySelector('#addImageBtn') as HTMLButtonElement;

  addBtn.addEventListener('click', () => inputImagen.click());

  inputImagen.addEventListener('change', () => {
    if (inputImagen.files && inputImagen.files[0]) {
      imageName.textContent = inputImagen.files[0].name;
      preview.src = URL.createObjectURL(inputImagen.files[0]);
      preview.classList.remove('d-none');
    } else {
      imageName.textContent = 'Ninguna imagen seleccionada';
      preview.src = '';
      preview.classList.add('d-none');
    }
  });

  return formEl;
}
async function inyectarDatosEnFormulario(form: HTMLFormElement, reporte: DtReporte) {
  // Campos básicos
  (form.querySelector('#nombre') as HTMLInputElement).value = reporte.name || '';
  (form.querySelector('#ciudad') as HTMLInputElement).value = reporte.city || '';
  (form.querySelector('#pais') as HTMLInputElement).value = reporte.country || '';

  // Ubicación
  const ubicacionInput = form.querySelector('#ubicacion') as HTMLInputElement;
  if (reporte.location?.lat && reporte.location?.lng) {
    ubicacionInput.value = `${reporte.location.lat},${reporte.location.lng}`;
  }

  // Imagen
  const preview = form.querySelector('#imagePreview') as HTMLImageElement;
  const imageName = form.querySelector('#imageName') as HTMLElement;

  if (reporte.img) {
    if (typeof reporte.img === 'string') {
      const img = reporte.img as string; 
      preview.src = reporte.img;
      preview.classList.remove('d-none');
      imageName.textContent = img.split('/').pop() || 'Imagen cargada';
    }

    else if (reporte.img instanceof File) {
      preview.src = URL.createObjectURL(reporte.img);
      preview.classList.remove('d-none');
      imageName.textContent = reporte.img.name;
    }
  }
}
export function initEditarReporteMascota(router:any):HTMLElement { 
  const state = State.getInstance();
  // --- Verificacion de Datos ---

  const container = document.createElement("div"); 
  if (!state.EstaUsuarioRegistrado()) { 
    Swal.fire({
      icon: 'error',
      title: '¡Se requiere usuario!',
      text: 'Para continuar se requiere una sesion activa.',
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => router.goTo("/signin"), 0);
    return container;
  }
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
  // --- Armado del layout ---

  const header = getHeader();
  const form = getFormulario();

  const formContainer = document.createElement('div');
  formContainer.classList.add('container', 'my-5', 'd-flex', 'justify-content-center');

  const card = document.createElement('div');
  card.classList.add('card', 'shadow-lg', 'p-4');
  card.style.maxWidth = '500px';
  card.style.width = '100%';
  card.appendChild(form);

  formContainer.appendChild(card);

  const editarReportePage = document.createElement("div");
  editarReportePage.classList.add('reportarNuevaMascota');
  editarReportePage.append(header, formContainer);

  // --- Insertamos al DOM antes de crear el mapa ---
  container.appendChild(editarReportePage);
  
  // --- Inyeccion de la Dta ---
  (async () => {
    const id = obtenerIdURL();
    const token = state.getState()?.user?.token!;

    try {
      const data = await getMiReporteById(token, id);

      if (!data) {
        Swal.fire({
          icon: 'error',
          title: `¡No existe el reporte en Base de Datos!`,
          text: `El reporte no fue encontrado al intertar obtenerlo de la base de datos.`,
          timer: 2000,
          showConfirmButton: false
        }).then(() => router.goTo('/reportarmascota'));
        return;
      }

      inyectarDatosEnFormulario(form, data);

      // --- Inicializar mapa ---
      setTimeout(() => {
        const lat = data.location?.lat ?? state.getState()?.geolocation?.lat!;
        const lng = data.location?.lng ?? state.getState()?.geolocation?.lng!;

        const map = L.map('map').setView([lat, lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        const defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });

        // Marcar ubicacion ha editar
        if (data.location?.lat && data.location?.lng) {
          L.marker([data.location.lat, data.location.lng], { icon: defaultIcon }).addTo(map);
          (form.querySelector('#ubicacion') as HTMLInputElement).value = `${data.location.lat},${data.location.lng}`
        }

        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          (form.querySelector('#ubicacion') as HTMLInputElement).value = `${lat},${lng}`;
          L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
        });
      }, 0);

    } catch (error) {
      console.error("Error al obtener el reporte:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ocurrió un error al obtener la información del reporte.',
        confirmButtonText: 'Volver',
      }).then(() => router.goTo('/reportarmascota'));
    }
  })();

  // --- Token del usuario ---
  const tokenInput = form.querySelector('#token') as HTMLInputElement;
  tokenInput.value = state.getState()?.user?.token!;
  // --- Manejo de Eventos ---
  handleFormSubmit(form, router);
  handleFormCancel(form, router);

  return container;
}