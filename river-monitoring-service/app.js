import { SerialPort, ReadlineParser } from "serialport";
import mqtt from "mqtt";

const commPort = "COM7";

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
});

// const port = new SerialPort(commPort, { baudRate: 9600 });
// const parser = port.pipe(new ReadlineParser());
// parser.on("data", console.log);
// port.write("ROBOT PLEASE RESPONSE\n");
