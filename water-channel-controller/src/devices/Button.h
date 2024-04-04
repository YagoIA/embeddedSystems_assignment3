#ifndef __BUTTON__
#define __BUTTON__

class Button {
 
public: 
  Button(int pin);
  bool isPressed();
  bool isClicked();

  void sync();

private:
  int pin;
  bool pressed;
  bool clicked;
};

#endif
