# 🐾 PetFinder – API & Plataforma para Reportar Mascotas Perdidas

PetFinder es una plataforma diseñada para ayudar a las personas a **reportar, encontrar y recuperar** mascotas perdidas.  
Incluye una **API REST** + un **Frontend dinámico** que permite:

- Crear reportes de mascotas perdidas
- Editar reportes
- Ver mascotas cerca según la ubicación del usuario
- Enviar mensajes al dueño
- Autenticación con token

---

## 🚀 Probar API en Postman

Hacé clic para importar la colección completa:

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" width="150">](https://app.getpostman.com/run-collection/47803384-ae657671-af89-422b-8880-71d2da69eb75?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D47803384-ae657671-af89-422b-8880-71d2da69eb75%26entityType%3Dcollection%26workspaceId%3Df471657a-aa4b-4d8c-82de-65dda67ac8ba)

---

## 🌐 Ir a la Web

[![Visitar Página](https://img.shields.io/badge/Ir%20a%20PetFinder-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://pet-finder-prod.up.railway.app/petfinder/home)

---

## 📚 Documentación del Proyecto

### 🔐 Autenticación
El usuario puede:

- Registrarse
- Iniciar sesión
- Recibir un token JWT
- Almacenar su sesión opcionalmente ("Recordarme")

Endpoints principales:

- **POST /auth** → Crear usuario  
- **POST /auth/token** → Login  
- **GET /me** → Usuario autenticado  

---

### 📍 Ubicación
El sistema solicita ubicación para:

- Mostrar mascotas cerca  
- Permitir crear reportes  
- Posicionar el mapa en el formulario  

El frontend usa **navigator.geolocation** y Leaflet.

---

### 🐶 Reportes de Mascotas

Un reporte posee:

```json
{
  "name": "Firulais",
  "img": "https://cloudinary...",
  "city": "Montevideo",
  "country": "Uruguay",
  "location": {
    "lat": -34.90,
    "lng": -56.16
  }
}
```
### 💬 Contacto al dueño

Cualquier usuario puede enviar un mensaje a quien reportó la mascota.

El backend envía un mail con:

- Información del posible avistamiento
- Datos del contacto
- Ubicación
