import { memory } from "game-of-life/game_of_life_bg";
import { Universe, Cell } from "game-of-life";

const CELL_SIZE = 10;
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

let width = 50;
let height = 50;

const createUniverse = (width, height) => {
  return Universe.new(width, height);
};

const updateCanvas = () => {
  canvas.height = (CELL_SIZE + 1) * height + 1;
  canvas.width = (CELL_SIZE + 1) * width + 1;
};

let universe = createUniverse(width, height);

const canvas = document.getElementById("game-of-life-canvas");
updateCanvas(canvas);
const ctx = canvas.getContext("2d");

// Event listener for painting cells
canvas.addEventListener("click", (e) => {
  let offset = canvas.getBoundingClientRect();

  let row = Math.floor((e.clientY - offset.top) / (CELL_SIZE + 1));
  let col = Math.floor((e.clientX - offset.left) / (CELL_SIZE + 1));

  let i = getIndex(row, col);

  universe.toggle_cell(i);
  drawCells();
});

// Event listener for play button
const btn = document.getElementById("play-pause-button");
btn.addEventListener("click", () => {
  isPaused = !isPaused;
  btn.innerHTML = isPaused ? "Play" : "Pause";
  requestAnimationFrame(renderLoop);
});

// Update timestep slider value
let timeStep = 10;
const slider = document.getElementById("slider");
slider.oninput = function () {
  timeStep = this.value;
};

// Create new universe on width or height update
const widthSlider = document.getElementById("width-slider");
widthSlider.oninput = function () {
  width = this.value;
  universe = createUniverse(width, height);
  updateCanvas(canvas);
  drawGrid();
  drawCells();
};

const heightSlider = document.getElementById("height-slider");
heightSlider.oninput = function () {
  height = this.value;
  universe = createUniverse(width, height);
  updateCanvas(canvas);
  drawGrid();
  drawCells();
};

let isPaused = true;

const renderLoop = () => {
  if (isPaused) return;
  universe.tick();

  drawGrid();
  drawCells();

  // Timeout
  setTimeout(() => {
    requestAnimationFrame(renderLoop);
  }, timeStep);
};

const getIndex = (row, column) => {
  return row * width + column;
};

const drawCells = () => {
  const cellsPtr = universe.cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= width; j++) {
    ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

drawGrid();
drawCells();
