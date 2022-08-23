//CONSTANTS
const canvasWidth = 1024;
const canvasHeight = 1200;
const BEATS_IN_BAR = 4;
const BPM = 149;
const secondsPerBar = (60 / BPM) * BEATS_IN_BAR;

let COLORS;
let BG_COLOR;
let pctBarCompletion;
let latest16thBeat;
let latestBar;
let song;
let midi;
let runeSets = [];

const chords = ["yellow", "blue", "red", "green"];

const noteToColor = {
  D: "blue",
  E: "green",
  F: "yellow",
  G: "pink",
  A: "red",
  B: "orange",
  C: "purple",
}

const vinylDiamter = 650;

const groovesDiamters = [vinylDiamter, 550, 425, 300];

function getBarNum(midiTime) {
  return 1 + Math.floor((midiTime * 2) / BEATS_IN_BAR)
}

function get16thBeat(midiTime) {
  return (midiTime * 8) % (BEATS_IN_BAR * 4)
}

function createRuneSets(barNum, trackNum) {
  return [0, 1, 2, 3].map(i => new RuneSet(
    midi
      .tracks[trackNum]
      .notes
      .filter(note => getBarNum(note.time) == barNum+i)
      .map(note => new _Rune(
        1 + get16thBeat(note.time) / 4,
        COLORS[noteToColor[note.name[0]]]
      )),
    barNum+i,
    (barNum+i - 1) % 4
  ))
}


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

      fill("white")
      const radsBarCompletion = TWO_PI * pctBarCompletion
      arc(
        0, 0, 150, 150,
        PI + HALF_PI + radsBarCompletion,
        TWO_PI + HALF_PI + radsBarCompletion,
      );
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
  constructor(runes, activeBarNum, grooveIndex) {
    this.runes = [];
    runes.forEach((rune) =>
      this.runes.push(
        new Rune(
          rune.beat,
          rune.col,
          activeBarNum,
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
  constructor(beat, col, activeBarNum, grooveIndex) {
    this.beat = beat;
    this.col = col;
    this.activeBarNum = activeBarNum;
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
    let [x, y] = this.getPos();
    if (
      song.currentTime() > 0 &&
      this.isActive(latest16thBeat) &&
      latestBar == this.activeBarNum
    ) {
      fill(this.col);
      drawSquare(x, y, this.size*1.5);
    } else {
      fill("white");
      drawSquare(x, y, this.size);
    }
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
  Midi
    .fromUrl("midi/girl-in-red--serotonin.midi")
    .then(file => midi = file)

  gradient = loadImage('images/dream.png');
}

function setup() {
  COLORS = {
    pink: color(241, 148, 148),
    yellow: color("yellow"),
    blue: color("#67B8D6"),
    red: color("#E75B64"),
    green: color("#44A57C"),
    orange: color("orange"),
    purple: color("purple"),
  };

  BG_COLOR = COLORS["pink"];

  chordList1 = [
    new _Chord(COLORS["yellow"]),
    new _Chord(COLORS["blue"]),
    new _Chord(COLORS["red"]),
    new _Chord(COLORS["green"]),
  ];

  runeSets = createRuneSets(1, 2)

  chordSet1 = new ChordSet(chordList1, 1, 9001);

  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.mousePressed(canvasPressed);
  frameRate(30);
  background(BG_COLOR);
}

function draw() {
  push()
  noStroke();

  background(gradient);
  // Sets origin to center
  translate(width / 2, height / 2);

  // Music timing
  pctBarCompletion = (song.currentTime() % secondsPerBar) / secondsPerBar;
  latest16thBeat = Math.floor(pctBarCompletion * 4 * BEATS_IN_BAR + 4);

  prevLatestBar = latestBar;
  latestBar = Math.floor(song.currentTime() / secondsPerBar) + 1;

  // Percussive aura
  // NOTE For initial version make it pulse on beats 1 and 3
  fill(chordSet1.chords[0].col)
  const maxPulseLength = 150
  const pulseLength = (
    maxPulseLength *
    (1 - ((pctBarCompletion % 0.5) / 0.5) ** 3)
  )
  drawCircle(0, 0, vinylDiamter + pulseLength)

  // Vinyl
  drawVinyl();

  // Chords
  if (prevLatestBar != latestBar) {
    // Rotate chords
    // Preferable to array rotate instead of index magic to maintain z-indexes
    chordList1.push(chordList1.shift());
    chordSet1 = new ChordSet(chordList1, 1, 32);

    if ((latestBar % 4 == 1) && (latestBar > 1)) {
      runeSets = createRuneSets(latestBar, 0)
    }
  }

  noStroke();
  runeSets.forEach(runeSet =>
    runeSet.runes.forEach(rune => rune.draw())
  )

  chordSet1.chords.forEach((chord) => chord.draw());

  push(); 
  fill("pink");
  // drawCompleteRecordHead();
  pop(); 

  // Center
  fill("black");
  drawCircle(0, 0, 20);

  // drawLabel();
  pop()
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
