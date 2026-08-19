import "../../components/play/index";
import "../../components/input/index";
import "../../components/button/index";
import "./index.css";
import { state } from "../../state.ts";

export function initNewGame(params: any) {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class = "welcome">
        <div class = "text">Piedra Papel <span>ó</span> Tijera
        </div>
        <my-input class="user-name" label= "Tu Nombre" width = 250></my-input>
        <my-button class="start-button" width = 250>Empezar</my-button>
        <div class = "plays">
          <my-play play="piedra"></my-play>
          <my-play play="papel"></my-play>
          <my-play play="tijera"></my-play>
        </div>    
    </div>    
  `;

  const userNameInput = div.querySelector(".user-name") as any;

  if (userNameInput) {
    userNameInput.value = state.data?.user || "";
  } else {
    console.warn("No se encontró el input con id 'userNameInput'");
  }


  const startGameButton = div.querySelector(".start-button");

  startGameButton?.addEventListener("click", async (e) => {
    e.preventDefault();
    const cs = state.getState();
    if(!cs.userId){ //es un nuevo usuario
      await state.setUser(userNameInput.value)
    }
    state.leaveRoom(); // me desengancho de la sala anterior antes de crear una nueva
    await state.crearSala();
    
    console.log("Room Id creado: " + cs.roomId);
    console.log("Se hizo clic en Empezar");
    params.goTo("/waiting-room"); // Redirige a la sala de espera
  });

  return div;
}
