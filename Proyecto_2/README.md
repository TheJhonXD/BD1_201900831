# Proyecto #2: Sistema de Información de la Facultad de Ingeniería

## Descripción

Este proyecto consiste en el diseño y desarrollo de una base de datos para la Facultad de Ingeniería de la Universidad de San Carlos de Guatemala. El objetivo es crear un sistema de información que gestione módulos de estudiantes, docentes, cursos y actas finales, asegurando la integridad y persistencia de los datos.

### Diseño

1. Modelo conceptual
2. Modelo lógico
3. Modelo relacional (Diagrama ER)

[Ver diagramas](https://github.com/TheJhonXD/BD1_201900831/tree/main/Proyecto_2/Diagramas)

### Funcionalidades

El sistema permite las siguientes operaciones:

1. **Registrar estudiante**
   - Almacena datos del estudiante, carrera y créditos.
2. **Crear carrera**
   - Crea nuevas carreras con identificador autoincremental.
3. **Crear curso**
   - Crea cursos especificando código, nombre, créditos necesarios, créditos que otorga, carrera a la que pertenece y si es obligatorio.
4. **Habilitar curso para asignación**

   - Crea disponibilidad de cursos para asignación de estudiantes, validando la no repetición de secciones.

5. **Asignación de curso**

   - Asigna estudiantes a cursos específicos, validando que el carnet exista y la nota sea positiva.

6. **Generar acta**
   - Genera actas finales una vez ingresadas todas las notas de los estudiantes asignados a un curso.

### Procesamiento de Datos

#### Procedimientos disponibles

1. **Consultar pensum**
   - Retorna un listado de todos los cursos pertenecientes a una carrera.
2. **Consultar estudiante**
   - Retorna información de un estudiante según su carnet.
3. **Consultar aprobación**
   - Retorna si un estudiante ha aprobado o desaprobado un curso específico.
4. **Consultar actas**

   - Retorna un listado de actas de un curso ordenado por fecha y hora de generación.

5. **Consultar tasa de desasignación**
   - Retorna el porcentaje de desasignación de un curso y sección.

## Requisitos del Sistema

- Gestor de base de datos: MySQL
- Sistema operativo libre.

## Instrucciones de Instalación

1. Clona el repositorio desde GitHub:

   ```bash
   git clone https://github.com/TheJhonXD/BD1_201900831/
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd Proyecto_2
   ```

3. Carga el script de la base de datos en tu gestor de base de datos preferido MySQL.

4. Carga los datos de ejemplo usando los scripts proporcionados.
