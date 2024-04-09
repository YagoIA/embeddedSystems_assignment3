import { SerialPort, ReadlineParser } from "serialport";
import mqtt from "mqtt";
import { SystemVariables } from "./SystemVariables.js";

//const commPort = "COM7";
const commPort = "/dev/ttyACM0";

var sysVars = new SystemVariables(
  0
)



const protocol = "mqtt";
const host = "broker.emqx.io";
const brokerPort = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${brokerPort}`;

const topic = "emqx/esp32";

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "emqx",
  password: "public",
  reconnectPeriod: 1000,
});

client.on("connect", () => {
  console.log("Connected");

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
    client.publish(
      topic,
      "nodejs mqtt test",
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );
  });
});

client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());

  //TODO on ESP32 side
  if(topic == "water-level"){
    //sysVars.waterLevel = payload.waterLevel
  }


});

process.on('uncaughtException', function (err) {
  if(!err.message.includes("No such file or directory, cannot open")){
    this.emit('error', err)
  }
})

try {

  var port = new SerialPort({
    path: commPort,
    baudRate:9600,
  });
  
  const parser = port.pipe(new ReadlineParser());
  
  
  port.on("open", () => {
    console.log('serial port open');
  });
  
  parser.on('data', data =>{
    console.log('Arduino: ', data);
  });
  
} catch(error) {  
  const errorMessage = util.inspect(error); 
  console.error(errorMessage); 
}




var loopFunction = function(){
  console.log(sysVars.state)
  if(sysVars.waterLevel < sysVars.waterLevelRange[0]) {
    sysVars.monitoringFrequencyMs = sysVars.MonitoringFrequencies.normalMonitoringFrequency
    sysVars.state = sysVars.States.too_low
    setValve(0)
  }

  if(sysVars.waterLevel >= sysVars.waterLevelRange[0] && 
    sysVars.waterLevel <= sysVars.waterLevelRange[1]) {
    sysVars.state = sysVars.States.normal
    sysVars.monitoringFrequencyMs = sysVars.MonitoringFrequencies.normalMonitoringFrequency
    setValve(25)
  }

  if(sysVars.waterLevel > sysVars.waterLevelRange[1]) {
    sysVars.monitoringFrequencyMs = sysVars.MonitoringFrequencies.alarmMonitoringFrequency
    if(sysVars.waterLevel >= sysVars.waterLevelRange[2] &&
       sysVars.waterLevel < sysVars.waterLevelRange[3]){
        sysVars.state = sysVars.States.too_high
        setValve(50)
    }

    if(sysVars.waterLevel > sysVars.waterLevelRange[3]){
      sysVars.state = sysVars.States.too_high_criticial
      setValve(100)
    }
    
  }
  setTimeout(loopFunction, sysVars.monitoringFrequencyMs);
}
setTimeout(loopFunction, sysVars.monitoringFrequencyMs);

function setValve(valveOpeningLevel){
  if(port != null && port.isOpen){
    port.write(sysVars.valveOpeningLevel + '\n', (err) => {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      sysVars.valveOpeningLevel = valveOpeningLevel
      console.log('valve opening level set');
    });
  } else{
    console.log('could not set valve opening level')
  }

}


import express from 'express';
const expressPort = 3001
const app = express();
app.use(express.json())
app.post('/valveOpeningLevel', (req, res) => {
  console.log(req.body.value);

  //DEBUG
  //sysVars.waterLevel = req.body.value;
  
  if(req.body.value >= 0 && req.body.value <= 100){
    sysVars.valveOpeningLevel = req.body.value;
    
    
  }
  
  res.send('POST request to the homepage')  
})
app.listen(expressPort, () => {
  console.log(`Example app listening on port ${expressPort}`)
})

