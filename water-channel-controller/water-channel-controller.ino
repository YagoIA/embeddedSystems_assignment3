
#include "src/model/WaterChannelController.h"
#include "src/kernel/Scheduler.h"

WaterChannelController* waterChannelController;
Scheduler sched; 


void setup() {
  sched.init(200);

}
void loop(){
  sched.schedule();
}