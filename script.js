$(document).ready(function() {
    //locking the game to 60fps
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60)
};
//Vars
var canvas = document.getElementById("canvas");
var width = 1024;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player = new Player();
var computer = new Computer();
var ball = new Ball(512, 300);
var scorecomputer = 0;
var scoreplayer = 0;
var keysDown = {};
//sounds
var hitsound = new Audio('sound/hit.mp3');
var score = new Audio('sound/score.mp3');
//styling and rendering the stage
var render = function () {
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
    canvas.style.margin = "auto";
};
var update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};
//setting rules for the paddles
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}
//styling the paddles
Paddle.prototype.render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x, this.y, this.width, this.height);
};
//Paddle collision and moving
Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.x < 0) {
        this.x = 0;
        this.x_speed = 0;
    } else if (this.x + this.width > 1024) {
        this.x = 1024 - this.width;
        this.x_speed = 0;
    }
};

function Computer() {
    this.paddle = new Paddle(512, 10, 50, 10);
}

Computer.prototype.render = function () {
    this.paddle.render();
};
//Computer
//The computer has basicly a max speed. if the ball goes faster then the ai it will not exceed the max speed.
Computer.prototype.update = function (ball) {
    var x_pos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
    if (diff < 0 && diff < -4) {
        diff = -7;
    } else if (diff > 0 && diff > 4) {
        diff = 7;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 1024) {
        this.paddle.x = 1024 - this.paddle.width;
    }
};

function Player() {
    this.paddle = new Paddle(512, 580, 50, 10);
}

Player.prototype.render = function () {
    this.paddle.render();
};
// with this we can move the player
Player.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 37) {
            this.paddle.move(-7, 0);
        } else if (value == 39) {
            this.paddle.move(7, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};
//ball and it's speed
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
}
// creating te ball
Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, 7, 2 * Math.PI, false);
    context.fillStyle = "#FFF";
    context.fill();
};
// Ball collision and stuff, and what to do when someone scores
Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if (this.x - 5 < 0) {
        this.x = 5;
        this.x_speed = -this.x_speed;

    } else if (this.x + 5 > 1024) {
        this.x = 1019;
        this.x_speed = -this.x_speed;
    }
    // Score and stage hitbox
    if (this.y < 0) {
        scoreplayer += 1;
        $('#player').text(scoreplayer);
        
    }
    if (this.y > 600) {
        scorecomputer += 1;
        $('#comp').text(scorecomputer);
        
    }
    if (this.y < 0 || this.y > 600) {
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = Math.floor(Math.random()*1019);
        this.y = 100;
    }

    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if (top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

document.body.appendChild(canvas);
animate(step);
//this flushes the array "keysDown" when no key is pressed.
window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

});