/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#include "application.h"
#line 1 "d:/Documents/IOT/AppEngineAssignmentLubDubPart2/src/AppEngineAssignmentLubDubPart2.ino"
/*
 * Project AppEngineAssignmentLubDubPart2
 * Description: This is a Programing Assignment to show the reading of 
 * heart rate or beats per minute (BPM) using
  a Penpheral Beat Amplitude (PBA) algorithm.
 * Author: Prajakt Uttamrao Khawase.
 * Date: 11/14/2019
 */

#include <Wire.h>
#include "MAX30105.h"

#include "heartRate.h"

void setup();
void loop();
void buttonCheck();
#line 15 "d:/Documents/IOT/AppEngineAssignmentLubDubPart2/src/AppEngineAssignmentLubDubPart2.ino"
MAX30105 particleSensor;

const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0;   //Time at which the last beat occurred
int switchy = A0;   // Connect the switch on pin A0.
int waitForSomeTime = 1000;
float beatsPerMinute;
int beatAvg;

void setup()
{
  Serial.begin(115200);
  Serial.println("Initializing...");
  pinMode(switchy,INPUT_PULLUP);
  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }
  Serial.println("Place your index finger on the sensor with steady pressure.");

  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
}

void loop()
{
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte x = 0 ; x < RATE_SIZE ; x++)
        beatAvg += rates[x];
      beatAvg /= RATE_SIZE;
    }
  }

  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);

  if (irValue < 50000)
    Serial.print(" No finger?");

  Serial.println();

   buttonCheck();
}

void buttonCheck()
{
  if (digitalRead(switchy) == LOW)
  {
    Serial.println("Record data");
    String sendData = String::format("%.2f", beatsPerMinute);
    Particle.publish("Display_HeartRate", sendData , PRIVATE); // Publisshed event 
    delay(waitForSomeTime);
  }
}