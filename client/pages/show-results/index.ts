import "../../components/star/index";
import "../../components/button/index";
import "../../components/game-header/index";
import { state } from "../../state";
import "./index.css";

export function initShowResult(params: any) {
  const div = document.createElement("div");
  div.classList.add("result-containter");

  // 1. Las jugadas las tomo de la foto que sacó show-play, no de la RTDB:
  //    para este momento el otro jugador ya pudo haber reseteado su choice.
  const { me } = state.getPlayers();
  const lastRound = state.getState().lastRound || {};

  const result = state.resultVs(lastRound.myChoice, lastRound.otherChoice);

  // 2. Si gané, sumo mi propio punto (cada cliente escribe solo lo suyo).
  //    Esto corre una sola vez, fuera de render().
  if (result === "win") {
    state.setPlayerData({ totalGanados: (me?.totalGanados ?? 0) + 1 });
  }

  // 3. Reseteo mi estado de ronda apenas llego acá, para que el próximo ciclo
  //    arranque limpio y no se desincronicen los jugadores.
  state.setPlayerData({ start: false, choice: null });

  // Color de fondo según el resultado
  if (result === "win") {
    document.body.style.backgroundColor = "#888949E5";
  } else if (result === "lose") {
    document.body.style.backgroundColor = "#894949E5";
  } else {
    document.body.style.backgroundColor = "lightgrey";
  }

  function render() {
    // Los puntajes se leen siempre frescos del state (los actualiza el listener)
    const jugadores = state.getPlayers();
    const yo = jugadores.me;
    const rival = jugadores.other;

    div.innerHTML = `
        <game-header></game-header>

        <div class = "result-star">
            <my-star result = ${result}></my-star>
        </div>

        <div class = "results-table">
          <div class = "score">Score</div>
          <div class = "score__values">
            <div>${yo?.name ?? "Vos"}: <span class="number">${yo?.totalGanados ?? 0}</span></div>
            <div>${rival?.name ?? "Rival"}: <span class="number">${rival?.totalGanados ?? 0}</span></div>
          </div>
        </div>

        <div class = "result-button">
          <my-button width = 200 >Volver a jugar</my-button>
        </div>
    `;

    const button = div.querySelector("my-button");

    button?.addEventListener("click", (e) => {
      e.preventDefault();
      document.body.style.backgroundColor = "";
      params.goTo("/play");
    });
  }

  // Redibujo cuando cambian los puntajes del otro jugador
  state.subscribe(render);
  render();

  return div;
}
