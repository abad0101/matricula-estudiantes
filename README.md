# Matrícula de Estudiantes

## Descripción
La aplicación **Matrícula de Estudiantes** es una herramienta diseñada para gestionar y organizar la información de estudiantes en un sistema de matrícula. Permite registrar, editar, eliminar y filtrar estudiantes, además de exportar los datos a un archivo PDF para su uso fuera de línea. La aplicación utiliza **React** como framework frontend y **Firebase** como base de datos en tiempo real.

## Tecnologías Utilizadas
- **React**: Para la construcción del frontend.
- **Firebase**: Base de datos en tiempo real.
- **React-PDF**: Para la generación de archivos PDF.

## Funcionalidades Principales
- **Registro de Estudiantes**: Permite agregar nuevos estudiantes con datos como:
  - Nombre
  - Fecha de nacimiento
  - Grado
  - Grupo
  - Género
- **Edición y Eliminación**: Modificación y eliminación de registros directamente desde la interfaz.
- **Filtrado Avanzado**:
  - Búsqueda por nombre (dinámica)
  - Filtrado por grado (Primero, Segundo, etc.)
  - Filtrado por género (Niño/Niña)
  - Filtrado por sección (Grupo A/B)
- **Exportar a PDF**: Genera un archivo con el listado de estudiantes ordenados por grado, grupo, género y nombre.
- **Interfaz Intuitiva**: Diseñada para una experiencia fluida en dispositivos de escritorio y móviles.

## Requisitos Previos
Antes de ejecutar la aplicación, asegúrate de tener instalado lo siguiente:
- **Node.js** (Versión 16 o superior) - [Descargar Node.js](https://nodejs.org/)
- **npm** o **yarn** - Gestor de paquetes

## Instalación y Configuración
1. Clona este repositorio:
   ```sh
   git clone https://github.com/abad0101/matricula-estudiantes.git
   cd matricula-estudiantes
   ```
2. Instala las dependencias:
   ```sh
   npm install
   # o si usas yarn
   yarn install
   ```
3. Configura Firebase:
   - Crea un proyecto en Firebase.
   - Agrega la configuración en un archivo `.env` con las credenciales de Firebase.

4. Inicia la aplicación:
   ```sh
   npm start
   # o con yarn
   yarn start
   ```

## Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar la aplicación, sigue estos pasos:
1. Realiza un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Descripción del cambio"`).
4. Envía un pull request.

## Licencia
Este proyecto está bajo la licencia MIT. Puedes ver más detalles en el archivo `LICENSE`.

---
**Autor:** [Abad](https://github.com/abad0101)

