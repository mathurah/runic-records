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
    // Handle p5 silliness so squares are positioned based on center
    x += canvasWidth / 2
    y += canvasHeight / 2
    x -= this.size / 2
    y -= this.size / 2
    square(x, y, this.size)
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
  background("red")
  vinyl(chords)
  runes_list.forEach(rune => rune.draw())
}

function vinyl(chords) {
  fill("black")
  circle(center, center, 400)
  stroke("grey")
  circle(center, center, 300)
  stroke("grey")
  circle(center, center, 200)
  // DALL-E colors
  const squareSize = 8
  noStroke()
  chords.forEach((chordCol, idx) => {
    fill(chordCol)
    if (idx == 0) {
      circle(center, center, 100)
      return
    }
    square(
      // Center color blobs
      center + (squareSize * (idx - chords.length / 2)) - squareSize/2,
      center + 20 - squareSize/2,
      squareSize
      //...dalleEllipseDims
    )
  })

  // Center
  fill("black");
  circle(center, center, 20);
}

