import { state } from "../../state.ts";

class GameHeader extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  unsubscribe: any = null;

  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.render();
    this.unsubscribe = state.subscribe(() => this.render());
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    // Los datos salen del state, no de atributos del elemento
    const { me, other } = state.getPlayers();
    const roomId = state.getState().roomId;

    this.shadow.innerHTML = `
        <style>
            :host {
              display: block;
              width: 100%;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 16px;
              font-family: "Cutive", serif;
              font-size: 18px;
              padding: 10px 20px;
              box-sizing: border-box;
            }

            .players {
              min-width: 0;          /* permite que el texto se corte si no entra */
              overflow-wrap: anywhere;
            }

            .players div {
              line-height: 1.2;
            }

            .me {
              color: black;
              font-weight: 600;
            }

            .other {
              color: red;
              font-weight: 600;
            }

            .room {
              text-align: center;
              flex-shrink: 0;        /* la sala nunca se aplasta */
            }

            .room-label {
              font-weight: bold;
            }

            .room-id {
              font-size: 15px;
            }
        </style>

        <div class="header">
          <div class="players">
            <div class="me">${me?.name ?? "..."}: ${me?.totalGanados ?? 0}</div>
            <div class="other">${other?.name ?? "..."}: ${other?.totalGanados ?? 0}</div>
          </div>
          <div class="room">
            <div class="room-label">Sala</div>
            <div class="room-id">${roomId}</div>
          </div>
        </div>
    `;
  }
}

customElements.define("game-header", GameHeader);
