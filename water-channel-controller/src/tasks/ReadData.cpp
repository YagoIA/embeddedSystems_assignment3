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
		// serial read
	} else {
		int potValue = analogRead(A0);
		double percentage = map(potValue, 0, 1023, 0, 100);
		Serial.println(percentage);
		this->waterChannelController->valveOpeningLevel = percentage;
	}
}