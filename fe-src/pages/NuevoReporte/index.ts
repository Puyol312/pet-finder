import Swal from "sweetalert2";
import L from 'leaflet';

//@ts-ignore
import 'leaflet/dist/leaflet.css'; 

import { State } from "../../state";
import { altaReporteMascotaApi as altaReporteMascota } from "../../utils/API/mascotas-controller";

import getHeader from "../../components/header/header";

// PRE: Existen elementos con IDs 'imagen', 'imageName' y opcionalmente 'imagePreview'.
// POST: Muestra el nombre del archivo seleccionado y su vista previa; si no hay archivo, muestra mensaje por defecto y limpia la vista.
function updateImageName() {
  const input = document.getElementById('imagen') as HTMLInputElement | null;
  const imageName = document.getElementById('imageName') as HTMLElement | null;
  const preview = document.getElementById('imagePreview') as HTMLImageElement | null;

  if (!input || !imageName) return;

  const file = input.files?.[0];
  if (file) {
    imageName.textContent = file.name;
    if (preview) {
      const reader = new FileReader();
      reader.onload = (e) => (preview.src = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  } else {
    imageName.textContent = 'Ninguna imagen seleccionada';
    if (preview) preview.src = '';
  }
}
// PRE: El formulario contiene los datos del reporte y el router está disponible.
// POST: Envía el reporte al backend. Si la operación es exitosa, muestra un mensaje de confirmación y redirige; si falla, muestra un mensaje de error.
function handleFormSubmit(form: HTMLFormElement, router: any) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = new FormData(form);
    // const nombre = data.get("nombre")?.toString() ?? "";
    // const ubicacion = data.get("ubicacion")?.toString() ?? "";
    // const [latitud, longitud] = ubicacion.split(",").map(Number);
    // const ciudad = data.get("ciudad")?.toString() ?? "";
    // const pais = data.get("pais")?.toString() ?? "";
    // const token = data.get("token")?.toString() ?? "";
    // const imagen = data.get("imagen") as File;
    // ------------------------------ DELETE -----------------------------------------
    const plainData = Object.fromEntries(data.entries());
    console.log("Payload final:", plainData);
    const imagen = new File(["contenido falso"], "mascota.jpg", { type: "image/jpeg" });
    const [token, latitud, longitud, nombre, ciudad, pais] = ['testToken', 0, 0, 'testNombre', 'testCity', 'testPais'];
    // -------------------------------------------------------------------------------

    altaReporteMascota(token, { location: { lat: latitud, lng: longitud }, name: nombre, city: ciudad, country: pais, img: imagen })
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
// PRE: Requiere usuario registrado y ubicación habilitada en el estado global.
// POST: Renderiza la vista para reportar una nueva mascota, con formulario, mapa interactivo y manejo de envío y cancelación.
export function initReportarNuevaMascota(router: any) { 
  const state = State.getInstance();
  const container = document.createElement("div");

  // --- Validaciones previas ---
  if (!state.EstaUsuarioRegistrado()) {
    Swal.fire({
      icon: 'error',
      title: `¡Se requiere usuario!`,
      text: `Para continuar se requiere una sesión activa`,
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => router.goTo("/signin"), 0);
    return container;
  }

  if (!state.EstaUbicado()) { 
    Swal.fire({
      icon: 'error',
      title: `¡Se requiere ubicación!`,
      text: `Para continuar se requiere acceso a su ubicación`,
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

  const reportarNuevaMascotasPage = document.createElement("div");
  reportarNuevaMascotasPage.classList.add('reportarNuevaMascota');
  reportarNuevaMascotasPage.append(header, formContainer);

  // --- Insertamos al DOM antes de crear el mapa ---
  container.appendChild(reportarNuevaMascotasPage);

  // --- Inicializamos el mapa en el siguiente ciclo ---
  setTimeout(() => {
    const map = L.map('map').setView(
      [state.getState()?.geolocation?.lat!, state.getState()?.geolocation?.lng!],
      13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Icono Leaflet desde CDN
    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    map.on('click', function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      const ubicacionInput = form.querySelector('#ubicacion') as HTMLInputElement;
      ubicacionInput.value = `${lat},${lng}`;
      L.marker([lat, lng], { icon: defaultIcon }).addTo(map);
    });
  }, 0);

  // --- Token del usuario ---
  const tokenInput = form.querySelector('#token') as HTMLInputElement;
  tokenInput.value = state.getState()?.user?.token!;

  // --- Manejo de eventos ---
  handleFormCancel(form, router);
  handleFormSubmit(form, router);

  return container;
}