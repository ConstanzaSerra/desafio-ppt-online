import { initCount } from "./pages/count";
import { initPlay } from "./pages/play";
import { initShowPlay } from "./pages/show-play";
import { initShowResult } from "./pages/show-results";
import { initWelcome } from "./pages/welcome";
import { initNewGame } from "./pages/new-game";
import { existingGame } from "./pages/existing-game";
import { initWaitingRoom } from "./pages/waiting-room";
import { initWaitingPlay } from "./pages/waiting-play";
import { state } from "./state";

const routes = [
  {
    path: /^\/$/,
    component: initWelcome,
  },
  {
    path: /^\/welcome$/,
    component: initWelcome,
  },
  {
    path: /^\/new-game$/,
    component: initNewGame,
  },
  {
    path: /^\/existing-game$/,
    component: existingGame,
  },
  {
    path: /^\/waiting-room$/,
    component: initWaitingRoom,
  },
  {
    path: /^\/play$/,
    component: initPlay,
  },
  {
    path: /^\/waiting-play$/,
    component: initWaitingPlay,
  },
  {
    path: /^\/count$/,
    component: initCount,
  },
  {
    path: /^\/showplay$/,
    component: initShowPlay,
  },
  {
    path: /^\/result$/,
    component: initShowResult,
  },
];

export function initRouter(container: Element) {
  function goTo(path) {
    history.pushState({}, "", path);
    handleRoute(path);
  }

  function handleRoute(route) {
    console.log("Handling route:", route);

    // Al cambiar de página, los subscribers de la página anterior ya no sirven
    state.clearSubscribers();

    for (const r of routes) {
      if (r.path.test(route)) {
        const el = r.component({ goTo });
        if (container.firstChild) container.firstChild.remove();
        container.appendChild(el);
        return; // una ruta matchea y listo: no seguimos evaluando las demás
      }
    }

    console.warn("No route found for:", route);
  }

  const initialPath = getCleanPathFromURL(); //location.pathname === "/" ? "/welcome" : location.pathname;

  // Llamar al inicio con la ruta actual
  handleRoute(initialPath);

  // Escuchar cambios en el historial (back/forward)
  window.onpopstate = () => {
    handleRoute(initialPath);
  };

  return { goTo };
}

function getCleanPathFromURL() {
  // lógica para obtener el path de la URL y limpiarlo
  const fullPath = window.location.pathname;
  console.log("full path: " + fullPath);

  //Define el basepath segun el entorno
  const basepath = "/desafio-ppt"; //Cambia esto segun el entorno

  //Verifica si el fullPath comienza con el basePath
  if (fullPath.startsWith(basepath)) {
    return fullPath.replace(basepath, "") || "/"; //Devuelve '/' si el path queda vacío
  }

  return fullPath || "/";
}
