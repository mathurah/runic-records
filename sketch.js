//CONSTANTS
const canvasWidth = 1024;
const canvasHeight = 1200;
const BEATS_IN_BAR = 4;
const BPM = 120;
const secondsPerBar = 60 / BPM * BEATS_IN_BAR;

let BG_COLOR;
let COLORS;
let ms = 0

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
    pink: color(241, 148, 148),
    yellow: color("yellow"),
    blue: color("#67B8D6"),
    red: color("#E75B64"),
    green: color("#44A57C"),
  };
  BG_COLOR = COLORS["pink"];

  createCanvas(canvasWidth, canvasHeight);
  frameRate(120);
  background(BG_COLOR);
}

function draw() {
  background(0)
  // Init styles
  rotate(0)
  fill("white")
  stroke("white")
  strokeWeight(1)
  
  // Sets origin to center
  translate(width/2, height/2); 
  // Make Y axis point up
  scale(1, -1);

  background(BG_COLOR)

  noStroke()
  drawVinyl(chords)
 
  runes_list.forEach(rune => rune.draw())
  fill("white")

  // // Draw play head
  // // I don't like how this looks
  // const playHeadSize = 200
  // ms += deltaTime
  // rotate(TWO_PI * ((ms / 1000) % secondsPerBar) / secondsPerBar)
  // drawTriangle(0, vinylDiamter/2, playHeadSize)
}

// Draws square from center instead of top left
// Coordinates (0, 0) will draw a square in the center of the canvas
function drawSquare(x, y, size) {
  square(
    x - size/2,
    y - size/2,
    size
  );
}

// Upside down equilateral triangle
function drawTriangle(x, y, r) {
  const l = sqrt(r)
  triangle(
    x - l,
    y + l,
    x + l,
    y + l,
    x,
    y - l,
  )
}

function drawCircle(x, y, size) {
  circle(x, y, size)
}

function drawVinyl(chords) {
  fill("black");
  drawCircle(0, 0, vinylDiamter);

  stroke("white")
  groovesDiamters.forEach(diamter => drawCircle(0, 0, diamter))

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
      (squareSize * (idx - chords.length / 2)),
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
  rect(-canvasWidth/2, 500, canvasWidth, 100);
  textSize(64);
  fill("black");
  text("Name of Song", 0, 1110/2); //TODO: add name of song
  textAlign(CENTER, CENTER);

  noFill()
  // Make Y axis point down
}
