class Form {
  constructor() {
    this.title = createImg("./assets/title.png", "game title");
    this.input = createInput("").attribute("placeholder", "enter your name");
    this.button = createButton("play game");
    this.greeting = createElement("hi");
  }
  //position
  setPosition() {
    this.title.position(width / 3 - 300, 70);
    this.input.position(width / 2 - 120, height / 2 - 30);
    this.button.position(width / 2 - 100, height / 2 + 20);
    this.greeting.position(width / 2 - 100, height / 2 + 40);
  }
  //style
  setStyle() {
    this.title.class("gameTitle");
    this.input.class("customInput");
    this.button.class("customButton");
    this.greeting.class("greeting");
  }
  //mouse pressed
  handlemousePressed() {
    this.button.mousePressed(() => {
      this.input.hide();
      this.button.hide();
      var message = `hello ${this.input.value()} wait for another player to join...`;
      this.greeting.html(message);
      myplayercount += 1;
      player.updatecount(myplayercount);
      player.name = this.input.value();
      player.index = myplayercount;
      player.addPlayers();
      player.getDistance();
    });
  }
//displayer
  display() {
    this.setPosition();
    this.setStyle();
    this.handlemousePressed();
  }
  //hide
  hide() {
    this.button.hide();
    this.greeting.hide();
    this.input.hide();
  }
}
