import { SerialPort, ReadlineParser } from "serialport";
import mqtt from "mqtt";
import { SystemVariables } from "./SystemVariables.js";

//const commPort = "COM7";
const commPort = "/dev/ttyACM1";

var sysVars = new SystemVariables(
  0
)



const protocol = "mqtt";
const host = "broker.emqx.io";
const brokerPort = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${brokerPort}`;

const topic = "emqx/esp32";
const wlTopic = "water-level";
const frequencyTopic = "sample-frequency"

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

  client.subscribe([wlTopic], () => {});
});

client.on("message", (topic, payload) => {
  console.log("Received Message:", topic, payload.toString());

  //TODO on ESP32 side
  if(topic == wlTopic){
    sysVars.waterLevel = +payload
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


function publishSampleFrequency(){
  client.publish(
    frequencyTopic,
    sysVars.monitoringFrequencyMs + "",
    { qos: 0, retain: false },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
}

function setSampleFrequency(frequency){
  if(frequency != sysVars.monitoringFrequencyMs){
    sysVars.monitoringFrequencyMs = frequency
    publishSampleFrequency()
  }
}

var loopFunction = function(){
  console.log(sysVars.state)
  if(sysVars.state != "overwrite"){
    if(sysVars.waterLevel < sysVars.waterLevelRange[0]) {
      setSampleFrequency(sysVars.MonitoringFrequencies.normalMonitoringFrequency)
      sysVars.state = sysVars.States.too_low
      setValve(0)
    }
  
    if(sysVars.waterLevel >= sysVars.waterLevelRange[0] && 
      sysVars.waterLevel <= sysVars.waterLevelRange[1]) {
      setSampleFrequency(sysVars.MonitoringFrequencies.normalMonitoringFrequency)
      sysVars.state = sysVars.States.normal
      setValve(25)
    }
  
    if(sysVars.waterLevel > sysVars.waterLevelRange[1]) {
      setSampleFrequency(sysVars.MonitoringFrequencies.alarmMonitoringFrequency)
      if(sysVars.waterLevel <= sysVars.waterLevelRange[2]){
        sysVars.state = sysVars.States.pre_too_high
        setValve(25)
      }
      if(sysVars.waterLevel > sysVars.waterLevelRange[2] &&
         sysVars.waterLevel <= sysVars.waterLevelRange[3]){
          sysVars.state = sysVars.States.too_high
          setValve(50)
      }
  
      if(sysVars.waterLevel > sysVars.waterLevelRange[3]){
        sysVars.state = sysVars.States.too_high_criticial
        setValve(100)
      }
      
    }
  }
  setTimeout(loopFunction, sysVars.monitoringFrequencyMs);

}
setTimeout(loopFunction, sysVars.monitoringFrequencyMs);

function setValve(valveOpeningLevel){
  if(port != null && port.isOpen){
    
    port.write(valveOpeningLevel + '\n', (err) => {
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

app.get('/status', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.send(sysVars)  
})

// Middleware to set CORS headers for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/overwrite', (req, res) => {
  if(sysVars.state != sysVars.States.overwrite){
    sysVars.state = sysVars.States.overwrite
  } else{
    sysVars.state = sysVars.States.normal
  }
})

app.post('/valveOpeningLevel', (req, res) => {
  console.log(req.body.value);
  if(req.body.value >= 0 && req.body.value <= 100 && sysVars.state == 'overwrite'){
    setValve(req.body.value)
  } 
  res.send('valve opening level set')  
})
app.listen(expressPort, () => {
  console.log(`Example app listening on port ${expressPort}`)
})

