//CONSTANTS
const canvasWidth = 1024;
const canvasHeight = 1200;
const BEATS_IN_BAR = 4;
let BG_COLOR;
let COLORS;

const chords = ["yellow", "blue", "red", "green"];

const vinylDiamter = 650;
const groovesDiamters = [550, 425, 300];

class Rune {
  constructor(beat, col) {
    this.beat = beat;
    this.col = col;
    this.size = 24;
    this.magnitude = 0.5 * groovesDiamters[0];
  }

  getPos() {
    // Convert beat to radians
    const rad = (this.beat / BEATS_IN_BAR) * TWO_PI;

    // Convert beat to coordinates
    const y = sin(rad);
    const x = cos(rad);
    return [x * this.magnitude, y * this.magnitude];
  }

  draw() {
    fill(this.col);
    let [x, y] = this.getPos();
    drawSquare(x, y, this.size);
  }
}

const runes_list = [
  new Rune(1, "white"),
  new Rune(2, "white"),
  new Rune(2.5, "white"),
  new Rune(3, "white"),
];

function setup() {
  COLORS = {
    pink: color(241, 148, 148, 100),
    yellow: color("yellow"),
    blue: color("#67B8D6"),
    red: color("#E75B64"),
    green: color("#44A57C"),
  };
  BG_COLOR = COLORS["pink"];

  createCanvas(canvasWidth, canvasHeight);
  frameRate(60);
  background(BG_COLOR);
}

function draw() {
  // Init styles
  fill("white");
  stroke("white");
  strokeWeight(1);

  // Sets origin to center
  translate(width / 2, height / 2);
  // Make Y axis point up
  scale(1, -1);

  background(BG_COLOR);

  noStroke();
  drawVinyl(chords);

  runes_list.forEach((rune) => rune.draw());
  fill("white");
  const playHeadSize = 100;
  rotate(-PI / 4);
  drawTriangle(0, vinylDiamter / 2, playHeadSize);
  rotate(0);

  fill("pink");
  drawCompleteRecordHead();
}

// Draws square from center instead of top left
// Coordinates (0, 0) will draw a square in the center of the canvas
function drawSquare(x, y, size) {
  square(x - size / 2, y - size / 2, size);
}

// Upside down equilateral triangle
function drawTriangle(x, y, r) {
  const l = sqrt(r);
  triangle(x - l, y + l, x + l, y + l, x, y - l);
}

function drawCompleteRecordHead() {
  const recordHeadSize = [60, 90];
  rotate(PI / 15);
  drawRecordHead(0, 0, recordHeadSize[0], recordHeadSize[1]);
  drawRecordSide();
}
function drawRecordHead(x, y, width, height) {
  rotate(PI);
  rect(x - groovesDiamters[2] / 3, y + groovesDiamters[1] / 2, width, height);
}

function drawRecordSide() {
  rotate(PI / 2);
  rect(groovesDiamters[2] / 1.25, 10, 20, 30);
}
function drawCircle(x, y, size) {
  circle(x, y, size);
}

function drawVinyl(chords) {
  fill("black");
  drawCircle(0, 0, vinylDiamter);

  stroke("white");
  groovesDiamters.forEach((diamter) => drawCircle(0, 0, diamter));

  // DALL-E square blobs indicating next chords
  const squareSize = 12;
  noStroke();
  chords.forEach((chordCol, idx) => {
    fill(COLORS[chordCol]);
    if (idx == 0) {
      drawCircle(0, 0, 150);
      return;
    }
    drawSquare(
      // Center color blobs
      squareSize * (idx - chords.length / 2),
      -30,
      squareSize
    );
  });

  // Center
  fill("black");
  drawCircle(0, 0, 20);

  //label
  drawLabel();
}

function drawLabel() {
  // Make Y axis point down
  scale(1, -1);

  strokeWeight(0);
  stroke("black");
  fill("white");
  rect(-canvasWidth / 2, 500, canvasWidth, 100);
  textSize(64);
  fill("black");
  text("Name of Song", 0, 1110 / 2); //TODO: add name of song
  textAlign(CENTER, CENTER);

  noFill();
  // Make Y axis point down
}
