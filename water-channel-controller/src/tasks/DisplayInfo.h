#include "../kernel/Task.h"
#include "../model/WaterChannelController.h"

class DisplayInfo : public Task
{
private:
	WaterChannelController* waterChannelController;
public:
	DisplayInfo(WaterChannelController* waterChannelController);
	~DisplayInfo();
	void init(int period);  
  	void tick();
};


