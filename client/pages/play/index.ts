import "../../components/play/index";
import "../../components/button/index";
import "../../components/game-header/index";
import "./index.css";
import { state } from "../../state";

export function initPlay(params: any) {
  const div = document.createElement("div");
  div.innerHTML = `
    <game-header></game-header>
    <div class = "play">
        <div class = "textPlay">Presioná jugar
        y elegí: piedra, papel o tijera antes 
        de que pasen los 3 segundos.
        </div>
        <my-button width = 250>¡Jugar!</my-button>
        <div class = "plays">
          <my-play play="piedra"></my-play>
          <my-play play="papel"></my-play>
          <my-play play="tijera"></my-play>
        </div>    
    </div>  
  `;

  const button = div.querySelector("my-button");

  button?.addEventListener("click", (e) => {
    e.preventDefault();

    state.setPlayerData({ start: true }).then(() => {
      params.goTo("/waiting-play");
    });
  });

  return div;
}
