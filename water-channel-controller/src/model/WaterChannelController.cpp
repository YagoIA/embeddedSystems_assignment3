#include "WaterChannelController.h"
#include <Arduino.h>

int BUTTON_PIN = 8;
int VALVE_PIN = 3;

WaterChannelController::WaterChannelController(/* args */) {
	state = State::AUTOMATIC;
	valveOpeningLevel = 0;

	valve = new Valve();
    valve->attachPin(VALVE_PIN);

	button = new Button(BUTTON_PIN);

	lcd = new LiquidCrystal_I2C(0x27,20,4);
    lcd->init();
    lcd->setBacklight(HIGH); //Set Back light turn On
    lcd->setCursor(0,0); // Move cursor to 0
}

WaterChannelController::~WaterChannelController()
{
}
