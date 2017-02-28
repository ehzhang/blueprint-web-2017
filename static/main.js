(function(){
  /**
   * Using the tutorial code from:
   * http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
   * http://www.lessmilk.com/tutorial/flappy-bird-phaser-2
   */

  // Global score
  var GAME_SCORE = 0;

  var mainState = {
    preload: function() {
      // In preload, we load assets, like images and sounds.
      game.load.image('bird', '/static/assets/bird2.png');
      game.load.image('pipe', '/static/assets/pipe2.png');

      // Sound!!
      game.load.audio('jump', '/static/assets/jump.wav');
    },

    create: function() {
      // Add the jump sound
      this.jumpSound = game.add.audio('jump');

      // Scoring
      this.score = 0;
      this.labelScore = game.add.text(20, 20, "0",
        { font: "30px Arial", fill: "#ffffff" });

      // Create a group of items
      this.pipes = game.add.group();

      // Set up the game
      game.stage.backgroundColor = '#217acc';

      // Set the physics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // Display the bird at position x=100, y=245
      this.bird = game.add.sprite(100, 245, 'bird');
      // Set the anchor for the bird's axis of rotation.
      this.bird.anchor.setTo(-0.2, 0.5);

      // When the bird goes out of the game bounds, it should die.
      this.bird.checkWorldBounds = true;
      this.bird.events.onOutOfBounds.add(this.die, this);

      // Add physics to the bird
      game.physics.arcade.enable(this.bird);

      // Make it jump when you hit the spacebar
      var spaceKey = game.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR);

      spaceKey.onDown.add(this.startGame, this);
      spaceKey.onDown.add(this.jump, this);

      game.input.onDown.add(this.startGame, this);
      game.input.onDown.add(this.jump, this);
    },

    update: function() {
      // Code in this update function is called 60x a second.
      if (this.bird.angle < 20) {
        this.bird.angle += 1;
      }

      // If the bird collides with the pipe, call the hitPipe function.
      game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this);
    },

    startGame: function() {
      if (this.gameStarted) {
        return;
      }
      this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
      // Give the bird gravity
      this.bird.body.gravity.y = 1000;
      this.gameStarted = true;
    },

    jump: function() {
      // Birds can't jump if they dead
      if (this.bird.alive === false) {
        return;
      }

      // Jump the bird!
      this.jumpSound.play();
      this.bird.body.velocity.y = -350;

      // When the bird jumps, add an animation to rotate it.
      var animation = game.add.tween(this.bird);
      game.add.tween(this.bird).to({angle: -20}, 100).start();
    },

    hitPipe: function() {
      // Don't bother checking hit pipe if the bird is already dead.
      if (this.bird.alive === false) {
        return;
      }

      this.bird.alive = false;

      // Remove the timer to stop creating more pipes.
      game.time.events.remove(this.timer);

      // Stop the pipes
      this.pipes.forEach(function(p) {
        p.body.velocity.x = 0;
      }, this);

    },

    die: function() {
      // Bye bye birdy
      this.hitPipe();
      this.endGame();
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

    restartGame: function() {
      this.gameStarted = false;
      game.state.start('main');
    },

    endGame: function() {
      // TODO: FOR YOU!
      // The game is over!!
      // What can you do with this.score?

      // Set the game score
      $('#game-score').text(this.score);

      GAME_SCORE = this.score;
    },
  };

  var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game');

  game.state.add('main', mainState);

  game.state.start('main');
  $(document).ready(function(){
    $('#restart-button').click(function(){
      game.state.states.main.restartGame();
    });
  });
})();
