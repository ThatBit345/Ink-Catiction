# API REST

La API REST implementada se encuentra dividida en diferentes partes.
## ApiStatusController (/api/status)
Sección encargada del estado del servidor, dando acceso al número de usuarios activos y un ping.

### GET: /connected-users
Devuelve el número de usuarios activos en los últimos 30 segundos.

### GET: /ping
Utilizado para comprobar la conexión con el servidor, siempre devuelve OK.

## ChatController (/api/chat)
Sección encargada del chat.

### GET: (/{since})
Como parámetro recibe el id del último mensaje recibido por el cliente (parámetro since).
Devuelve una lista con todos los mensajes almacenados en el servidor desde entonces.

### POST: (/)
Utilizado para recibir y almacenar un mensaje en el servidor.
Recibe un *MessageRequest*, con formato JSON: `{user, message}`.

## UserController (/api/users)
Controlador encargado de la gestión de usuarios.

### GET: (/{username})
Devuelve el DTO de un usuario, el cual contiene su nombre y volumen.
Como parámetro recibe el nombre del usuario.

### POST: (/login)
Petición utilizada para el inicio de sesión, recibe un *User* en formato JSON: `{username, password, volume}`.

### DELETE: (/{username})
Utilizado para borrar a un usuario del servidor.
Como parámetro recibe el nombre del usuario a borrar.

### POST: (/register)
Petición utilizada para el registro de usuarios, recibe un *User* en formato JSON: `{username, password, volume}`.

### PUT: (/{username}/password)
Petición utilizada para cambiar la contraseña de un usuario, recibe la nueva contraseña.

### PUT: (/{username}/volume)
Petición utilizada para cambiar el volumen de un usuario, recibe el nuevo valor de volumen (entre 0 y 1).