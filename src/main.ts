import "./style.css";

type CameraState = {
  offsetX: number;
  offsetY: number;
  zoom: number;
  lastAction: string;
};

const INITIAL_STATE: CameraState = {
  offsetX: 0,
  offsetY: 0,
  zoom: 1,
  lastAction: "操作待機中です。矢印キーまたは Enter を押してください。",
};

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.15;
const BASE_MOVE_STEP = 28;
const BASE_MOVE_LIMIT = 210;

const cameraImage = document.querySelector<HTMLImageElement>("#camera-image");
const zoomStatus = document.querySelector<HTMLElement>("#zoom-status");
const xStatus = document.querySelector<HTMLElement>("#x-status");
const yStatus = document.querySelector<HTMLElement>("#y-status");
const actionStatus = document.querySelector<HTMLElement>("#action-status");
const positionDot = document.querySelector<HTMLElement>("#position-dot");
const viewport = document.querySelector<HTMLElement>(".viewport-frame");

if (
  !cameraImage ||
  !zoomStatus ||
  !xStatus ||
  !yStatus ||
  !actionStatus ||
  !positionDot ||
  !viewport
) {
  throw new Error("カメラ操作UIの初期化に必要な要素が見つかりません。");
}

let state: CameraState = { ...INITIAL_STATE };

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const getMoveLimit = (zoom: number): number =>
  BASE_MOVE_LIMIT * Math.max(zoom, 1);

const normalizeState = (nextState: CameraState): CameraState => {
  const zoom = clamp(Number(nextState.zoom.toFixed(2)), MIN_ZOOM, MAX_ZOOM);
  const limit = getMoveLimit(zoom);

  return {
    ...nextState,
    zoom,
    offsetX: clamp(nextState.offsetX, -limit, limit),
    offsetY: clamp(nextState.offsetY, -limit, limit),
  };
};

const render = (): void => {
  const limit = getMoveLimit(state.zoom);
  const dotX = 50 + (state.offsetX / limit) * 42;
  const dotY = 50 + (state.offsetY / limit) * 42;

  cameraImage.style.transform = `translate3d(${state.offsetX}px, ${state.offsetY}px, 0) scale(${state.zoom})`;
  zoomStatus.textContent = `${Math.round(state.zoom * 100)}%`;
  xStatus.textContent = `${Math.round(state.offsetX)}`;
  yStatus.textContent = `${Math.round(state.offsetY)}`;
  actionStatus.textContent = state.lastAction;
  positionDot.style.left = `${clamp(dotX, 8, 92)}%`;
  positionDot.style.top = `${clamp(dotY, 8, 92)}%`;

  viewport.dataset.zoomLevel =
    state.zoom > 1.2 ? "tele" : state.zoom < 0.95 ? "wide" : "standard";
};

const updateState = (nextState: CameraState): void => {
  state = normalizeState(nextState);
  render();
};

const resetCamera = (): void => {
  updateState({ ...INITIAL_STATE, lastAction: "初期位置に戻しました。" });
};

const moveCamera = (deltaX: number, deltaY: number, message: string): void => {
  const adjustedStep = BASE_MOVE_STEP / Math.max(state.zoom, 1);

  updateState({
    ...state,
    offsetX: state.offsetX + deltaX * adjustedStep,
    offsetY: state.offsetY + deltaY * adjustedStep,
    lastAction: message,
  });
};

const zoomCamera = (direction: "in" | "out"): void => {
  const nextZoom =
    direction === "in" ? state.zoom + ZOOM_STEP : state.zoom - ZOOM_STEP;
  const message =
    direction === "in" ? "ズームインしました。" : "ワイド表示にしました。";

  updateState({
    ...state,
    zoom: nextZoom,
    lastAction: message,
  });
};

const handledKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Enter",
  "Escape",
]);

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (!handledKeys.has(event.key)) {
    return;
  }

  event.preventDefault();

  switch (event.key) {
    case "ArrowUp":
      moveCamera(0, 1, "表示中心を上に移動しました。");
      break;
    case "ArrowDown":
      moveCamera(0, -1, "表示中心を下に移動しました。");
      break;
    case "ArrowLeft":
      moveCamera(1, 0, "表示中心を左に移動しました。");
      break;
    case "ArrowRight":
      moveCamera(-1, 0, "表示中心を右に移動しました。");
      break;
    case "Enter":
      zoomCamera(event.shiftKey ? "out" : "in");
      break;
    case "Escape":
      resetCamera();
      break;
  }
});

viewport.addEventListener("click", () => {
  viewport.focus();
});

render();
