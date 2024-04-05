
#include "src/model/WaterChannelController.h"
#include "src/kernel/Scheduler.h"
#include "src/tasks/SwitchState.h"
#include "src/tasks/DisplayInfo.h"
#include "src/tasks/ReadData.h"

WaterChannelController* waterChannelController;
Scheduler sched; 


void setup() {
  sched.init(50);
  waterChannelController = new WaterChannelController();

  Task* switchState = new SwitchState(waterChannelController);
  switchState->init(50);

  Task* displayInfo = new DisplayInfo(waterChannelController);
  displayInfo->init(1000);

  Task* readData = new ReadData(waterChannelController);
  readData->init(200);

  sched.addTask(switchState);
  sched.addTask(displayInfo);
  sched.addTask(readData);

  Serial.begin(9600);
}
void loop(){
  sched.schedule();
}