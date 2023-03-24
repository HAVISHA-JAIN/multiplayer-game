class Player {
  constructor() {
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.name = null;
    this.rank = 0;
    this.fuel = 150;
    this.life = 150;
    this.score = 150;
  }
  //adding players
  addPlayers() {
    var PlayerRoot = "players/player" + this.index;
    if (this.index === 1) {
      this.positionX = width / 2 - 100;
    } else {
      this.positionX = width / 2 + 100;
    }
    //database reference
    database.ref(PlayerRoot).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      index: this.index,
      score: Math.round(this.score),
      rank: this.rank,
      life: this.life,
      fuel: Math.round(this.fuel),
    });
  }
  //count
  getcount() {
    var playercountroot = database.ref("playercount");
    playercountroot.on("value", function (data) {
      myplayercount = data.val();
    });
  }
  //update count
  updatecount(playerNumber) {
    database.ref("/").update({
      playercount: playerNumber,
    });
  }
  //distance
  getDistance() {
    var PlayerRoot = database.ref("players/player" + this.index);
    PlayerRoot.on("value", (data) => {
      var distance = data.val();
      // console.log(distance)
      this.positionX = distance.positionX;
      this.positionY = distance.positionY;
    });
  }
  //player info
  static getPlayersinfo() {
    var PlayerRoot = database.ref("players");
    PlayerRoot.on("value", (data) => {
      allplayers = data.val();
      // console.log(allplayers)
    });
  }
  //player information update
  updatePlayerInfo() {
    var PlayerRoot = database.ref("players/player" + this.index);
    PlayerRoot.update({
      index: this.index,
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      score: Math.round(this.score),
      rank: this.rank,
      life: this.life,
      fuel: Math.round(this.fuel),
    });
  }
  //getting data from firebase and storing inside this.rank variable
  getcarsAtEnd() {
    database.ref("carsAtEnd").on("value", (data) => {
      this.rank = data.val();
    });
  }
  //creating function to update rank when player reaches the end
  static updatecarsAtEnd(myrank) {
    database.ref("/").update({
      carsAtEnd: myrank,
    });
  }
}
