import { state } from "../../state";
import "./index.css";

export function initShowPlay(params: any) {
  const div = document.createElement("div");
  div.innerHTML = `<div class="plays-made"></div>`;

  let yaMostre = false; // para no disparar dos veces

  function render() {
    if (yaMostre) return;
    if (!state.bothPlayersPlayed()) return; // todavía falta que juegue alguien

    yaMostre = true;

    const { me, other } = state.getPlayers();

    // Guardo la foto de la ronda: el result la va a leer de acá,
    // porque para entonces la RTDB ya puede estar reseteada.
    state.setLastRound(me.choice, other.choice);

    div.innerHTML = `
      <div class="plays-made">
        <div class="computerPlay">
          <my-play play="${other.choice}" rotate scale = 1.6></my-play>
        </div>
        <div class="myplay">
          <my-play play="${me.choice}" scale = 1.6></my-play>
        </div>
      </div>
    `;

    setTimeout(() => {
      params.goTo("/result");
    }, 1000);
  }

  state.subscribe(render);
  render(); // por si cuando llegué el otro ya había jugado

  return div;
}
