#include "../kernel/Task.h"
#include "../model/WaterChannelController.h"

class ReadData : public Task
{
private:
	const byte DATA_MAX_SIZE = 32;
	char data[32];   // an array to store the received data
	WaterChannelController* waterChannelController;
public:
	ReadData(WaterChannelController* waterChannelController);
	~ReadData();
	void init(int period);  
  	void tick();
	void receiveData();
};

