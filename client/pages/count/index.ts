import "../../components/counter/index";
import { state } from "../../state";
import "./index.css";

export function initCount(params: any) {
  const div = document.createElement("div");
  div.classList.add("count");
  div.innerHTML = `    
    <countdown-timer></countdown-timer>
    <div class = "plays">
      <my-play play="piedra" clickable></my-play>
      <my-play play="papel" clickable></my-play>
      <my-play play="tijera" clickable></my-play>
    </div>       
  `;

  const plays = div.querySelectorAll("my-play");
  let selectedPlay = null;

  plays.forEach((play) => {
    play.addEventListener("play-selected", (event) => {
      selectedPlay = event.detail;
      console.log("Jugada desde el contador: ", selectedPlay);

      plays.forEach((p) => {
        if (p.getAttribute("play") !== selectedPlay) {
          p.setAttribute("dimmed", ""); // Agregar el atributo dimmed
        } else {
          p.removeAttribute("dimmed"); // Quitar el atributo dimmed del seleccionado
        }
      });
    });
  });

  const counter = div.querySelector("countdown-timer");
  counter?.addEventListener("countdown-finished", () => {
    // Si no eligió nada, se le asigna una jugada al azar
    const moves = ["piedra", "papel", "tijera"];
    const choice = selectedPlay ?? moves[Math.floor(Math.random() * 3)];

    console.log("Jugada enviada:", choice, selectedPlay ? "(elegida)" : "(al azar)");

    state.setPlayerData({ choice }).then(() => {
      params.goTo("/showplay");
    });
  });

  return div;
}
