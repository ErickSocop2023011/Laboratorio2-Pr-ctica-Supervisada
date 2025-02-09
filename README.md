# API del Sistema de Alumnos y Profesores

Esta API está diseñada para gestionar a los alumnos y a los profesores con sus cursos. Incluye funcionalidades cono crear, actualizar, listar. Así como gestionar información del usuario (registro y login)

Cree un archivo `.env` en el directorio raíz y agregue las siguientes variables:

```
MONGO_URI=<tu_cadena_de_conexión_mongodb>
PORT=<tu_puerto_del_servidor>
JWT_SECRET=<tu_secreto_jwt>
```

Cree un archivo `.env` en el directorio raíz y agregue las siguientes variables:

```
MONGO_URI=<tu_cadena_de_conexión_mongodb>
PORT=<tu_puerto_del_servidor>
JWT_SECRET=<tu_secreto_jwt>
```
- **Registrar Usuario**
  - **URL:** `/educCenterSystem/v1/auth/register`
  - **Método:** `POST`
  - **Cuerpo:**
    - **Profesor/Teacher**
    ```json
    {
      "name": "string",
      "surname": "string",
      "username": "string",
      "email": "string",
      "password": "string",
      "role": "string",
      "profilePicture": "file",
      "department": "string"
    }
    ```
    - **Alumno/Student**
    ```json
    {
      "name": "string",
      "surname": "string",
      "username": "string",
      "email": "string",
      "password": "string",
      "role": "string",
      "profilePicture": "file",
      "idCardNumber": "number",
      "grade" : "string",
      "technicalCareer" : "string"
    }
    ```

    ### Usuarios - ¡Tanto Profesor como Alumno!

- **Obtener Usuario por ID**
  - **URL:** `/educCenterSystem/v1/user/findUser/:uid`
  - **Método:** `GET`

- **Eliminar Usuario**
  - **URL:** `/educCenterSystem/v1/user/deleteUser/:uid`
  - **Método:** `DELETE`

- **Actualizar Contraseña del Usuario**
  - **URL:** `/educCenterSystem/v1/user/updatePassword/:uid`
  - **Método:** `PATCH`
  - **Cuerpo:**
    ```json
    {
      "newPassword": "string"
    }
    ```
    ### Alumno
- **Actualizar Información del Alumno**
  - **URL:** `/educCenterSystem/v1/user/updateUser/:uid`
  - **Método:** `PUT`
  - **Cuerpo:**
    ```json
    {
        "name": "string",
        "surname": "string",
        "username": "string",
        "email": "string",
        "idCardNumber": "Number",
        "grade": "String",
        "technicalCareer": "String"
    }
    ```

- **Asignarse a Cursos del Alumno**
  - **URL:** `/educCenterSystem/v1/student/assignCourse/:userId`
  - **Método:** `PATCH`
  - **Cuerpo:**
    ```json
    {
        "courseId": "string",
    }
    ```

- **Listar los Cursos del Alumno**
  - **URL:** `/educCenterSystem/v1/student/findCourses/:userId`
  - **Método:** `GET`

    ### Profesor

- **Actualizar Información del Profesor**
  - **URL:** `/educCenterSystem/v1/user/updateUser/:userId`
  - **Método:** `PUT`
  - **Cuerpo:**
    ```json
    {
        "name": "string",
        "surname": "string",
        "username": "string",
        "email": "string",
        "department":"string"
    }
    ```
- **Listar los Cursos del Profesor**
  - **URL:** `/educCenterSystem/v1/teacher/findCourses/:userId`
  - **Método:** `GET`

    ### Cursos
- **Crear un Curso**
  - **URL:** `/educCenterSystem/v1/user/updateUser/:uid`
  - **Método:** `POST`
  - **Cuerpo:**
    ```json
    {
        "name": "string",
        "description": "string",
        "teacherId": "string",
        "schedule": {
            "day": "string",
            "time": "string"
        },
        "level":"string"
    }
    ```

- **Eliminar un Curso**
  - **URL:** `/educCenterSystem/v1/course/deleteCourse/:uid`
  - **Método:** `DELETE`

