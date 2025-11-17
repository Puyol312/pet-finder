
import { State } from "../../state";

import getHeader from "../../components/header/header";
import { getFooter } from "../../components/footer";
import { card } from "../../components/card";
import { plussButton } from "../../components/plussButton";

import { getMisMascotasReportadasTest as getMisMascotasReportadas } from "../../utils/API/mascotas-controller";
import Swal from "sweetalert2";

function handleClickForm(row: HTMLElement, router:any) {
  // Delegación de eventos: click en botón "Reportar"
  row.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest(".open-form");
    if (!(btn instanceof HTMLButtonElement)) return;
    e.stopPropagation();
    const id = btn.dataset.id;
    if (!id) return;
    router.goTo(`/editarreportemascota/${id}`)
  });
}
//ToDo: Toda la parte editar.
export function initReportarMascotas(router: any): HTMLElement { 
  const state = State.getInstance();
  
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
  const header = getHeader();
  const plussButtonEl = plussButton.getplussButton();
  const body = document.createElement('div');
  body.classList.add('container', 'my-5');

  const row = card.getContenedorCard(); 
  body.appendChild(row);

  plussButtonEl.addEventListener("click", () => {
    router.goTo("/reportarnuevamascota");
  });

  const reportarMascotasPage = document.createElement("div");
  reportarMascotasPage.classList.add('reportarMascotas');
  reportarMascotasPage.append(header, body, plussButtonEl);

  (async () => {
    try {
      const mascotasCerca = await getMisMascotasReportadas(state.getState()?.user!);
      if (!mascotasCerca || mascotasCerca.length === 0) {
        row.innerHTML = `<p class='text-center'> No tienes mascotas reportadas. </p>`;
      } else {
        row.innerHTML = '';
        mascotasCerca.forEach((tarjeta) => card.addCardToContainer(card.getCardEdit(tarjeta), row));
      }
    } catch (error) {
      console.error("Error al obtener mascotas cerca:", error);
      row.innerHTML = `<p class='text-center'>Ocurrió un error al cargar las mascotas reportadas.</p>`;
    }
  })();

  // --- Manejo de Eventos ---
  handleClickForm(row, router);
  return reportarMascotasPage;
}