class Game {
  constructor() {
    this.resetButton = createButton("");
    this.resetText = createElement("h1");
    this.leaderboard = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playermoving = false;
    this.leftkeyActive = false;
    this.blast = false;
  }

  //firebase values
  getstate() {
    var gamestateroot = database.ref("gamestate");
    gamestateroot.on("value", function (data) {
      Mygamestate = data.val();
    });
  }
  //updating state
  updatestate(stateNumber) {
    database.ref("/").update({
      gamestate: stateNumber,
    });
  }

  //gamestage=0
  start() {
    //form display
    form = new Form();
    form.display();
    //player display
    player = new Player();
    player.getcount();
    //car1 display
    car1 = createSprite(width / 2 - 100, height - 100);
    car1.addImage("car1", car1Image);
    car1.addImage("blast", blastimage);

    car1.scale = 0.07;
    //car2 display
    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2Image);
    car2.addImage("blast", blastimage);
    car2.scale = 0.07;
    cars = [car1, car2];
    var obstacle1position = [
      { x: width / 2 - 150, y: height - 1300, image: obstacle1image },
      { x: width / 2 - 250, y: height - 1800, image: obstacle1image },
      { x: width / 2 - 180, y: height - 3200, image: obstacle1image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1image },
      { x: width / 2, y: height - 5200, image: obstacle1image },
    ];
    var obstacle2position = [
      { x: width / 2 - 250, y: height - 800, image: obstacle2image },
      { x: width / 2 - 180, y: height - 3800, image: obstacle2image },
      { x: width / 2 + 250, y: height - 3200, image: obstacle2image },
      { x: width / 2 + 150, y: height - 4000, image: obstacle2image },
      { x: width / 2, y: height - 5500, image: obstacle2image },
    ];
    //fuels and coins group
    fuelsGroup = new Group();
    coinsGroup = new Group();
    this.addSprites(fuelsGroup, 10, fuelImage, 0.02);
    this.addSprites(coinsGroup, 70, coinImage, 0.07);
    //obstacle 1 and 2 group
    obstacle1group = new Group();
    obstacle2group = new Group();
    this.addSprites(
      obstacle1group,
      obstacle1position.length,
      obstacle1image,
      0.04,
      obstacle1position
    );
    this.addSprites(
      obstacle2group,
      obstacle2position.length,
      obstacle2image,
      0.04,
      obstacle2position
    );
    // this.addSprites(obstacle1group, 15, obstacle1image, 0.03);
    // this.addSprites(obstacle2group, 15, obstacle2image, 0.03);
  }
  //add sprites
  addSprites(spriteGroup, numSprites, Spriteimage, spriteScale, position = []) {
    for (var i = 0; i < numSprites; i += 1) {
      var x, y;

      if (position.length > 0) {
        x = position[i].x;
        y = position[i].y;
        Spriteimage = position[i].image;
      } else {
        x = random(width / 2 - 320, width / 2 + 320);
        y = random((-height / 2) * 6, height - 300);
      }

      var sprite = createSprite(x, y);
      sprite.addImage("sprite", Spriteimage);
      sprite.scale = spriteScale;
      spriteGroup.add(sprite);
    }
  }

  //gamestage=1
  handleElements() {
    //form
    form.hide();
    form.title.position(20, 100);
    form.title.class("titlereset");
    //reset text
    this.resetText.html("Reset");
    this.resetText.class("resetText");
    this.resetText.position(width / 2 + 450, height / 2 - 320);
    //reset button
    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 450, height / 2 - 270);
    //leaderboard
    this.leaderboard.html("leaderboard");
    this.leaderboard.class("resetText");
    this.leaderboard.position(width / 2 - 200, height / 2 - 250);
    //leader1,2
    this.leader1.class("leadersText");
    this.leader1.position(width / 2 - 200, height / 2 - 200);
    this.leader2.class("leadersText");
    this.leader2.position(width / 2 - 200, height / 2 - 150);
    // this.leader1.html("H");
    // this.leader2.html("D");
  }
  //handle reset function
  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").update({
        gamestate: 0,
        playercount: 0,
        players: {},
        carsAtEnd: 0,
      });
      window.location.reload();
    });
  }
  //handle fuel function
  handlefuel(carsindex) {
    cars[carsindex - 1].overlap(fuelsGroup, function (collector, collider) {
      if (player.fuel <= 150) {
        player.fuel += 20;
      }
      player.updatePlayerInfo;
      collider.remove();
    });
    if (player.fuel > 0 && this.playermoving) {
      player.fuel -= 0.3;
    }
    if (player.fuel < 0) {
      Mygamestate = 2;
      this.gameover();
    }
  }
  //handle coins function
  handlecoins(carsindex) {
    cars[carsindex - 1].overlap(coinsGroup, function (collector, collider) {
      if (player.score <= 150) {
        player.score += 20;
      }
      player.updatePlayerInfo;
      collider.remove();
    });
    if (player.score > 0 && this.playermoving) {
      player.score -= 0.3;
    }
  }
  //play state
  play() {
    this.handleElements();
    Player.getPlayersinfo();
    this.handleResetButton();
    player.getcarsAtEnd();

    if (allplayers !== undefined) {
      image(trackImage, 0, -height * 5, width, height * 6);
      this.showleaderboard();
      this.showfuelbar();
      this.showcoinbar();
      var index = 0;
      for (var a in allplayers) {
        var x = allplayers[a].positionX;
        var y = height - allplayers[a].positionY;
        index = index + 1;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
        //access life
        var currentlife = allplayers[a].life;
        if (currentlife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.2;
        }

        if (index === player.index) {
          //calling obstacle
          this.handleobstcles(index);
          //calling function
          this.handlefuel(index);
          this.handlecoins(index);
          stroke("black");
          strokeWeight(4);
          fill("yellow");
          ellipse(x, y, 70, 70);
          if (player.life <= 0) {
            this.blast = true;
            this.playermoving = false;
          }
          //camera
          camera.position.y = cars[index - 1].position.y;
          // camera.position.x = cars[index - 1].position.x;
        }
      }
    }
    //finishing line
    var finishline = height * 6 - 100;
    if (player.positionY > finishline) {
      Mygamestate = 2;
      player.rank += 1;
      Player.updatecarsAtEnd(player.rank);
      player.updatePlayerInfo();
      this.showRank();
    }
    //AI
    // if (this.playermoving) {
    //   player.positionY += 10;
    //   player.updatePlayerInfo();
    // }
    drawSprites();
    this.handleMovementofPlayer();
  }
  //movement
  handleMovementofPlayer() {
    if (!this.blast) {
      if (keyDown("UP_ARROW")) {
        player.positionY += 10;
        player.updatePlayerInfo();
        this.playermoving = true;
      }
      if (keyDown("RIGHT_ARROW")) {
        player.positionX += 10;
        player.updatePlayerInfo();
        this.playermoving = true;
      }
      if (keyDown("LEFT_ARROW")) {
        player.positionX -= 10;
        //PLAYER INFO UPDATE
        player.updatePlayerInfo();
        this.playermoving = true;
      }
    }
  }
  //leader board
  showleaderboard() {
    var leader1, leader2;
    var player = Object.values(allplayers);
    if (
      (player[0].rank === 0 && player[1].rank === 0) ||
      player[0].rank === 1
    ) {
      leader1 =
        player[0].rank + "&emsp;" + player[0].name + "&emsp;" + player[0].score;
      leader2 =
        player[1].rank + "&emsp;" + player[1].name + "&emsp;" + player[1].score;
    }
    if (player[1].rank === 1) {
      leader1 =
        player[1].rank + "&emsp;" + player[1].name + "&emsp;" + player[1].score;
      leader2 =
        player[0].rank + "&emsp;" + player[0].name + "&emsp;" + player[0].score;
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  //fuel bar
  showfuelbar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 100, 20, 20);
    fill("white");
    rect(width / 2 - 80, height - player.positionY - 100, 150, 20);
    fill("red");
    rect(width / 2 - 80, height - player.positionY - 100, player.fuel, 20);
    pop();
  }
  //coin bar
  showcoinbar() {
    push();
    image(coinImage, width / 2 - 130, height - player.positionY - 140, 20, 20);
    fill("white");
    rect(width / 2 - 80, height - player.positionY - 140, 150, 20);
    fill("gold");
    rect(width / 2 - 80, height - player.positionY - 140, player.score, 20);
    pop();
  }
  //rank
  showRank() {
    swal({
      title: `Awesome!${"\n"} Rank${"\n"}${
        player.rank
      }\n score${"\n"}${Math.round(player.score)}`,
      text: "you have reached the end",
      imageUrl:
        "https://www.freeiconspng.com/uploads/trophy-free-download-png-0.png",
      imageSize: "100 x 100",
      confirmButtonText: "OK",
    });
  }
  //game over
  gameover() {
    swal({
      title: `try again!${"\n"} fuel${"\n"}${Math.round(
        player.fuel
      )}\n score${"\n"}${Math.round(player.score)}`,
      text: "the fuel is finished",
      imageUrl:
        "https://th.bing.com/th/id/R.04d20ca1f3bbd97b9d89f5a3ab0ac7e9?rik=GKaJr%2bNsRl%2be1w&riu=http%3a%2f%2ficons.iconarchive.com%2ficons%2fgoogle%2fnoto-emoji-people-bodyparts%2f1024%2f12014-thumbs-down-icon.png&ehk=x7mKRl5dCfIxtnT7cBGw7jd3%2bQIoJEDHTgCJ9imfSXk%3d&risl=&pid=ImgRaw&r=0",
      imageSize: "100 x 100",
      confirmButtonText: "OK",
    });
  }
  //handle obstacles
  handleobstcles(index) {
    if (
      cars[index - 1].collide(obstacle1Group) ||
      cars[index - 1].collide(obstacle2Group)
    ) {
      if (this.leftkeyActive === true) {
        myplayer.positionX += 100;
      } else {
        myplayer.positionX -= 100;
      }
      if (myplayer.life > 0) {
        myplayer.life = -150 / 4;
      }
      myplayer.updatePlayerInfo();
    }
  }
  //handle obstacles
  handleobstcles(index) {
    if (
      cars[index - 1].collide(obstacle1group) ||
      cars[index - 1].collide(obstacle2group)
    ) {
      if (this.leftkeyActive === true) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }
      if (player.life > 0) {
        player.life = -150 / 4;
      }
      player.updatePlayerInfo();
    }
  }
  //gamestage=2
  end() {}
}
