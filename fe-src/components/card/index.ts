import { PetWanted } from "../../types/types-mascota";
//@ts-ignore
import './card.css';

function getCard({ name, img, city, street, id }: PetWanted): HTMLElement { 
  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'shadow-sm');
  card.innerHTML = `
    <div class="card bg-dark text-light border-secondary shadow">
      <img src="${img}" class="card-img-top" alt="Foto de ${name}" style="max-width:100%; max-height:200px; object-fit:cover;">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${street}, ${city}</p>
        <button class="btn btn-danger open-form" data-id="${id}" data-name="${name}">
          Reportar
        </button>
      </div>
    </div>
  `;
  return card;
}
function getCardEdit({ name, img, city, street, id }: PetWanted): HTMLElement {
  const pencilSVG = new URL('./MdiLightPencil.svg', import.meta.url).href;
  const card = document.createElement('div');
  card.classList.add('card', 'h-100', 'shadow-sm');
  card.innerHTML = `
    <div class="card bg-dark text-light border-secondary shadow">
      <img src="${img}" class="card-img-top" alt="Foto de ${name}" style="max-width:100%; max-height:200px; object-fit:cover;">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <p class="card-text">${street}, ${city}</p>
        <button class="btn btn-success open-form d-flex align-items-center gap-2" data-id="${id}" data-name="${name}">
          <img src="${pencilSVG}" alt="Editar" style="width:18px; height:18px;">
          Editar
        </button>
      </div>
    </div>
  `;
  return card;
}
function getContenedorCard(): HTMLElement { 
  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-center', 'g-4');
  row.id = 'cards-container';
  row.innerHTML = `<p class="text-center">Cargando mascotas cerca de usted...</p>`;
  return row;
}
function addCardToContainer(card: HTMLElement, contenedor: HTMLElement) { 
  const col = document.createElement('div');
  col.classList.add('col');
  col.appendChild(card);
  contenedor.appendChild(col);
}
export const card = {
  getCard,
  getContenedorCard,
  addCardToContainer,
  getCardEdit
};