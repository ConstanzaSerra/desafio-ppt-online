class Button extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  static get observedAttributes() {
    return ["width"]; //los atributos del custom element que se van a observar para
  }

  connectedCallback() {
    this.render();
  }

  render() {

    const width = this.getAttribute("width") || "140px" ;

    this.shadow.innerHTML = `
        <style>
            button {
                background-color: #006CFC;                
                width: ${width}px;
                height: 50px;
                display: block;
                border-width: 10px;  
                border-radius: 10px;
                border-color: #001997;
                font-size: 25px;     
                font-family: 'Odibee Sans', cursive; /* agregá la fuente */
                color: white; /* para que se vea bien */     
                padding: 0;
                margin: 0;               
            }

            .slot {
                font-size: 45px;    
            }

        </style>

        <button>
           <slot></slot>
        </button>
    `;
  }
}

customElements.define("my-button", Button);
