// ------------------------------------------------------------
// How To Make A HTML5 Canvas Game
// (c) 2015 Rembound.com
// http://rembound.com/articles/how-to-make-a-html5-canvas-game
// ------------------------------------------------------------

// window.onload gets called when the window is fully loaded
window.onload = function() {
    var canvas = document.getElementById("viewport"); 
    var game = new Game(canvas, 5);
    function main(tframe) {
        game.update(tframe);
        game.render();
        window.requestAnimationFrame(main); // Request the _next_ frame to run
    }
    main(0) // Run the first frame
}

class Game {
    constructor(canvas, n) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.frame = new Frame(this.canvas, this.context)
        this.level = {
            x: 1,
            y: 65,
            width: canvas.width - 2,
            height: canvas.height - 66
        };

        // Timing and FPS
        this.lastframe = 0;
        this.fpstime = 0;
        this.framecount = 0;
        this.fps = 0;

        // constants
        this.gravity = 9.8;
        this.bouncybouncespeedslowdown = 0.95;

        // Game state
        var score = 0;
        this.cubes = new Array()
        for (var i = 0; i < n; i++) {
            this.cubes.push(new Square(this.level));
        }

        // set up mouse event listeners
        canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        canvas.addEventListener("mouseup",   (e) => this.onMouseUp(e));
        canvas.addEventListener("mouseout",  (e) => this.onMouseOut(e));
    }

    update(tframe) {
        // Update FPS
        var dt = (tframe - this.lastframe) / 1000;
        this.lastframe = tframe;
        this.updateFps(dt);

        // Update game world
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].update(dt, this);
        }
    }

    render() {
        // Render the Frame (header, boarder, etc)
        this.frame.render(this.fps);

        // Render the cubes
        for (var i = 0; i < this.cubes.length; i++) {
            this.cubes[i].render(this.context)
        }
    }

    updateFps(dt) {
        if (this.fpstime > 0.25) {
            // Calculate fps
            this.fps = Math.round(this.framecount / this.fpstime);
            
            // Reset time and framecount
            this.fpstime = 0;
            this.framecount = 0;
        }
        
        // Increase time and framecount
        this.fpstime += dt;
        this.framecount++;
    }

    onMouseMove(e) {}

    onMouseDown(e) {
        var pos = getMousePos(this.canvas, e); // Get the mouse position
        for (var i = 0; i < this.cubes.length; i++) {
            if (isInSquare(pos, this.cubes[i])) {
                this.cubes[i].click();
            }
        }
    }

    onMouseUp(e) {
        // square.color = "#ff0000"
    }

    onMouseOut(e) {
        // square.color = "#cecece";
    }

}

class Frame {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;

    }

    render(fps) {
        // Draw background and a border
        this.context.fillStyle = "#d0d0d0";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#e8eaec";
        this.context.fillRect(1, 1, this.canvas.width-2, this.canvas.height-2);
        
        // Draw header
        this.context.fillStyle = "#303030";
        this.context.fillRect(0, 0, this.canvas.width, 65);
        
        // Draw title
        this.context.fillStyle = "#ffffff";
        this.context.font = "24px Verdana";
        this.context.fillText("Haha bouncy box go brrrr", 10, 30);
        
        // Display fps
        this.context.fillStyle = "#ffffff";
        this.context.font = "12px Verdana";
        this.context.fillText("Fps: " + fps, 13, 50);
    }
}

class Square {
    constructor(level) {
        this.x = 0;
        this.y = 0;
        this.width = 80;
        this.height = 80;
        this.randomize(level);
        this.color = getRandomColor();
        this.score = 0;
    }

    randomize(level) {
        // Give the this a random position
        this.x = Math.floor(Math.random()*(level.x+level.width-this.width));
        this.y = Math.floor(Math.random()*(level.y+level.height-this.height));

        // I am speed.
        this.xSpeed = ((Math.random() - 0.5) * 2) * 600;
        this.ySpeed = ((Math.random() - 0.5) * 2) * 400;
    }

    click() {
        this.score += 1;
        this.randomize(this.level);
        this.shrink();
    }

    shrink() {
        this.width = this.width * .95;
        this.height = this.height * .95;
    }

    update(dt, game) {
        // Move the square, time-based
        this.ySpeed += game.gravity;
        this.x += dt * this.xSpeed;
        this.y += dt * this.ySpeed;
        
        // Handle left and right collisions with the level
        if (this.x <= game.level.x) {
            // Left edge
            this.x = game.level.x;
            this.xSpeed = -this.xSpeed * game.bouncybouncespeedslowdown;
        } else if (this.x + this.width >= game.level.x + game.level.width) {
            // Right edge
            this.xSpeed = -this.xSpeed * game.bouncybouncespeedslowdown;
            this.x = game.level.x + game.level.width - this.width;
        }

        // Handle top and bottom collisions with the level
        if (this.y <= game.level.y) {
            // Top edge
            this.y = game.level.y;
            this.ySpeed = -this.ySpeed * game.bouncybouncespeedslowdown;
        } else if (this.y + this.height >= game.level.y + game.level.height) {
            // Bottom edge
            this.ySpeed = -this.ySpeed * game.bouncybouncespeedslowdown;
            this.y = game.level.y + game.level.height - this.height;
            this.xSpeed *= 0.99;
        }
    }

    render(context) {
        // Draw the square
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);

        // Draw score inside the this
        context.fillStyle = "#ffffff";
        context.font = `${this.height/2}px Verdana`;
        var textdim = context.measureText(this.score);
        context.fillText(
            this.score, 
            this.x+(this.width-textdim.width)/2, 
            this.y+(this.height) * .65
        );

        // draw square coordinates and speed
        context.fillStyle = "#000000";
        context.font = "12px Verdana";
        context.fillText(`${Math.round(this.x)}, ${Math.round(this.y)}`, this.x, this.y-11);
        context.fillStyle = "#666666";
        context.fillText(`${Math.round(this.xSpeed)}, ${Math.round(this.ySpeed)}`, this.x, this.y-1);
    }
}

//
// Helper functions
//

// Check if a position `pos` is inside a square
function isInSquare(pos, square) {
    if (pos.x >= square.x && pos.x < square.x + square.width &&
        pos.y >= square.y && pos.y < square.y + square.height) {
            return true;
    }
}

// Get the mouse position
function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round((e.clientX - rect.left)/(rect.right - rect.left)*canvas.width),
        y: Math.round((e.clientY - rect.top)/(rect.bottom - rect.top)*canvas.height)
    };
}

//random colours yay
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
