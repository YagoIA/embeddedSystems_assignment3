#include "ReadData.h"
#include <Arduino.h>

ReadData::ReadData(WaterChannelController* waterChannelController)
{
	this->waterChannelController = waterChannelController;
}

ReadData::~ReadData()
{
}

void ReadData::init(int period){
	Task::init(period);
}

void ReadData::tick(){
	if(this->waterChannelController->state == WaterChannelController::State::AUTOMATIC){
		  if(Serial.available() > 0)  {
			receiveData();
			String str = (char*)data;
			int serialPercentage = str.toInt();
			if(serialPercentage >= 0 && serialPercentage <= 100){
				this->waterChannelController->valveOpeningLevel = serialPercentage;
			}
		  }
	} else {
		int potValue = analogRead(A0);
		double percentage = map(potValue, 60, 963, 0, 100);
		if(percentage > 100){
			percentage = 100;
		} else if(percentage < 0){
			percentage = 0;
		}
		this->waterChannelController->valveOpeningLevel = percentage;
		
	}
	this->waterChannelController->valve->setToPercentage(waterChannelController->valveOpeningLevel);
}

void ReadData::receiveData() {
	static char endMarker = '\n'; // message separator
	char receivedChar;     // read char from serial port
	int ndx = 0;          // current index of data buffer  // clean data buffer
	memset(data, 32, sizeof(data));  // read while we have data available and we are
	// still receiving the same message.
	while(Serial.available() > 0) {    receivedChar = Serial.read();    if (receivedChar == endMarker) {
		data[ndx] = '\0'; // end current message
		return;
		}    // looks like a valid message char, so append it and
		// increment our index
		data[ndx] = receivedChar;
		ndx++;   
		if (ndx >= DATA_MAX_SIZE) {
		break;
		}
	}  // no more available bytes to read from serial and we
	// did not receive the separato. it's an incomplete message!
	Serial.println("error: incomplete message");
	//Serial.println(data);
	memset(data, 32, sizeof(data));
}