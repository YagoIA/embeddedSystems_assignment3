#include "../kernel/Task.h"



class SwitchState : public Task
{
private:
	/* data */
public:
	SwitchState(/* args */);
	~SwitchState();
	void init(int period);  
  	void tick();
};
