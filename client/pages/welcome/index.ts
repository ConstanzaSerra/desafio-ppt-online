import "../../components/play/index";
import "../../components/button/index";
import "./index.css";

export function initWelcome(params: any) {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class = "welcome">
        <div class = "text">Piedra Papel <span>ó</span> Tijera
        </div>
        <my-button class="new-game-button" width = 250>Nuevo Juego</my-button>
        <my-button class="existing-game-button" width = 250>Ingresar a una sala</my-button>
        <div class = "plays">
          <my-play play="piedra"></my-play>
          <my-play play="papel"></my-play>
          <my-play play="tijera"></my-play>
        </div>    
    </div>    
  `;

  const newGameButton = div.querySelector(".new-game-button");
  const existingGameButton = div.querySelector(".existing-game-button");

  newGameButton?.addEventListener("click", (e) => {
    e.preventDefault();
    //console.log("Se hizo clic en Nuevo Juego");
    params.goTo("/new-game"); // Redirige a la nueva página
  });

  existingGameButton?.addEventListener("click", (e) => {
    e.preventDefault();
    //console.log("Se hizo clic en Ingresar a una sala");
    params.goTo("/existing-game"); // Redirige a la página de sala existente
  });

  return div;
}
