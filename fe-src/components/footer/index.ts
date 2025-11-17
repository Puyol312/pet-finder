function getFooterV1(): HTMLElement {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const footer = document.createElement('footer');
  footer.classList.add('text-center', 'text-white', 'py-3', 'bg-primary', 'position-fixed', 'bottom-0', 'w-100');
  footer.innerText = `© ${anio} Derechos Reservados`;
  return footer;
}

export { getFooterV1 as getFooter}