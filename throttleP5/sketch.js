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

function setup() {
  
	createCanvas(500,500);
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
}

function draw() {
	
	// STUB: replace example code
	
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


