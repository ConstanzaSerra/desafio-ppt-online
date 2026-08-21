import "../../components/play/index";
import "../../components/input/index";
import "../../components/button/index";
import "./index.css";
import { state } from "../../state.ts";

export function existingGame(params: any) {
  const div = document.createElement("div");

  // Si todavía no sé quién es (localStorage vacío), le pido el nombre
  const cs = state.getState();
  const necesitaNombre = !cs.user;

  div.innerHTML = `
    <div class = "existing-game">
        <div class = "text">Piedra Papel <span>ó</span> Tijera
        </div>
        ${
          necesitaNombre
            ? `<my-input class="user-name" label="Tu Nombre" width = 250></my-input>`
            : ""
        }
        <my-input class="roomId" placeholder= "codigo" width = 250></my-input>
        <my-button class="roomId-button" width = 250>Ingresar a la sala</my-button>
        <div class = "plays">
          <my-play play="piedra"></my-play>
          <my-play play="papel"></my-play>
          <my-play play="tijera"></my-play>
        </div>    
    </div>    
  `;

  const roomIdButton = div.querySelector(".roomId-button");
  const shortRoomId = div.querySelector(".roomId") as any;
  const userNameInput = div.querySelector(".user-name") as any;

  roomIdButton?.addEventListener("click", async (e) => {
    e.preventDefault();

    // Primero me identifico, si hace falta
    if (necesitaNombre) {
      const nombre = (userNameInput?.value || "").trim();
      if (!nombre) {
        alert("Ingresá tu nombre para entrar a la sala");
        return;
      }
      await state.ensureUser(nombre);
    }

    if (!shortRoomId.value) {
      alert("Ingresá el código de la sala");
      return;
    }

    state.leaveRoom(); // me desengancho de la sala anterior antes de entrar a otra
    await state.addSecondPlayer(shortRoomId.value);

    params.goTo("/play");
  });

  return div;
}
