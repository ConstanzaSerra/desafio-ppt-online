import "../../components/play/index";
import "../../components/button/index";
import "../../components/game-header/index";
import "./index.css";
import { state } from "../../state";

export function initWaitingPlay(params: any) {
  const div = document.createElement("div");

  const { other } = state.getPlayers();

  div.innerHTML = `
  <game-header></game-header>
  <div class = "play">
        <div class = "textPlay">Esperando a que <b>${other?.name ?? "tu contrincante"}</b> presione ¡Jugar!</div>
        
        <div class = "plays">
          <my-play play="piedra"></my-play>
          <my-play play="papel"></my-play>
          <my-play play="tijera"></my-play>
        </div>    
    </div>  
  `;

  state.subscribe(() => {
    if (state.bothPlayersReady()) params.goTo("/count");
  });

  // Por si el otro jugador ya estaba listo antes de que yo llegara acá:
  // en ese caso no llega ningún cambio nuevo desde Firebase.
  // El setTimeout es clave: si navegara acá mismo, el router todavía está
  // montando ESTA página y terminaría pisando la página nueva.
  if (state.bothPlayersReady()) {
    setTimeout(() => params.goTo("/count"), 0);
  }

  return div;
}
