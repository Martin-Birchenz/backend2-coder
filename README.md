# API Backend — Plataforma de gestión de eventos y tickets

API RESTful desarrollada con **Node.js**, **Express** y **MongoDB** bajo una arquitectura profesional por capas, aplicando el patrón DTO, autenticación y JWT en cookies httpOnly, control de acceso basado en roles, filtros avanzados y notificaciones por correo electrónico con Nodemailer.

---

## Tecnologías utilizadas

- **Entorno y Framework:** Node.js, Express
- **Base de Datos y ODM:** MongoDB, Mongoose, `mongoose-paginate-v2`
- **Autenticación y Seguridad:** Passport.js (`passport-local`, `passport-jwt`), JSON Web Tokens, `cookie-parser`, `bcrypt`
- **Notificaciones:** Nodemailer
- **Utilidades:** `dotenv`, `cors`

---

## Arquitectura del Proyecto

```text
src/
├── config/          # Conexión a DB, variables de entorno y estrategias Passport
├── controllers/     # Coordinación de peticiones HTTP y respuestas
├── dao/             # Única capa que importa modelos de Mongoose
├── dto/             # Formateo y sanitización de respuestas (sin exponer password)
├── middlewares/     # Autenticación (401), autorización por roles (403) y errores
├── models/          # Esquemas y modelos de Mongoose (User, Event, Ticket)
├── repositories/    # Abstracción del acceso a datos entre Services y DAOs
├── routes/          # Definición de endpoints REST
├── services/        # Lógica de negocio, control de cupos, dueños y envío de emails
├── utils/           # Hash bcrypt, firma JWT, códigos de reserva y errores custom
├── app.js           # Configuración de Express y middlewares
└── server.js        # Punto de entrada e inicialización del servidor
```
