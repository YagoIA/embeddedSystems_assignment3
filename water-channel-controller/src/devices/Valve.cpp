#include "Valve.h"
#include <Arduino.h>

void Valve::attachPin(int pin) {
  this->valve.attach(pin);
}

Valve::Valve(/* args */)
{
}

Valve::~Valve()
{
}

void Valve::setToPercentage(int percentage){
	int readPos = valve.read();
	
	int targetPos = map(percentage, 0, 100, 400, 2400);
	if(targetPos > readPos){
		for (int pos = readPos; pos <= targetPos; pos += 32) {
			this->valve.write(pos);
			delay(10);
    	}
	} else {
		for (int pos = readPos; pos >= targetPos; pos -= 32) {
			this->valve.write(pos);
			delay(10);
    	}
	}
}