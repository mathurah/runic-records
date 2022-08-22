//CONSTANTS
const canvasWidth = 1024;
const canvasHeight = 1200;
const BEATS_IN_BAR = 4;
const BPM = 149;
const secondsPerBar = (60 / BPM) * BEATS_IN_BAR;

let BG_COLOR;
let COLORS;
let latest16thBeat;
let latestBar;
let song;

const chords = ["yellow", "blue", "red", "green"];

const vinylDiamter = 650;

// TODO Set 4 grooves to allow for 4 bar rhythm loops
const groovesDiamters = [550, 425, 300];

class ChordSet {
  constructor(chords, minActiveBarNum, maxActiveBarNum) {
    this.chords = [];
    chords.forEach((chord, idx) =>
      this.chords.push(
        new Chord(
          chord.col,
          minActiveBarNum,
          maxActiveBarNum,
          idx,
          this.chords.length
        )
      )
    );
  }
}

class _Chord {
  constructor(col) {
    this.col = col;
  }
}

class Chord {
  constructor(col, minActiveBarNum, maxActiveBarNum, chordIdx, chordSetLength) {
    this.col = col;
    this.minActiveBarNum = minActiveBarNum;
    this.maxActiveBarNum = maxActiveBarNum;
    this.chordIdx = chordIdx;
    this.chordSetLength = chordSetLength;
    this.squareSize = 12;
  }

  draw() {
    fill(this.col);
    if (
      this.chordIdx == 0 &&
      latestBar >= this.minActiveBarNum &&
      latestBar <= this.maxActiveBarNum
    ) {
      drawCircle(0, 0, 150);
    } else {
      drawSquare(
        // Center color blobs
        this.squareSize * 2 * (this.chordIdx - 1 - this.chordSetLength / 2),
        30,
        this.squareSize
      );
    }
  }
}

class RuneSet {
  constructor(runes, minActiveBarNum, maxActiveBarNum, grooveIndex) {
    this.runes = [];
    runes.forEach((rune) =>
      this.runes.push(
        new Rune(
          rune.beat,
          rune.col,
          minActiveBarNum,
          maxActiveBarNum,
          grooveIndex
        )
      )
    );
  }
}

class _Rune {
  constructor(beat, col) {
    this.beat = beat;
    this.col = col;
  }
}

class Rune {
  constructor(beat, col, minActiveBarNum, maxActiveBarNum, grooveIndex) {
    this.beat = beat;
    this.col = col;
    this.minActiveBarNum = minActiveBarNum;
    this.maxActiveBarNum = maxActiveBarNum;
    this.size = 24;
    this.magnitude = 0.5 * groovesDiamters[grooveIndex];
  }

  getPos() {
    // Convert beat to radians
    const rad = ((this.beat - 2) / BEATS_IN_BAR) * TWO_PI;

    // Convert beat to coordinates
    const y = sin(rad);
    const x = cos(rad);
    return [x * this.magnitude, y * this.magnitude];
  }

  draw() {
    if (
      song.currentTime() > 0 &&
      this.isActive(latest16thBeat) &&
      latestBar >= this.minActiveBarNum &&
      latestBar <= this.maxActiveBarNum
    ) {
      fill(this.col);
    } else {
      fill("white");
    }
    let [x, y] = this.getPos();
    drawSquare(x, y, this.size);
  }

  isActive(latest16thBeat) {
    return (
      this.beat * 4 == latest16thBeat || this.beat * 4 == latest16thBeat - 1
    );
  }
}

function canvasPressed() {
  if (song.isPlaying()) {
    song.stop();
  } else {
    song.play();
  }
}

function preload() {
  song = loadSound("audio/girl-in-red--serotonin.mp3");
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

  const runesList1 = [
    new _Rune(1, COLORS["blue"]),
    new _Rune(1.5, COLORS["yellow"]),
    new _Rune(2, COLORS["green"]),
    new _Rune(3, COLORS["green"]),
    new _Rune(4, COLORS["green"]),
  ];

  const runesList2 = [
    new _Rune(1, COLORS["blue"]),
    new _Rune(2, COLORS["green"]),
    new _Rune(3, COLORS["green"]),
    new _Rune(4, COLORS["yellow"]),
    new _Rune(4.5, COLORS["green"]),
  ];

  chordList1 = [
    new _Chord(COLORS["yellow"]),
    new _Chord(COLORS["blue"]),
    new _Chord(COLORS["red"]),
    new _Chord(COLORS["green"]),
  ];

  runeSet1 = new RuneSet(runesList1, 1, 3, 0);
  runeSet2 = new RuneSet(runesList2, 4, 4, 1);

  chordSet1 = new ChordSet(chordList1, 1, 8);

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.mousePressed(canvasPressed);
  frameRate(30);
  background(BG_COLOR);
}

function draw() {
  // Init styles
  rotate(0);
  fill("white");
  stroke("white");
  strokeWeight(1);

  background(BG_COLOR);

  // Sets origin to center
  translate(width / 2, height / 2);

  noStroke();
  drawVinyl();

  pctBarCompletion = (song.currentTime() % secondsPerBar) / secondsPerBar;
  latest16thBeat = Math.floor(pctBarCompletion * 4 * BEATS_IN_BAR + 4);

  prevLatestBar = latestBar;
  latestBar = Math.floor(song.currentTime() / secondsPerBar) + 1;

  if (prevLatestBar != latestBar) {
    chordList1.push(chordList1.shift());
    chordSet1 = new ChordSet(chordList1, 1, 32);
  }

  noStroke();
  runeSet1.runes.forEach((rune) => rune.draw());
  runeSet2.runes.forEach((rune) => rune.draw());

  chordSet1.chords.forEach((chord) => chord.draw());

  push(); 
  fill("pink");
  drawCompleteRecordHead();
  pop(); 

  // Center
  fill("black");
  drawCircle(0, 0, 20);

  drawLabel();
}

// Draws square from center instead of top left
// Coordinates (0, 0) will draw a square in the center of the canvas
function drawSquare(x, y, size) {
  square(x - size / 2, y - size / 2, size);
}

//RecordHead
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
// Upside down equilateral triangle
function drawTriangle(x, y, r) {
  const l = sqrt(r);
  triangle(x - l, y + l, x + l, y + l, x, y - l);
}

function drawCompleteRecordHead() {
  const recordHeadSize = [60, 90];
  rotate(-PI / 5);
  translate(0, 10);
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

function drawVinyl() {
  fill("black");
  drawCircle(0, 0, vinylDiamter);

  stroke("white");
  groovesDiamters.forEach((diamter) => drawCircle(0, 0, diamter));
}

function drawLabel() {
  // Make Y axis point down
  // scale(1, -1);

  strokeWeight(0);
  stroke("black");
  fill("white");
  rect(-canvasWidth / 2, 500, canvasWidth, 100);
  textSize(64);
  fill("black");

  text("Serotonin", 0, 1110 / 2);
  textAlign(CENTER, CENTER);

  noFill();
}
