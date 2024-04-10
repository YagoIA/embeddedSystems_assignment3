#include "../kernel/Task.h"
#include "../model/WaterChannelController.h"

class ReadData : public Task
{
private:
	const byte DATA_MAX_SIZE = 16;
	char data[16];   // an array to store the received data
	WaterChannelController* waterChannelController;
public:
	ReadData(WaterChannelController* waterChannelController);
	~ReadData();
	void init(int period);  
  	void tick();
	bool receiveData();
};

