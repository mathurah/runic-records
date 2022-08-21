//CONSTANTS
const canvasWidth = 512
const canvasHeight = 512
const center = canvasWidth / 2
const BEATS_IN_BAR = 4

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
    this.size = 16
    this.magnitude = 200
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
  createCanvas(canvasWidth, canvasHeight)
  frameRate(60)
  background(255 / 5, 245 / 5, 238 / 5)
}

function draw() {
  // background("red")
  drawGradient(0, 0, canvasWidth, canvasHeight, color(241, 148, 148, 100), color(179, 179, 179, 10), "Y")
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
  drawCircle(0, 0, 400)

  stroke("grey")
  drawCircle(0, 0, 300)
  drawCircle(0, 0, 200)

  // DALL-E square blobs indicating next chords
  const squareSize = 8
  noStroke()
  chords.forEach((chordCol, idx) => {
    fill(chordCol)
    if (idx == 0) {
      drawCircle(0, 0, 100)
      return
    }
    drawSquare(
      // Center color blobs
      (squareSize * (idx - chords.length / 2)),
      20,
      squareSize
    )
  })

  // Center
  fill("black");
  drawCircle(0, 0, 20);
}

function drawGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === "Y") {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === "X") {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}
