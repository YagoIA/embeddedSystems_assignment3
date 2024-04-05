#include "../kernel/Task.h"

class ControlValve : public Task
{
private:
	/* data */
public:
	ControlValve(/* args */);
	~ControlValve();
	void init(int period);  
  	void tick();
};

