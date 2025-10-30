import { initRouter } from "./router";
(function () {
  const root = document.querySelector("#root");
  root? initRouter(root) : null ;
})()

// import getHeader from './components/header/header';

// const logo = new URL('./assets/img/logo.png', import.meta.url).href;
// document.body.prepend(getHeader({ logo }));