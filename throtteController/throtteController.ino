/*
 * Throttle Controller
 * by Tyson Moll
 * 
 * References:
 * Ultrasonic Tutorial by Rui Santos, https://randomnerdtutorials.com
 * C&C18 JSON Input Demo by Nick Puckett and Kate Hartman
 */
#include <ArduinoJson.h>

int buttonAPin = 6; // A / Use Button 
int buttonBPin = 7; // B / Throw Button
int analogSwingPin = A1; // Swing Potentiometer
int trigPin = 3;    // Ultrasonic Trigger 
int echoPin = 4;    // Ultrasonic Echo
long duration, cm; // Units for Ultrasonic

unsigned long lastSend, sonicCount;
int sendRate = 50;
int sonicRate = sendRate;
void setup() 

{
  Serial.begin(9600);
  pinMode(buttonAPin,INPUT_PULLUP); // A Button In
  pinMode(buttonBPin,INPUT_PULLUP); // B Button In
  pinMode(trigPin, OUTPUT); // Ultrasonic
  pinMode(echoPin, INPUT);
  pinMode(analogSwingPin, INPUT); // Potentiometer
}

void loop() 

{
  // Read Button Input
  int buttonAValue = digitalRead(buttonAPin);
  int buttonBValue = digitalRead(buttonBPin);

  // Read Potentiometer Input
  int anaValue = analogRead(analogSwingPin);

  if (millis() - sonicCount >= sonicRate) {
    digitalWrite(trigPin, LOW); // LOW clearing ensures clean HIGH pulse
    delayMicroseconds(5); // 0.000005 seconds
    digitalWrite(trigPin, HIGH); // Triggers ultrasonic signal
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
   
    // Read the signal from the sensor: a HIGH pulse whose
    // duration is the time (in microseconds) from the sending
    // of the ping to the reception of its echo off of an object.
    pinMode(echoPin, INPUT);
    duration = pulseIn(echoPin, HIGH);
   
    // Convert the time into a distance
    cm = (duration/2) / 29.1;     // Divide by 29.1 or multiply by 0.0343
    
    Serial.print(cm); // Report unit distance
    Serial.print("cm");
    Serial.println();
    
    sonicCount = millis(); // Refresh
  }

  // use a timer to stablize the data send
  if (millis() - lastSend >= sendRate) {
      //send the values to P5 over serial
      DynamicJsonBuffer messageBuffer(200);                   //create the Buffer for the JSON object        
      JsonObject& p5Send = messageBuffer.createObject();      //create a JsonObject variable in that buffer       

      //assigns variable values to json object keys
      p5Send["s1"]=buttonAValue;  
      p5Send["s2"]=anaValue; 
      p5Send["s3"]=buttonBValue;
      p5Send["s4"]=cm;
      p5Send.printTo(Serial);    //print JSON object as a string
      Serial.println();          //print a \n character to the serial port to distinguish between objects
    
      lastSend = millis(); // Refresh
  }  
}
