// Get the canvas element
let canvas = document.getElementById('life');

// Get the 2D rendering context for the canvas
let m = canvas.getContext('2d');

/**
 * resizeCanvas: Resizes the canvas to fit the window
 * No parameters
 * No return value
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Call the resizeCanvas function to initially set the canvas size
resizeCanvas();

// Add event listeners to resize the canvas when the window loads or is resized
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

/**
 * drawParticles: Draws a particle on the canvas
 * @param {number} posX - The x position of the particle
 * @param {number} posY - The y position of the particle
 * @param {string} colour - The color of the particle
 * @param {number} size - The size of the particle
 * No return value
 */
drawParticles = (posX, posY, colour, size) => {
    m.beginPath();
    m.arc(posX, posY, size/2, 0, Math.PI * 2, false);
    m.fillStyle = colour;
    m.fill();
}

// Array to hold all particles
particles = [];

/**
 * particle: Creates a particle object
 * @param {number} posX - The x position of the particle
 * @param {number} posY - The y position of the particle
 * @param {string} colour - The color of the particle
 * @returns {object} - The created particle object
 */
particle = (posX, posY, colour, mass) => {
    return {
        "posX": posX,
        "posY": posY,
        "velocityX": 0,
        "velocityY": 0,
        "colour": colour,
        "mass": mass
    }
}

/**
 * randomPositionX: Generates a random x position within the canvas
 * No parameters
 * @returns {number} - A random x position
 */
randomPositionX = () => {
    return Math.random() * canvas.width;
}

/**
 * randomPositionY: Generates a random y position within the canvas
 * No parameters
 * @returns {number} - A random y position
 */
randomPositionY = () => {
    return Math.random() * canvas.height;
}

/**
 * createParticles: Creates a group of particles with the same color
 * @param {number} number - The number of particles to create
 * @param {string} colour - The color of the particles
 * @returns {array} - The created group of particles
 */
createParticles = (number, colour) => {
    group = [];
    for (i = 0; i < number; i++) {
        group.push(particle(randomPositionX(), randomPositionY(), colour, 1));
        particles.push(group[i]);
    }
    return group;
}

/**
 * rules: Updates the velocity and position of each particle based on the interaction with other particles
 * @param {array} particleType1 - The first group of particles
 * @param {array} particleType2 - The second group of particles
 * @param {number} particleInteraction - The interaction force between the particles
 * No return value
 */
rules = (particleType1, particleType2, particleInteraction) => {
    // Loop over each particle in the first group
    for (let a of particleType1) {
        // Loop over each particle in the second group
        for (let b of particleType2) {
            // Make sure we're not comparing a particle with itself
            if (a !== b) {
                // Calculate the x and y distance between the two particles
                let distanceX = a.posX - b.posX;
                let distanceY = a.posY - b.posY;

                // Calculate the absolute distance between the two particles
                let absDistance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

                // Set the interaction force
                let g = particleInteraction;

                // Only apply the force if the particles are within a certain distance of each other
                if (absDistance > 0 && absDistance < ((Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2)))*80/500)) {
                    // Calculate the force between the two particles
                    let curForce = g * a.mass * b.mass / absDistance;

                    // Calculate the x and y components of the force
                    let forceX = 0;
                    let forceY = 0;
                    forceX += curForce * distanceX;
                    forceY += curForce * distanceY;

                    // Update the velocity of the particle based on the force
                    a.velocityX = (a.velocityX + forceX) * 0.5;
                    a.velocityY = (a.velocityY + forceY) * 0.5;

                    // Update the position of the particle based on its velocity
                    a.posX += a.velocityX;
                    a.posY += a.velocityY;

                    // If the particle has moved off the edge of the canvas, reverse its velocity to make it bounce back
                    if (a.posX < 0 || a.posX > canvas.width) {
                        a.velocityX *= -1;
                    }
                    if (a.posY < 0 || a.posY > canvas.height) {
                        a.velocityY *= -1;
                    }
                }
            }
        }
    }
}

// Create groups of particles
red = createParticles(200, "red");
blue = createParticles(200, "blue");
green = createParticles(200, "green");
white = createParticles(200, "white");

/**
 * makeNuclei: Calls the rules function to update the particles (basic nuclei model)
 * No parameters
 * No return value
 */
makeNuclei = () => {
    rules(white, red, -0.1);
    rules(red, red, -0.1);
    rules(red, blue, -0.01);
    rules(blue, red, 0.01);
}

/**
 * makeNuclei2: Calls the rules function to update the particles (life model 1)
 * No parameters
 * No return value
 */
makeNuclei2 = () => {
    rules(white, white, 4);
    rules(blue, blue, 4);
    rules(white, blue, -2);
    rules(blue, white, -2);
    rules(white, green, -3);
    rules(green, green, -1);
    rules(white, red, -1);
    rules(red, red, -0.01);
    rules(red, blue, 0.1);
}

/**
 * makeNucleiAlive: Calls the rules function to update the particles (life model 2)
 * No parameters
 * No return value
 */
makeNucleiAlive = () => {
    rules(white, white, 2);
    rules(blue, blue, 4);
    rules(white, blue, -2);
    rules(blue, white, -5);
    rules(blue, red, -1);
}

/**
 * makeFireFlies: Calls the rules function to update the particles (life model 3)
 * No parameters
 * No return value
 */
makeFireFlies = () => {
    rules(white, white, 0.6);
    rules(white, red, 0.965);
    rules(white, green, -0.565);
    rules(white, blue, 0.375);
    
    rules(red, red, -0.635);
    rules(red, white, -0.31);
    rules(red, green, 0.65);
    rules(red, blue, -0.315);

    rules(green, green, -0.205);
    rules(green, red, 0);
    rules(green, white, -0.445);
    rules(green, white, 0.68);
    
    rules(blue, blue, 1);
    rules(blue, green, -0.495);
    rules(blue, red, 0);
    rules(blue, white, 1);
}

/**
 * updateScreen: Updates the screen by clearing the canvas and drawing all particles
 * No parameters
 * No return value
 */
let lastUpdateTime = 0;
let delay = 1000/60; // delay in milliseconds
updateScreen = (timestamp) => {
    if (!lastUpdateTime || timestamp - lastUpdateTime > delay) {
        lastUpdateTime = timestamp;

        makeNucleiAlive();

        m.clearRect(0, 0, canvas.width, canvas.height);
        m.fillStyle = "Black";
        m.fillRect(0, 0, canvas.width, canvas.height);
        for (i = 0; i < particles.length; i++) {
            drawParticles(particles[i].posX, particles[i].posY, particles[i].colour, 5)
        }
    }

    requestAnimationFrame(updateScreen);
}

// Call the updateScreen function to start the animation
requestAnimationFrame(updateScreen);

// Call the updateScreen function to start the animation
updateScreen();