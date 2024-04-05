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