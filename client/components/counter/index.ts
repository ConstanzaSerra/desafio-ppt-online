class CountdownTimer extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  time = 3; // segundos
  interval: any = null; // setInterval devuelve number en el browser y Timeout en Node

  static get observedAttributes() {
    return ["time"];
  }

  constructor() {
    super();
    this.render();
  }

  connectedCallback() {
    this.startCountdown();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "time") {
      this.time = parseInt(newValue);
      this.render();
    }
  }

  startCountdown() {
    this.interval = setInterval(() => {
      this.time--;

      if (this.time > 0) {
        this.render();
      } else {
        clearInterval(this.interval!);
        // OJO: no usar "animationend", que es un evento nativo del navegador
        // y lo dispara la animación CSS del círculo al segundo.
        this.dispatchEvent(
          new CustomEvent("countdown-finished", { bubbles: true }),
        );
      }
    }, 1000);
  }

  disconnectedCallback() {
    // Si me voy de la página antes de terminar, corto el intervalo
    if (this.interval) clearInterval(this.interval);
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        .container {
          position: relative;
          width: 120px;
          height: 120px;
        }

        svg {
          transform: rotate(-90deg);
        }

        .circle-bg {
          fill: none;
          stroke: #ddd;
          stroke-width: 10;
        }

        .circle-progress {
          fill: none;
          stroke: black;
          stroke-width: 10;
          stroke-dasharray: 314;
          stroke-dashoffset: 314;
          animation: draw 1s linear forwards;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        .number {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 36px;
          font-family: 'Odibee Sans', cursive;
          color: black;
        }
      </style>

      <div class="container">
        <svg width="120" height="120">
          <circle class="circle-bg" cx="60" cy="60" r="50" />
          <circle class="circle-progress" cx="60" cy="60" r="50" />
        </svg>
        <div class="number">${this.time}</div>
      </div>
    `;

    // Mover el listener de animationend aquí no es necesario
  }
}

customElements.define("countdown-timer", CountdownTimer);
