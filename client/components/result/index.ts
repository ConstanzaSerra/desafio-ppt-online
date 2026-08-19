class StarMessage extends HTMLElement {
  shadow = this.attachShadow({ mode: 'open' });

  constructor() {
    super();
    this.render();
  }

  static get observedAttributes() {
    return ['color', 'text'];
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const color = this.getAttribute('color') || 'green';
    const text = this.getAttribute('text') || 'Ganaste';

    this.shadow.innerHTML = `
      <style>
        .star {
          fill: ${color};
          stroke: black;
          stroke-width: 4;
        }

        text {
          font-size: 24px;
          fill: white;
          dominant-baseline: middle;
          text-anchor: middle;
          font-family: 'Odibee Sans', cursive;
          user-select: none;
        }
      </style>

      <svg width="240" height="240" viewBox="0 0 240 240">
        <polygon class="star" points="
          120,20
          140,90
          210,90
          155,135
          175,210
          120,170
          65,210
          85,135
          30,90
          100,90
        " />
        <text x="120" y="130">${text}</text>
      </svg>
    `;
  }
}

customElements.define('star-message', StarMessage);// class StarMessage extends HTMLElement {
//     shadow = this.attachShadow({ mode: 'open' });
//   constructor() {
//     super();
//     this.render();
//   }

//   static get observedAttributes() {
//     return ['color', 'text'];
//   }

//   attributeChangedCallback() {
//     this.render();
//   }

//   render() {
//     const color = this.getAttribute('color') || 'green';
//     const text = this.getAttribute('text') || 'Ganaste';

//     this.shadow.innerHTML = `
//       <style>
//         .star {
//           fill: ${color};
//           stroke: black;
//           stroke-width: 4;
//         }
//         text {
//           font-size: 20px;
//           fill: white;
//           dominant-baseline: middle;
//           text-anchor: middle;
//           font-family: 'Odibee Sans', cursive;
//           user-select: none;
//         }
//       </style>
//       <svg width="180" height="120" viewBox="0 0 180 120" style="transform: rotate(-15deg);">
//         <polygon class="star" points="
//             90,15
//             105,55
//             145,55
//             112,75
//             125,115
//             90,95
//             55,115
//             68,75
//             35,55
//             75,55
//         " />
//         <text x="90" y="75">${text}</text>
//       </svg>
//     `;
//   }
// }

// customElements.define('star-message', StarMessage);
