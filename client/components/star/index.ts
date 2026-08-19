const winImg = require("url:../../assets/images/win.png");
const loseImg = require("url:../../assets/images/lose.png");
const drawImg = require("url:../../assets/images/draw.png");

class MyStar extends HTMLElement {
  shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this.render();
  }

  static get observedAttributes() {
    return ["result"]; //los tres atributos del custom element que se van a observar para
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const result = this.getAttribute("result");
    console.log("Resultado desde el custom element: ", result)

    const resultImg: any = {
      win: winImg,
      lose: loseImg,
      draw: drawImg,
    };

    this.shadow.innerHTML = `
        <style>
            img{
                width: 200px;       
                height: 200px;       
            }

        </style>
            <img src="${resultImg[result]}" alt="${result}" class = "img-result"/>
    `;
  }
}

customElements.define("my-star", MyStar);
