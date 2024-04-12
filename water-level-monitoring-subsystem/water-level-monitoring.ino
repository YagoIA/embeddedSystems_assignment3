#include <WiFi.h>
#include <PubSubClient.h>

// WiFi
// const char *ssid = "mert";
// const char *password = "20190602001";

// // WiFi
const char *ssid = "POCO F2 Pro";
const char *password = "c.ronaldo";

// MQTT Broker
const char *mqtt_broker = "broker.emqx.io";
const char *topic = "emqx/esp32";
const char *wltopic = "water-level";
const char *frequencyTopic = "sample-frequency";
const char *mqtt_username = "emqx";
const char *mqtt_password = "public";
const int mqtt_port = 1883;

const int trigPin = 14;
const int echoPin = 13;

int sampleFrequency = 1000;

//define sound speed in cm/uS
#define SOUND_SPEED 0.034
#define CM_TO_INCH 0.393701

#define RGB_BRIGHTNESS 32 // Change white brightness (max 255)

int duration;
float distanceCm;


WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
    setLed(false);
    Serial.begin(115200); // Starts the serial communication
    pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
    pinMode(echoPin, INPUT); // Sets the echoPin as an Input
    // Set software serial baud to 115200;
    Serial.begin(115200);
    // Connecting to a WiFi network
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi..");
    }
    Serial.println("Connected to the Wi-Fi network");
    //connecting to a mqtt broker
    client.setServer(mqtt_broker, mqtt_port);
    client.setCallback(callback);
    while (!client.connected()) {
        String client_id = "esp32-client-";
        client_id += String(WiFi.macAddress());
        Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());
        if (client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("Public EMQX MQTT broker connected");
            setLed(true);
        } else {
            setLed(false);
            Serial.print("failed with state ");
            Serial.print(client.state());
            delay(2000);
        }
    }
    // Publish and subscribe
    client.subscribe(frequencyTopic);
}

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    String str = "";
    for (int i = 0; i < length; i++) {
        str.concat((char) payload[i]);
    }

    if(strcmp(topic, frequencyTopic) == 0){
      sampleFrequency =  str.toInt();
      Serial.println(sampleFrequency);
      Serial.println("changed sample-frequency");
    }
}

void setLed(bool green){
    #ifdef RGB_BUILTIN
      if(green){
        neopixelWrite(RGB_BUILTIN,0,RGB_BRIGHTNESS,0); // Green
      } else{
        neopixelWrite(RGB_BUILTIN,RGB_BRIGHTNESS,0,0); // Red
      }
    #endif
}

void loop() {
    // Clears the trigPin
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    // Sets the trigPin on HIGH state for 10 micro seconds
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);

    // Reads the echoPin, returns the sound wave travel time in microseconds
    duration = pulseIn(echoPin, HIGH);
    // Calculate the distance
    distanceCm = duration * SOUND_SPEED/2;
    char temp[10];
    int waterLevel = map(distanceCm, 5, 50, 400, 0);
    if(waterLevel < 0){
      waterLevel = 0;
    }
    ltoa(waterLevel,temp,10);
    Serial.println(distanceCm);
    client.publish(wltopic, temp);
    client.loop();
    delay(sampleFrequency);
    

    
    
}
