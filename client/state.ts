type Jugada = "piedra" | "papel" | "tijera";
type Game = {
  computerPlay: Jugada;
  myPlay: Jugada;
};

import { rtdb } from "./db";

const API_BASE_URL = process.env.PARCEL_API_BASE_URL;

console.log("API_BASE_URL:", API_BASE_URL);

const state = {
  data: {
    user: "",
    userId: "",
    roomId: "",
    currentGame: { computerPlay: "" as Jugada, myPlay: "" as Jugada },
    room: null as any,
    // Foto de las jugadas de la ronda, tomada en show-play.
    // Sirve para que el result no dependa de la RTDB, que ya puede estar reseteada.
    lastRound: null as any,
    history: [] as Game[],
  },
  subscribers: [] as any[],
  roomRef: null as any,

  init() {
    const currentState = this.getState();

    // La sala en la que estaba, para sobrevivir a un refresh
    const savedRoom = localStorage.getItem("users-ppt.roomId");
    if (savedRoom) {
      currentState.roomId = savedRoom;
    }

    const savedUser = localStorage.getItem("users-ppt.nombre");
    if (savedUser) {
      currentState.user = savedUser;
      this.setState(currentState);
      this.reloadUser(savedUser);
    }
    //    console.log(state);
  },

  reloadUser(user: string) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nombre: user }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.userId = data;
        cs.user = user;
        this.setState(cs);
        console.log(cs);

        // Recién ahora sé quién soy: si venía de una sala, me reengancho
        if (cs.roomId) this.listenRoom();
      });
  },

  crearSala() {
    // 1. Recuperar el userId del state
    const cs = this.getState();
    //console.log("State recuperado en crearSala: ", cs);
    const userId = cs.userId.id;
    console.log("User Id recuperado del state: " + userId);

    return fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: userId }), // Enviamos el userId en el body
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.roomId = data.roomId; //data es json del then anterior
        this.setState(cs);
        localStorage.setItem("users-ppt.roomId", cs.roomId);
        this.listenRoom();
        //console.log("Room Id obtenida de Firebase: " + data.roomId);
      });
  },

  addSecondPlayer(roomId: string) {
    const cs = this.getState();
    const userId = cs.userId.id;
    //console.log("UserId al momento de agregar al segundo jugador: " + cs.userId.id);

    return fetch(API_BASE_URL + "/rooms/" + roomId + "/user", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: userId }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Data: ", data);
        cs.roomId = roomId;
        this.setState(cs);
        localStorage.setItem("users-ppt.roomId", cs.roomId);
        this.listenRoom();
        return data;
      });
  },

  setUser(user: string) {
    const cs = this.getState();
    //cuando se guarda el usuario por primera vez
    return fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nombre: user }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.user = user;
        // Guardo el objeto completo { id, new } igual que reloadUser,
        // porque en todos lados se lee cs.userId.id
        cs.userId = data;
        this.setState(cs);
        // Guardar en localStorage
        localStorage.setItem("users-ppt.nombre", user);
      });
  },

  listenRoom(callback?: (data: any) => void) {
    const cs = this.getState();
    if (this.roomRef) return; // ya estoy escuchando esta sala, no me suscribo otra vez

    this.roomRef = rtdb.ref("rooms/" + cs.roomId);

    this.roomRef.on("value", (snapshot: any) => {
      const data = snapshot.val();
      console.log("Cambio en la room:", data);

      cs.room = data; //se guarda la sala entera (jugadores + timer)
      this.setState(cs);
      this.subscribers.forEach((cb) => cb(data));

      //if (callback) callback(data);
    });
  },

  leaveRoom() {
    const cs = this.getState();

    if (this.roomRef) {
      this.roomRef.off(); // corto la escucha de la sala anterior
      this.roomRef = null;
    }

    cs.roomId = "";
    cs.room = null;
    this.setState(cs);
    localStorage.removeItem("users-ppt.roomId");
  },

  subscribe(cb: (data: any) => void) {
    this.subscribers.push(cb);
    // devuelve la función para desuscribirse
    return () => {
      this.subscribers = this.subscribers.filter((s) => s !== cb);
    };
  },

  clearSubscribers() {
    this.subscribers = [];
  },

  getPlayers() {
    const cs = this.getState();
    const players = cs.room?.currentGame || {};
    const myId = cs.userId.id;

    const me = players[myId];
    const otherId = Object.keys(players).find((id) => id !== myId); //devuelve null si todavia no hay rival
    const other = otherId ? players[otherId] : null;

    return { me, other };
  },

  bothPlayersReady() {
    const { me, other } = this.getPlayers();
    return me?.start === true && other?.start === true;
  },

  bothPlayersPlayed() {
    const { me, other } = this.getPlayers();
    return !!me?.choice && !!other?.choice;
  },

  setPlayerData(changes: object) {
    const cs = this.getState();
    const userId = cs.userId.id;
    const roomId = cs.roomId;

    return fetch(API_BASE_URL + "/rooms/" + roomId + "/player", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, ...changes }),
    }).then((res) => res.json());
  },

  setLastRound(myChoice: string, otherChoice: string) {
    const cs = this.getState();
    cs.lastRound = { myChoice, otherChoice };
    this.setState(cs);
  },

  // Versión multijugador: contempla que alguno no haya elegido ("none")
  resultVs(myPlay: string, otherPlay: string) {
    if (myPlay === "none" && otherPlay === "none") return "draw";
    if (myPlay === "none") return "lose";
    if (otherPlay === "none") return "win";
    return this.result(myPlay as Jugada, otherPlay as Jugada);
  },

  result(myPlay: Jugada, otherPlay: Jugada) {
    if (myPlay === otherPlay) {
      return "draw";
    } else if (
      (myPlay === "tijera" && otherPlay === "papel") ||
      (myPlay === "piedra" && otherPlay === "tijera") ||
      (myPlay === "papel" && otherPlay === "piedra")
    ) {
      return "win";
    } else {
      return "lose";
    }
  },

  getState() {
    return this.data; // Método para obtener el estado actual, devuelve una referencia, no una copia
  },

  setState(newState: typeof this.data) {
    this.data = newState; // Método para establecer un nuevo estado
  },
};

export { state };
