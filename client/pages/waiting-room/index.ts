import "../../components/play/index";
import "../../components/button/index";
import "../../components/game-header/index";
import "./index.css";
import { state } from "../../state";

export function initWaitingRoom(params: any) {
  const div = document.createElement("div");

  // Obtener el estado actual
  const currentState = state.getState();
  const roomId = currentState.roomId;

  div.innerHTML = `
  <game-header></game-header>
  <div class = "play">
        <div class = "textPlay">Compartí el código:</div>
        <div class = "roomId">${roomId}</div>
        <div class = "textPlay">Con tu contrincante</div>
        
        <div class = "plays">
          <my-play play="piedra"></my-play>
          <my-play play="papel"></my-play>
          <my-play play="tijera"></my-play>
        </div>    
    </div>  
  `;

  state.subscribe((data) => {
    const players = Object.keys(data.currentGame || {}).length;
    if (players == 2) {
      params.goTo("/play");
    }
  });

  return div;
}
