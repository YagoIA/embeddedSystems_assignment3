#ifndef __WATERCHANNELCONTROLLER__
#define __WATERCHANNELCONTROLLER__

#include <LiquidCrystal_I2C.h>
#include "../devices/Button.h"
#include "../devices/Valve.h"

class WaterChannelController
{
	private:
		/* data */
	public:
		LiquidCrystal_I2C* lcd;

		Button* button;
		Valve* valve;

		// Between 0 and 100
		int valveOpeningLevel;

		enum State { 
			AUTOMATIC, 
			MANUAL
		} state;


		WaterChannelController(/* args */);
		~WaterChannelController();
};
#endif __WATERCHANNELCONTROLLER__