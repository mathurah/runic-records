//CONSTANTS
const canvasWidth = 1024
const canvasHeight = 1024
const BEATS_IN_BAR = 4
let BG_COLOR;


const chords = [
  "yellow",
  "blue",
  "red",
  "green",
]

class Rune {
  constructor(beat, col) {
    this.beat = beat
    this.col = col
    this.size = 24
    this.magnitude = 300
  }

  getPos() {
    // Convert beat to radians
    const rad = this.beat / BEATS_IN_BAR * TWO_PI

    // Convert beat to coordinates
    const y = sin(rad)
    const x = cos(rad)
    return [x*this.magnitude, y*this.magnitude]
  }

  draw() {
    fill(this.col)
    let [x, y] = this.getPos()
    drawSquare(x, y, this.size)
  }
}

const runes_list = [
  new Rune(1, "white"),
  new Rune(2, "white"),
  new Rune(2.5, "white"),
  new Rune(3, "white"),
]

function setup() {
  BG_COLOR = color(241, 148, 148, 100)
  createCanvas(canvasWidth, canvasHeight)
  frameRate(60)
  background(BG_COLOR)
}

function draw() {
  background(BG_COLOR)
  vinyl(chords)
  runes_list.forEach(rune => rune.draw())
}

// Draws square from center instead of top left
// Coordinates (0, 0) will draw a square in the center of the canvas
function drawSquare(x, y, size) {
  square(
    x - size/2 + canvasWidth/2,
    y - size/2 + canvasHeight/2,
    size
  )
}

function drawCircle(x, y, size) {
  circle(
    x + canvasWidth/2,
    y + canvasHeight/2,
    size
  )
}

function vinyl(chords) {
  fill("black")
  drawCircle(0, 0, 600)

  stroke("grey")
  drawCircle(0, 0, 450)
  drawCircle(0, 0, 300)

  // DALL-E square blobs indicating next chords
  const squareSize = 12
  noStroke()
  chords.forEach((chordCol, idx) => {
    fill(chordCol)
    if (idx == 0) {
      drawCircle(0, 0, 150)
      return
    }
    drawSquare(
      // Center color blobs
      (squareSize * (idx - chords.length / 2)),
      30,
      squareSize
    )
  })

  // Center
  fill("black");
  drawCircle(0, 0, 30);
}

function drawGradient(x, y, w, h, c1, c2, axis) {
  noFill();
}
