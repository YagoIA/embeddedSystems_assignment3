#include "ServoTimer2.h"

class Valve
{
private:
	ServoTimer2 valve;
	/* data */
public:
	virtual void attachPin(int pin);
	void setToPercentage(int percentage);
	void init(int pin);  
	Valve(/* args */);
	~Valve();
};


