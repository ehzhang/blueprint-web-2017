/**
 * Using the tutorial code from:
 * http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
 */

var mainState = {
  preload: function() {
    // Where we load the images + sounds
    game.load.image('bird', '/static/assets/bird.png');
    game.load.image('pipe', '/static/assets/pipe.png');

    // Sound!!
    game.load.audio('jump', '/static/assets/jump.wav');
  },

  create: function() {
    // Load the Jump Sound
    this.jumpSound = game.add.audio('jump');

    // Scoring
    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0",
      { font: "30px Arial", fill: "#ffffff" });

    // Create a group
    this.pipes = game.add.group();
    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    // Set up the game
    game.stage.backgroundColor = '#71c5cf';

    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird at position x=100, y=245
    this.bird = game.add.sprite(100, 245, 'bird');
    // Pt 2: Rotation
    this.bird.anchor.setTo(-0.2, 0.5);

    // Add physics to the bird
    game.physics.arcade.enable(this.bird);

    // Give the bird gravity
    this.bird.body.gravity.y = 1000;

    // Make it jump when you hit the spacebar
    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);

    spaceKey.onDown.add(this.jump, this);
  },

  update: function() {
    // Called 60x per second
    if (this.bird.y < 0 || this.bird.y > 490) {
      this.endGame();
    }

    // Pt 2: Angle
    if (this.bird.angle < 20) {
      this.bird.angle += 1;
    }

    game.physics.arcade.overlap(
      this.bird, this.pipes, this.hitPipe, null, this);
  },

  jump: function() {
    // Pt 2: Death
    if (this.bird.alive === false) {
      return;
    }

    this.jumpSound.play();
    this.bird.body.velocity.y = -350;

    // Pt 2: Jump Angle
    var animation = game.add.tween(this.bird);
    game.add.tween(this.bird).to({angle: -20}, 100).start();
  },

  hitPipe: function() {
    if (this.bird.alive === false) {
      return;
    }

    this.bird.alive = false;

    game.time.events.remove(this.timer);

    this.pipes.forEach(function(p) {
      p.body.velocity.x = 0;
    }, this);

  },

  addOnePipe: function(x, y) {
    var pipe = game.add.sprite(x, y, 'pipe');

    this.pipes.add(pipe);

    game.physics.arcade.enable(pipe);

    pipe.body.velocity.x = -200;

    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },

  addRowOfPipes: function() {
    this.score += 1;
    this.labelScore.text = this.score;

    var hole = Math.floor(Math.random() * 5) + 1;

    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1) {
        this.addOnePipe(400, i * 60 + 10);
      }
    }
  },

  endGame: function() {
    // TODO: FOR YOU!
    // The game is over!!
    // What can you do with this.score?
  },
};

var game = new Phaser.Game(400, 490);

game.state.add('main', mainState);

game.state.start('main');