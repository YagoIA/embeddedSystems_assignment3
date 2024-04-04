#ifndef __WATERCHANNELCONTROLLER__
#define __WATERCHANNELCONTROLLER__

#include <LiquidCrystal_I2C.h>
#include "../devices/Button.h"

class WaterChannelController
{
	private:
		/* data */
	public:
		LiquidCrystal_I2C* lcd;

		Button* button;

		// Between 0.0 and 1.0
		double valveOpeningLevel;

		enum State { 
			AUTOMATIC, 
			MANUAL
		} state;


		WaterChannelController(/* args */);
		~WaterChannelController();
};
#endif __WATERCHANNELCONTROLLER__