#include "SwitchState.h"
#include <Arduino.h>

SwitchState::SwitchState(WaterChannelController* waterChannelController) {
    this->waterChannelController = waterChannelController;
}

SwitchState::~SwitchState()
{
}

void SwitchState::init(int period){
    Task::init(period);
}

void SwitchState::tick(){
    //this->waterChannelController->button->sync();
    //Serial.println("ss");
    this->waterChannelController->button->sync();
    if(this->waterChannelController->button->isClicked()){
        
        if(this->waterChannelController->state == WaterChannelController::State::MANUAL) {
            this->waterChannelController->state = WaterChannelController::State::AUTOMATIC;
        } else {
            this->waterChannelController->state = WaterChannelController::State::MANUAL;
        }
    }
}