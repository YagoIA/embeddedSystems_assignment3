#include "../kernel/Task.h"
#include "../model/WaterChannelController.h"

class ReadData : public Task
{
private:
	WaterChannelController* waterChannelController;
public:
	ReadData(WaterChannelController* waterChannelController);
	~ReadData();
	void init(int period);  
  	void tick();
};

