let glass;
let img;
let proceed = false;
let pause = 0;
let count = 0;
let particles = [];

function setup() {
    // Create the canvas
    let myCanvas = new Canvas(400, 400);
    myCanvas.parent("canvas");

    let centerX = width/2;
    let centerY = height/2;

    // Physics setup
    world.gravity.y = 10;

    // Glass (rigid body) shape, color, and border
    glass = new Sprite(centerX, centerY, [200, 93, 30, 80, 60, 10, 30, 10, 200, 72], 'kinematic');
    glass.color = 'rgb(55,54,54)';
    glass.strokeWeight = 0;

    // Glass image
    img = loadImage('https://reebo.it/explorative/glass_1_50.png');
}

function draw() {
    // Loop
    clear();
    background('rgba(255,255,255, 0)');
    image(img, width/2 - 135, 40);
}

// When a country is clicked, the glass fades in
function fadeIn(element, duration) {
    let opacity = 0;
    const interval = 10; // Interval in milliseconds
    const delta = 1 / (duration / interval);

    const timer = setInterval(() => {
        opacity += delta;
        element.style.opacity = opacity;

        if (opacity >= 1) {
            clearInterval(timer);
        }
    }, interval);
}

let last_animation_interval;

const targetElement = document.getElementById('value'); //time required to fill the glass

targetElement.addEventListener('click', () => {
    // When a country is clicked, we remove all the existing particles
    for(let i = 0; i < particles.length; i++){
        particles[i].remove();
    }
    // And we stop the js interval function
    if (last_animation_interval) {
        clearInterval(last_animation_interval);
    }
    // Initialize the droplets as an empty list
    particles = [];
    // Initially, we have 0 droplets
    count = 0;
    // Let the canvas fade in
    const canvas = document.getElementById('canvas');
    fadeIn(canvas, 50);
    // Compute how many seconds the animation is going to last
    const seconds = Math.exp((float)(document.getElementById("value").innerText));
    console.log(seconds + " seconds");
    // The single droplet size. The initial numbers were hardcoded for 6x6 droplets.
    let droplet_size = 6;
    const droplet_size_multiplier = 2;
    droplet_size *= droplet_size_multiplier;
    // The glass is full when we have 950 droplets (6x6 droplets. If they are bigger / smaller, adjust the exponent-coefficient - as the relationship is not linear due to stochasticity)
    const n_droplets_glass_full = 950 / (droplet_size_multiplier ** 2.25);
    // We are dropping 10 droplets per time
    const droplets_per_time = 10;
    // Meaning that it will take 95 falls
    const n_of_falls = n_droplets_glass_full / droplets_per_time
    // The following is the interval of time between one fall and the next one, in milliseconds
    pause = (Math.exp((float)(document.getElementById("value").innerText)) / n_of_falls) * 1000;
    // "proceed" is the flag that tells whether the droplets can fall
    proceed = true;
    // The animation starts
    last_animation_interval = setInterval(
        () => {
            if (proceed) {
                for(let i = 0; i < droplets_per_time; i++){
                    // We create the droplet
                    let droplet = new Sprite(
                        width/2 + random(-droplet_size, droplet_size),
                        random(-droplet_size, droplet_size),
                        droplet_size
                    );
                    // And add it to the list of particles
                    particles.push(droplet);
                    // Physics and style setup
                    droplet.friction = 0.02; 
                    const red = 75 + Math.floor(Math.random() * 31) - 15;
                    const green = 100 + Math.floor(Math.random() * 31) - 15;
                    const blue = Math.min(255, 255 + Math.floor(Math.random() * 21) - 10);
                    const alpha = 0.5 + Math.floor(Math.random() * 0.4) - 0.2;
                    droplet.color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
                    droplet.strokeWeight = 0;
                }
                // Update the count
                count += droplets_per_time;
                console.log(count)
                // If the glass is full, we stop the falls
                if(count >= n_droplets_glass_full){
                    proceed=false;
                }
            }
        }, pause
    );
});