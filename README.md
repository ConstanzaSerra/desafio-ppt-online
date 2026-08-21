# Piedra, Papel o Tijera Online

Juego de piedra, papel o tijera para dos jugadores en tiempo real. Cada jugador
entra a una sala compartida con un código de 4 dígitos y juegan rondas
sucesivas, con el marcador sincronizado entre ambos.

**App en producción:** https://desafio-ppt-online-production.up.railway.app

**Documentación de la API:** [Collection de Postman](PEGAR_ACA_EL_LINK)

## Cómo funciona

1. Un jugador crea una sala y comparte el código de 4 dígitos.
2. El segundo jugador ingresa ese código y entra a la misma sala.
3. Ambos presionan **¡Jugar!** y tienen 3 segundos para elegir jugada.
4. Se muestran las dos jugadas, el resultado y el marcador acumulado.
5. Con **Volver a jugar** empieza una ronda nueva.

## Stack

- **Front:** TypeScript + Web Components + Parcel, sin framework
- **Back:** Node + Express
- **Datos:** Firestore (usuarios) y Realtime Database (salas y partidas)
- **Deploy:** Railway

Las escrituras pasan siempre por la API; las lecturas en tiempo real las hace
el cliente escuchando la Realtime Database directamente.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/signup` | Registra un usuario nuevo |
| POST | `/auth` | Devuelve el id de un usuario existente |
| POST | `/rooms` | Crea una sala y devuelve su código |
| POST | `/rooms/:roomId/user` | Agrega el segundo jugador a la sala |
| GET | `/rooms/:roomId` | Devuelve el estado de la sala |
| PATCH | `/rooms/:roomId/player` | Actualiza `start`, `choice` o `totalGanados` |

## Correr en local

```bash
yarn install
cp .env.example .env   # completar con los valores reales
yarn dev:api           # API en el puerto 3000
yarn dev:front         # front en el puerto 1234
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `FIREBASE_APPLICATION_CREDENTIALS_JSON` | JSON de la cuenta de servicio de Firebase, en una sola línea |
| `PARCEL_API_BASE_URL` | URL base de la API que consume el front |
| `PORT` | Puerto donde escucha el server (default 3000) |
