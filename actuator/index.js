const mqtt = require('mqtt');

// MQTT broker URL and options
const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const options = {
    clientId: 'actuator',
    username: 'actuator-username', 
    password: 'actuator-password'  
};

// Create MQTT client and connect
const client = mqtt.connect(brokerUrl, options);

// MQTT topic to subscribe to
const fanControlTopic = 'fan/control';

// Handle MQTT connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(fanControlTopic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${fanControlTopic}`);
        }
    });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
    if (topic === fanControlTopic) {
        const controlMessage = JSON.parse(message.toString());
        if (controlMessage.action === 'turn_on') {
            turnFanOn();
        } else if (controlMessage.action === 'turn_off') {
            turnFanOff();
        }
    }
});

// Simulate turning the fan on
function turnFanOn() {
    console.log('Fan is ON');
    // Add actual hardware control code here if needed
}

// Simulate turning the fan off
function turnFanOff() {
    console.log('Fan is OFF');
    // Add actual hardware control code here if needed
}
