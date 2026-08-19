import "../../components/play/index";
import "../../components/input/index";
import "../../components/button/index";
import "./index.css";
import { state } from "../../state.ts";

export function existingGame(params: any) {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class = "existing-game">
        <div class = "text">Piedra Papel <span>ó</span> Tijera
        </div>
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

  roomIdButton?.addEventListener("click", async (e) => {
    e.preventDefault();
    state.leaveRoom(); // me desengancho de la sala anterior antes de entrar a otra
    await state.addSecondPlayer(shortRoomId.value);
    //const cs = state.getState();
    //   console.log("Room Id creado: " + cs.roomId);

    params.goTo("/play");
  });

  return div;
}
