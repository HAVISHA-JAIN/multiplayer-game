//variables
var canvas;
var backgroundImage;
var bgImg;
var database;
var form;
var player;
var game;
var Mygamestate, myplayercount;
var car1, car2, track;
var allplayers;
var cars;
var fuelsGroup, fuelImage;
var coinsGroup, coinImage;
var obstacle1, obstacle1group, obstacle1image;
var obstacle2, obstacle2group, obstacle2image;
var blastimage
//function preload
function preload() {
  backgroundImage = loadImage("./assets/background.png");
  car1Image = loadImage("car1.png");
  car2Image = loadImage("car2.png");
  trackImage = loadImage("track.jpg");
  coinImage = loadImage("./assets/goldCoin.png");
  fuelImage = loadImage("./assets/fuel.png");
  obstacle1image = loadImage("./assets/obstacle1.png");
  obstacle2image = loadImage("./assets/obstacle2.png");
  blastimage=loadImage("./assets/blast.png")
}
//function setup
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.start();
  game.getstate();
}
//function draw
function draw() {
  background(backgroundImage);

  if (myplayercount === 2) {
    game.updatestate(1);
  }
  if (Mygamestate === 1) {
    game.play();
  }
}
//window resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
