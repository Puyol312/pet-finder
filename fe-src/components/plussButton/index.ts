function getplussButton():HTMLElement { 
  const addButton = document.createElement("button");
  addButton.className = "btn btn-primary btn-lg rounded-circle shadow-lg position-fixed";
  addButton.innerHTML = `<i class="bi bi-plus-lg"></i>`;
  addButton.style.bottom = "30px";
  addButton.style.right = "30px";
  addButton.style.width = "60px";
  addButton.style.height = "60px";
  addButton.style.display = "flex";
  addButton.style.alignItems = "center";
  addButton.style.justifyContent = "center";
  addButton.style.fontSize = "1.5rem";
  return addButton;
}

export const plussButton = {
  getplussButton,
}