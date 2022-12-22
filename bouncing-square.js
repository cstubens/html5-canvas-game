// ------------------------------------------------------------
// How To Make A HTML5 Canvas Game
// (c) 2015 Rembound.com
// http://rembound.com/articles/how-to-make-a-html5-canvas-game
// ------------------------------------------------------------

// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    // console.log(canvas);
    
    // Timing and frames per second
    var lastframe = 0;
    var fpstime = 0;
    var framecount = 0;
    var fps = 0;
    
    // Level properties
    var level = {
        x: 1,
        y: 65,
        width: canvas.width - 2,
        height: canvas.height - 66
    };
    
    class Square {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.width = 100;
            this.height = 100;
            this.randomize();
            this.color = getRandomColor();
        }

        randomize() {
            // I am speed.
            this.xSpeed = ((Math.random() - 0.5) * 2) * 600;
            this.ySpeed = ((Math.random() - 0.5) * 2) * 1200;
            console.log(this.xSpeed, this.ySpeed)
            
            // Give the this a random position
            this.x = Math.floor(Math.random()*(level.x+level.width-this.width));
            this.y = Math.floor(Math.random()*(level.y+level.height-this.height));
        }

        shrinking() {
            this.width = this.width * .95;
            this.height = this.height * .95;
        }

        update(dt) {
            // Move the square, time-based
            this.ySpeed += gravity;
            this.x += dt * this.xSpeed;
            this.y += dt * this.ySpeed;
            
            // Handle left and right collisions with the level
            if (this.x <= level.x) {
                // Left edge
                this.x = level.x;
                this.xSpeed = -this.xSpeed * bouncybouncespeedslowdown;
            } else if (this.x + this.width >= level.x + level.width) {
                // Right edge
                this.xSpeed = -this.xSpeed * bouncybouncespeedslowdown;
                this.x = level.x + level.width - this.width;
            }
            
            // Handle top and bottom collisions with the level
            if (this.y <= level.y) {
                // Top edge
                this.y = level.y;
                this.ySpeed = -this.ySpeed * bouncybouncespeedslowdown;
            } else if (this.y + this.height >= level.y + level.height) {
                // Bottom edge
                this.ySpeed = -this.ySpeed * bouncybouncespeedslowdown;
                this.y = level.y + level.height - this.height;
                this.xSpeed *= 0.99;
            }
        }
        
        render() {
            // Draw the square
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw score inside the this
            context.fillStyle = "#ffffff";
            context.font = `${this.height/2}px Verdana`;
            var textdim = context.measureText(score);
            context.fillText(
                score, 
                this.x+(this.width-textdim.width)/2, 
                this.y+(this.height) * .65
            );
            //context.fillText(score, this.x, this.y+65);
    
            context.fillStyle = "#000000";
            context.font = "12px Verdana";
            context.fillText(` ${Math.round(this.x)}, ${Math.round(this.y)}`, this.x, this.y-1);
        }
    }

    var cubes = new Array();
    for (var i = 0; i < 5; i++) {
        cubes.push(new Square());
    }

    // Score
    var score = 0;

    // GRAVITY and bouncybouncespeedslowdown
    var gravity = 9.8;
    var bouncybouncespeedslowdown = .95;

    // Initialize the game
    function init() {
        // Add mouse events
        canvas.addEventListener("mousemove", onMouseMove);
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mouseup", onMouseUp);
        canvas.addEventListener("mouseout", onMouseOut);
    
        // Initialize the score
        score = 0;
    
        // Enter main loop
        main(0);
    }
    
    // Main loop
    function main(tframe) {
        // Request animation frames
        window.requestAnimationFrame(main);
        
        // Update and render the game
        update(tframe);
        render();
    }
    
    // Update the game state
    function update(tframe) {
        var dt = (tframe - lastframe) / 1000;
        lastframe = tframe;
        
        // Update the fps counter
        updateFps(dt);
        
        for (var i = 0; i < cubes.length; i++) {
            cubes[i].update(dt);
        }
    }
    
    function updateFps(dt) {
        if (fpstime > 0.25) {
            // Calculate fps
            fps = Math.round(framecount / fpstime);
            
            // Reset time and framecount
            fpstime = 0;
            framecount = 0;
        }
        
        // Increase time and framecount
        fpstime += dt;
        framecount++;
    }
    
    // Render the game
    function render() {
        // Draw the frame
        drawFrame();
        
        for (var i = 0; i < cubes.length; i++) {
            cubes[i].render()
        }
       
    }
    
    // Draw a frame with a border
    function drawFrame() {
        // Draw background and a border
        context.fillStyle = "#d0d0d0";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#e8eaec";
        context.fillRect(1, 1, canvas.width-2, canvas.height-2);
        
        // Draw header
        context.fillStyle = "#303030";
        context.fillRect(0, 0, canvas.width, 65);
        
        // Draw title
        context.fillStyle = "#ffffff";
        context.font = "24px Verdana";
        context.fillText("Haha bouncy box go brrrr", 10, 30);
        
        // Display fps
        context.fillStyle = "#ffffff";
        context.font = "12px Verdana";
        context.fillText("Fps: " + fps, 13, 50);
    }
    
    // Mouse event handlers
    function onMouseMove(e) {}
    
    function onMouseDown(e) {
        // Get the mouse position
        var pos = getMousePos(canvas, e);
        for (var i = 0; i < cubes.length; i++) {
            if (isInSquare(pos, cubes[i])) {
                score += 1;
                cubes[i].randomize();
                cubes[i].shrinking();
            }
        }
    }

    function onMouseUp(e) {
        // square.color = "#ff0000"
    }

    function onMouseOut(e) {
        // square.color = "#cecece";
    }
    
    //
    function isInSquare(pos, square) {
        // Check if we clicked the square
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
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Call init to start the game
    init();
};
