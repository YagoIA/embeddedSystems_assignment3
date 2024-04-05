#include "DisplayInfo.h"

DisplayInfo::DisplayInfo(WaterChannelController* waterChannelController) {
    this->waterChannelController = waterChannelController;
}

DisplayInfo::~DisplayInfo()
{
}

void DisplayInfo::init(int period){
	Task::init(period);
}

void DisplayInfo::tick(){
	waterChannelController->lcd->clear();
	waterChannelController->lcd->setCursor(0,0);
	if(waterChannelController->state ==  WaterChannelController::State::AUTOMATIC){
		waterChannelController->lcd->print("Mode: Automatic");
	} else {
		waterChannelController->lcd->print("Mode: Manual");
	}
	waterChannelController->lcd->setCursor(0,1);
	waterChannelController->lcd->print("Valve opening level: ");
	waterChannelController->lcd->setCursor(0,2);
	waterChannelController->lcd->print(waterChannelController->valveOpeningLevel);
	waterChannelController->lcd->print("%");
}