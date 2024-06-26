#include "../kernel/Task.h"
#include "../model/WaterChannelController.h"

class SwitchState : public Task
{
private:
	WaterChannelController* waterChannelController;
public:
	SwitchState(WaterChannelController* waterChannelController);
	~SwitchState();
	void init(int period);  
  	void tick();
};
