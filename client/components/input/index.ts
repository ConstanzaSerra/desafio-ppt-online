class MyInput extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();
    this.render();
  }

  static get observedAttributes() {
    return ["label", "type", "placeholder", "width"];
  }

  attributeChangedCallback() {
    this.render();
  }

  get value() {
    return this.shadow.querySelector("input").value;
  }

  set value(newValue: string) {
    const input = this.shadow.querySelector("input") as HTMLInputElement;
    if (input) {
      input.value = newValue;
    }
  }

  render() {
    this.shadow.innerHTML = "";

    const div = document.createElement("div");
    const label = this.getAttribute("label") || "";
    const type = this.getAttribute("type") || "text";
    const placeholder = this.getAttribute("placeholder") || "";
    const width = this.getAttribute("width") || "140px";

    div.innerHTML = `
      <style>
      .input-container {
        height: 84px;
        opacity: 1;
        transform: rotate(0deg);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: ${width}px;
      }
      input {        
        height: 50px; /* Ajustá si querés que el input ocupe parte del contenedor */
        margin-bottom: 10px;
        border-width: 10px;  
        border-radius: 10px;
        border-color: #001997;
        font-size: 30px;     
        font-family: 'Odibee Sans', cursive;
        text-align: center;
        
      }
      label {
        margin-bottom: 8px;
        align-self: center;
        font-size: 25px; 
        font-family: 'Odibee Sans', cursive; /* agregá la fuente */
      }
      </style>
      <div class="input-container">
        <label for = "custom">${label}</label>
        <input id = "custom" type="${type}" placeholder="${placeholder}" />    
      </div>  
    `;

    this.shadow.appendChild(div);
  }
}

customElements.define("my-input", MyInput);
