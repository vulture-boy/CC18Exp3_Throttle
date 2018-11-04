/* 
Throttle Game
Tyson Moll

Uses JSON protocol, with p5.serialcontrol running & appropriate arduino controller
 */
 
// Control signals
var players = 2; // No. of players participating
var buttonA[players];      //this variable will hold the value from "s1"
var potSwing[players];      //this variable will hold the value from "s2"
var buttonB[players];		// 's3'
var shifterDist[players];	// 's4', in cm (at the moment)

// Serial Communication
var serialPortName[players]; // Name of serial ports, as denoted by p5 serial software
serialPortName[0] = "COM12"; // Controller #1
serialPortName[1] = "COM14"; // Controller #2
// STUB: Auto-detection for controllers
var serial[players];       //variable to hold the serial port object

function preload() {
	/*
	img_go = loadImage('');
	img_count_3 = loadImage('');
	img_count_2 = loadImage('');
	img_count_1 = loadImage('');
	*/
}

function setup() {
  
	var canv = createCanvas(windowWidth,windowHeight);
	canv.position(0,0);
	fr = 30; // Frames per second 
	frameRate(fr); 
	// STUB: adjust according to needs

	//Setting up the serial port
	for (i=0;i<players;i++) {
		serial[i] = new p5.SerialPort();     //create the serial port object
		serial[i].open(serialPortName[i]); //open the serialport. determined 
		serial[i].on('open',ardCon);         //open the socket connection and execute the ardCon callback
		if (i == 0) {
			serial[i].on('data',dataReceivedP1);   //when data is received execute the dataReceived function
		} else if (i == 1) {
			serial[i].on('data',dataReceivedP2);   //when data is received execute the dataReceived function
		}
		
		// STUB: virtually duplicate methods (need a way to determine which serial is used)
	}
	
	game_state = 0; // Active game 'screen'
	
	// GS 2: Countdown
	timeCounter = 0; // Tracks time for state 2
	readyStart = fr * 1 // Time until display messages
	readyEnd = fr * 3; // Time to display 'Ready?' message
	goEnd = fr * 2; // Time to display 'GO!!'
	
}

