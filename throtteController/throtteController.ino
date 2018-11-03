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

unsigned long lastSend;
int sendRate = 50;
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

  // 
 
if(millis()-lastSend>=sendRate)                           //use a timer to stablize the data send
  {
  ////////////////////////////////////////////////////////////send the values to P5 over serial
    DynamicJsonBuffer messageBuffer(200);                   //create the Buffer for the JSON object        
    JsonObject& p5Send = messageBuffer.createObject();      //create a JsonObject variable in that buffer       
    
    p5Send["s1"]=buttonAValue;                               //assign buttonValue to the key "s1" in the json object
    p5Send["s2"]=anaValue;                                  //assign anaValue to the key "s2" in the json object 
    p5Send["s3"]=buttonBValue;
    p5Send["s4"]=distance;
    p5Send.printTo(Serial);                                 //print JSON object as a string
    Serial.println();                                       //print a \n character to the serial port to distinguish between objects
  
  lastSend = millis();
  }  

}

/* NEEDS TO BE CONVERTED TO A MILLIS-FRIENDLY DESIGN (Stored Variables, no delays)
void loop() {
  // The sensor is triggered by a HIGH pulse of 10 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
 
  // Read the signal from the sensor: a HIGH pulse whose
  // duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);
 
  // Convert the time into a distance
  cm = (duration/2) / 29.1;     // Divide by 29.1 or multiply by 0.0343
  inches = (duration/2) / 74;   // Divide by 74 or multiply by 0.0135
  
  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();
  
  delay(250);
}
