import { initRouter } from "./router";
import { state } from "./state";

(function () {
  const root = document.querySelector(".root");
  initRouter(root);
  state.init();
})();
