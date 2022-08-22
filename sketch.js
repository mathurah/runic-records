//CONSTANTS
const canvasWidth = 1024;
const canvasHeight = 1200;
const BEATS_IN_BAR = 4;
const BPM = 120;
const secondsPerBar = 60 / BPM * BEATS_IN_BAR;

let BG_COLOR;
let COLORS;
let ms = 0
let latest16thBeat
let runes_list

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
    if (this.isActive(latest16thBeat)) {
      fill(this.col)
    } else {
      fill("white")
    }
    let [x, y] = this.getPos();
    drawSquare(x, y, this.size);
  }

  isActive(latest16thBeat) {
    return (
      (this.beat * 4 == latest16thBeat) ||
      (this.beat * 4 == latest16thBeat - 1)
    )
  }
}

function setup() {
  COLORS = {
    pink: color(241, 148, 148),
    yellow: color("yellow"),
    blue: color("#67B8D6"),
    red: color("#E75B64"),
    green: color("#44A57C"),
  };
  BG_COLOR = COLORS["pink"];

  runes_list = [
    new Rune(1, COLORS["blue"]),
    new Rune(2, COLORS["green"]),
    new Rune(2.5, COLORS["blue"]),
    new Rune(3, COLORS["green"]),
  ]

  createCanvas(canvasWidth, canvasHeight);
  frameRate(120);
  background(BG_COLOR);
}

function draw() {
  // Init styles
  rotate(0)
  fill("white")
  stroke("white")
  strokeWeight(1)

  background(BG_COLOR)
  
  // Sets origin to center
  translate(width/2, height/2); 

  // Make Y axis point up
  scale(1, -1);

  noStroke()
  drawVinyl(chords)

  ms += deltaTime
  pctBarCompletion = ms / 1000 % secondsPerBar / secondsPerBar
  latest16thBeat = Math.floor(pctBarCompletion * 4 * BEATS_IN_BAR)
 
  runes_list.forEach(rune => rune.draw())
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
  text("Serotonin", 0, 1110/2)
  textAlign(CENTER, CENTER);

  noFill()
}
