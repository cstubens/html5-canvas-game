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
    
    // Square
    var square = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        // xdir: 0,
        // ydir: 0,
        //speed: 0,
        color: "#ff8080",
        xSpeed: 0,
        ySpeed: 0,
        randomize: function() {
            // I am speed.
            this.xSpeed = ((Math.random() - 0.5) * 2) * 10000;
            this.ySpeed = ((Math.random() - 0.5) * 2) * 100;
            console.log(this.xSpeed, this.ySpeed)
            
            // Give the this a random position
            this.x = Math.floor(Math.random()*(level.x+level.width-this.width));
            this.y = Math.floor(Math.random()*(level.y+level.height-this.height));
        },
        shrinking: function() {
            this.width = this.width * .95;
            this.height = this.height * .95;
        },
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
        
        // Initialize the square
        square.width = 100;
        square.height = 100;
        square.randomize();
        
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
        
        // Move the square, time-based
        square.ySpeed += gravity;
        square.x += dt * square.xSpeed;
        square.y += dt * square.ySpeed;
        
        // Handle left and right collisions with the level
        if (square.x <= level.x) {
            // Left edge
            square.x = level.x;
            square.xSpeed = -square.xSpeed * bouncybouncespeedslowdown;
        } else if (square.x + square.width >= level.x + level.width) {
            // Right edge
            square.xSpeed = -square.xSpeed * bouncybouncespeedslowdown;
            square.x = level.x + level.width - square.width;
        }
        
        // Handle top and bottom collisions with the level
        if (square.y <= level.y) {
            // Top edge
            square.y = level.y;
            square.ySpeed = -square.ySpeed * bouncybouncespeedslowdown;
        } else if (square.y + square.height >= level.y + level.height) {
            // Bottom edge
            square.ySpeed = -square.ySpeed * bouncybouncespeedslowdown;
            square.y = level.y + level.height - square.height;
            square.xSpeed = square.xSpeed * .99;
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
        
        // Draw the square
        context.fillStyle = square.color;
        context.fillRect(square.x, square.y, square.width, square.height);
        
        // Draw score inside the square
        context.fillStyle = "#ffffff";
        context.font = `${square.height/2}px Verdana`;
        var textdim = context.measureText(score);
        context.fillText(
            score, 
            square.x+(square.width-textdim.width)/2, 
            square.y+(square.height) * .65
        );
        //context.fillText(score, square.x, square.y+65);

        context.fillStyle = "#000000";
        context.font = "12px Verdana";
        context.fillText(` ${Math.round(square.x)}, ${Math.round(square.y)}`, square.x, square.y-1);
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
        if (isInSquare(pos, square)) {

            // Increase the score
            score += 1;
            
            // Randomized speed
            square.randomize();

            // Shrinking box size
            square.shrinking();
        }
    }
    
    function onMouseUp(e) {
        square.color = "#ff0000"
    }
    function onMouseOut(e) {
        square.color = "#cecece";
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
    
    // Call init to start the game
    init();
};
