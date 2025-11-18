import { getFooter } from "../../components/footer";
import getHeader from "../../components/header/header";

function getBody(): HTMLElement {
  const imghelp = new URL('./img-help.jpg', import.meta.url).href;
  const container = document.createElement('div');
  container.classList.add('container', 'py-5');
  container.innerHTML = `
    <!-- Título principal -->
    <h1 class="text-center mb-4">¿Cómo funciona PetFinder?</h1>

    <!-- CARD principal -->
    <div class="card shadow-lg border-0">
      <div class="card-body p-4">

        <div class="row">

          <!-- espacio para imagen -->
          <div class="col-md-5 d-flex justify-content-center align-items-center mb-3 mb-md-0">
            <img 
              src=${imghelp} 
              alt="Petfinder ayuda" 
              class="img-fluid rounded shadow-sm w-100" 
              style="max-height: 250px; object-fit: cover;"
            >
          </div>

          <!-- Texto explicativo -->
          <div class="col-md-7">
            <h3 class="mb-3">Tu asistente para encontrar mascotas perdidas</h3>
            <p>
              PetFinder es una plataforma diseñada para ayudar a personas a encontrar y reportar mascotas
              perdidas o encontradas. Todo funciona de manera simple:
            </p>

            <ul>
              <li><strong>Crea un reporte</strong> con foto, ubicación y detalles de la mascota.</li>
              <li><strong>Otros usuarios pueden verla</strong> en el mapa o en la lista de reportes.</li>
              <li><strong>Pueden contactarte</strong> si la vieron o tienen información.</li>
              <li><strong>Vos recibís su mensaje</strong> directo al mail y tomás acción.</li>
            </ul>

            <p class="mt-3">
              Nuestro objetivo es conectar personas rápidamente para aumentar las chances de reunir mascotas con sus dueños.
            </p>

            <a href="/petfinder/home" class="btn btn-primary mt-3">
              Volver al Inicio
            </a>

          </div>
        </div>

      </div>
    </div>
  `;
  return container;
}

export function initHelp(router: any):HTMLElement { 
  const container = document.createElement("div"); 
  // --- Armado del layout ---
  const header = getHeader();
  const body = getBody();
  const footer = getFooter();
  
  const reportarNuevaMascotasPage = document.createElement("div");
  reportarNuevaMascotasPage.classList.add('bg-light');
  reportarNuevaMascotasPage.append(header, body, footer);

  // --- Insertamos al DOM antes de crear el mapa ---
  container.appendChild(reportarNuevaMascotasPage);
  return container;
}