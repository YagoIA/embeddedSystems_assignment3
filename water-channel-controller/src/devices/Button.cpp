#include "Button.h"
#include "Arduino.h"

Button::Button(int pin){
  this->pin = pin;
  pinMode(pin, INPUT);  
  sync();   
} 
  
bool Button::isPressed(){
  return pressed;
}

bool Button::isClicked(){
  return clicked;
}

void Button::sync(){
  bool wasPressed = pressed;
  pressed = digitalRead(pin) == HIGH;
  if (!pressed){
    if (wasPressed){
      clicked = true;
    } else {
      if (clicked){
        clicked = false;
      }
    }
  } else if (pressed){
    clicked = false;
  }
  //updateSyncTime(millis());
}
