// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


function GameObject(imageName){
	this.image = new Image();
	this.image.src = "images/" + imageName + ".png";
	this.x = 0;
	this.y = 0;

}
var HeroSingleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Hero("hero");
        return object;
    }

 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            console.log(instance);
            return instance;
        }
    };
})();
 


function Hero (imageName) {
	GameObject.call(this, imageName);
	this.score = 0;
	this.speed = 256;
	this.x = canvas.width / 2;
	this.y = canvas.height / 2;
	this.reset = function() {
		this.x = canvas.width / 2;
		this.y = canvas.height / 2;
	};
}
Hero.prototype = GameObject;

function Beer (imageName){
	GameObject.call(this, imageName);
	this.isHealthy = true;
	this.reset = function () {
		this.x = 32 + (Math.random() * (canvas.width - 64));
		this.y = 32 + (Math.random() * (canvas.width - 64));
	};
	this.render = function() {
		ctx.drawImage(this.image, this.x, this.y);
	}
}
Beer.prototype = GameObject;

function Monster (imageName){
	GameObject.call(this, imageName);
	this.isHealthy = false;
	this.reset = function () {
		this.x = 32 + (Math.random() * (canvas.width - 64));
		this.y = 32 + (Math.random() * (canvas.width - 64));
	};
	this.render = function() {
		ctx.drawImage(this.image, this.x, this.y);
	}
}
Monster.prototype = GameObject;


// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function (moveHero, objects) {
	if(moveHero){
		hero.reset();
	}

	// Throw the gameObject somewhere on the screen randomly
	for (var i = objects.length - 1; i >= 0; i--) {
		objects[i].reset();
	};

};

// Update game objects
var update = function (modifier, objects) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	for (var i = objects.length - 1; i >= 0; i--) {
		if (
		hero.x <= (objects[i].x + 32)
		&& objects[i].x <= (hero.x + 32)
		&& hero.y <= (objects[i].y + 32)
		&& objects[i].y <= (hero.y + 32)
		) {
			if(objects[i].isHealthy){
				++hero.score;
				reset(false, objects);
			}
			else
			{
				hero.score = 0;
				reset(true, objects);
			}
			break;
		}
	};


};

// Draw everything
var render = function (objects) {

	ctx.drawImage(bgImage.image, 0, 0);
	ctx.drawImage(hero.image, hero.x, hero.y);

	for (var i = objects.length - 1; i >= 0; i--) {
		objects[i].render();
	};

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + hero.score, 32, 32);
};

// The main game loop
var main = function () {

	var now = Date.now();
	var delta = now - then;

	update(delta / 1000, objects);
	render(objects);

	refresh -= 200;
	if(refresh == 0)
	{
		refresh = 10000;
		reset(false, objects);
	}
	then = now;
	requestAnimationFrame(main);
	
	// Request to do this again ASAP
	
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!


var beer = new Beer('beer');
var monster = new Monster('monster');
var hero = HeroSingleton.getInstance();
var bgImage = new GameObject('background');
var objects = [monster,beer];
var refresh = 10000;
var then = Date.now();



reset(true, objects);
main();