function draw() {
	
	// STUB: replace example code
	
	// Game State: Start Screen, Transition to Game, 3 to GO, Game, Finish, Results, Start Screen
	
	if (game_state == 0) {
		// STUB: Title
	} else if (game_state == 1) {
		// STUB: Transition to start
	} else if (game_state == 2) {
		// STUB: 3 / 2/ 1 / GO
		textAlign(CENTER);
		
		if (counter >= readyStart && counter < readyStart + readyEnd) {
			text('READY?',windowWidth/2,windowHeight/8);
		
		counter++;
	} else if (game_state == 3) {
		// STUB: GAME 
	} else if (game_state == 4) {
		// STUB: Results 
	}
	
	// Setup
		// PRELOAD: import images
		// Carts
		// Character (2)
			// Revving
			// Driving (3 positions)
			// Throwing (3)
			// Overheat / Hit (3)
			// Victory (on podium)
		// Signs
			// 3 / 2 / 1 / GO!
			// MISS (throw)
			// Finish
			// Title
		// Misc
			// Confetti
			// Podium
			// Throttle / Speed / Item slot / Needle
			// Finish line
			// Obstacle
			// Items
			// Terrain
			// Speed Lines?
			// Smoke
			// Thrown items
			
		// Sounds
			// BGM (title, gameplay, results)
			// finish sound
			// Revving
			// bleeps for light
			// item get
			// item toss 
			// guy hit
			// smoking 
			// overheat warning
			// overheat hit 
	
	// Start Screen
		// Title Bobble
		// Press Start
		// Trigger Start when both players press a button
		// Could have game running in the background: show drivers ready to go disregarding trottle state
		
	// Transition
		// Effect: 
			// Blow up Title?
			// (temp: disappear)
		// Draw race line, throttle meters, item slot
		// Pull down 3/2/1/GO counter
		
	// 3 to GO
		// 3/2/1/GO!
		// rev sounds active now!
	
	// Game
		// Blink GO! sign multiple times before making it disappear (on off on off on off gone)
		// Go at speed of throttle.
		// Speed: easing!!
			// Throttle position * speed factor = target speed
			// Acceleration factor: current += delta(target, current) * accel
			// Overheat: directly correlated to throttle position: if above threshold, increase * delta(position, threshold)
				// Decrease overheat based on same delta.
			// Visual display... animated lines, background colour, fading? cart bobbing speed.
			// Track current distance vs target distance on display down middle
		// Overheat based on speed (only increases after midspeed)
			// Stop item / obstacle spawn (& ignore them)
			// If overheat target met, blink overheat, have decrease slowly to zero (slow to stop twice as fast)
			// Once clear, accelerate again!
		// tilt left or right to avoid obstacle, grab item (based on thresholds)
			// hitbox region moves with tilt for 3 different positions
		// Item / Obstacles grow and follow path, bob up and down slightly, disappear at certain y val, caught in certain y threshold. 
			// Just random spawn to keep it simple, maybe spawn faster if moving faster.
			// three lanes
		// Obstacle: cuts speed down
		// Tossing: must be at similar speed or MISS (with "MISS" sign)
		// Item: Nitro
			// USE: Increase speed temporarially
			// THROW: Increase overheat
		// Item: Cooler
			// USE: Decrease overheat
			// Throw: Decrease speed
		// Item: Shield
			// USE: Prevent damage from one obstacle
			// THROW: Temp blindness
		
	// Finish
		// Part of Game, display FINISH when passing through, have player shrink away to item spawn position and disappear.
		// After a certain amount of time, move to results
		
	// Results
		// Confetti (just flip a few drawings back and forth, generate from top)
		// First and second place on stands
		// After certain amount of time, reset game
	
	
	
	// Cycle through players
	for (i=0; i<players;i++) {
		background(255);
		stroke(0);

		if(buttonA[i]==0) {
			fill(255,0,0);
		} else {
			fill(0,255,0);
		}

		strokeWeight(map(potSwing,0,1023,0.01,5));
		ellipse(width/3 * (i+1),height/2,map(potSwing[i],0,1023,20,width),map(potSwing[i],0,1023,20,height)); //apply the sensor value to the radius of the ellipse
	}
  
}


function dataReceivedP1() {  //this function is called every time data is received
  
	var rawData = serial.readStringUntil('\r\n'); //read the incoming string until it sees a newline
    console.log(rawData);    	//uncomment this line to see the incoming string in the console     
    
	if(rawData.length>1)                      //check that there is something in the string
    {                   
		// Read information 
		buttonA[0] = JSON.parse(rawData).s1;       //the parameter value .s1 must match the parameter name created within the arduino file
		potSwing[0] = JSON.parse(rawData).s2; 
		buttonB[0] = JSON.parse(rawData).s3; 
		shifterDist[0] = JSON.parse(rawData).s4;
		
		// STUB: Array support for JSON properties?
	}
}

function dataReceivedP2() {  //this function is called every time data is received
  
	var rawData = serial.readStringUntil('\r\n'); //read the incoming string until it sees a newline
    console.log(rawData);    	//uncomment this line to see the incoming string in the console     
    
	if(rawData.length>1)                      //check that there is something in the string
    {                   
		// Read information 
		buttonA[1] = JSON.parse(rawData).s1;       //the parameter value .s1 must match the parameter name created within the arduino file
		potSwing[1] = JSON.parse(rawData).s2; 
		buttonB[1] = JSON.parse(rawData).s3; 
		shifterDist[1] = JSON.parse(rawData).s4;
		
		// STUB: Array support for JSON properties?
	}
}

function ardCon() {
	
	// STUB: Connected message
	console.log("connected to the arduino!! Listen UP");
}

function windowResized() { // Triggered when window is resized
	resizeCanvas(windowWidth,windowHeight);
}

