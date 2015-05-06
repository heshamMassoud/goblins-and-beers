var canvas = document.createElement("canvas"),
ctx = canvas.getContext("2d"),
HeroSingleton = (function () {
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
})(),
keysDown = {},// Handle keyboard controls
// Reset the game when the player catches a monster
reset = function (moveHero, objects) {
	if(moveHero){
		hero.reset();
	}

	// Throw the gameObject somewhere on the screen randomly
	for (var i = objects.length - 1; i >= 0; i--) {
		objects[i].reset();
	};

},
// Draw everything
render = function (objects) {

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
},
// Update game objects
update = function (modifier, objects) {
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


},
// The main game loop
main = function () {

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
	
},
// Cross-browser support for requestAnimationFrame
w = window,
beer = new Beer('beer'),
monster = new Monster('monster'),
hero = HeroSingleton.getInstance(),
bgImage = new GameObject('background'),
objects = [monster,beer],
refresh = 10000,
then = Date.now();




canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


function GameObject(imageName){
	this.image = new Image();
	this.image.src = "images/" + imageName + ".png";
	this.x = 0;
	this.y = 0;

}

 


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


addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);


requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// Let's play this game!
reset(true, objects);
main();