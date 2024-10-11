# educApp

**Tarea de postulación para Edugami**  
**Desarrollador:** Gonzalo Pérez  
**Aplicación desplegada en:** [https://educ-app-htkh.vercel.app/admin](https://educ-app-htkh.vercel.app/admin)

## Descripción

**educApp** es una aplicación educativa diseñada para gestionar pruebas y usuarios. Permite a los estudiantes iniciar sesión con su RUT, nombre y contraseña, mientras que los profesores pueden gestionar las pruebas a través de un panel de administración.

## Instalación y Ejecución Local

Para ejecutar la aplicación de manera local, sigue estos pasos:

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```

2. **Navega a la carpeta del cliente y del servidor** y ejecuta:
   ```bash
   npm run dev
   ```

   Nota: La aplicación ya está desplegada y en funcionamiento, por lo que no es necesario ejecutar estos comandos a menos que desees realizar pruebas locales.

## Acceso a la Aplicación

- Todos los usuarios pueden iniciar sesión como estudiantes con su RUT, nombre y contraseña.
- El profesor que gestiona la aplicación puede iniciar sesión como administrador utilizando las siguientes credenciales:
  - **Usuario:** admin  
  - **Contraseña:** admin  

Desde el panel de administración, el profesor puede crear pruebas y gestionar las respuestas de los estudiantes.

## Funcionalidades

- **Creación de usuarios:** Los usuarios pueden registrarse y observar sus pruebas asignadas
- **Gestión de pruebas:** El administrador puede crear pruebas, ver cantidad de respuestas y gestionar asignación de pruebas.

## Notas

- Esta es la primera versión de la aplicación. Actualmente, hay código hardcodeado en el backend debido a problemas con CORS.
- Aunque el diseño podría mejorarse, la aplicación es funcional y cumple con los requisitos especificados.
- **Tecnologías utilizadas:**
  - **Frontend:** Nuxt.js con Pinia
  - **Backend:** Express con Prisma
  - **Base de Datos:** Supabase

### Usuarios de Prueba

Los usuarios creados para la tarea tienen su RUT y contraseña como la misma combinación. Recuerda escribir manualmente el guion (-) en el RUT al iniciar sesión.
