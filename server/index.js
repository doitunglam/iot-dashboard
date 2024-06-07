const express = require('express');
const http = require('http');
const mqtt = require('mqtt');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MQTT broker URL and options
const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const options = {
    clientId: 'mqtt_web_server',
    username: 'your-username', // If your broker requires authentication
    password: 'your-password'  // If your broker requires authentication
};

// Create MQTT client and connect
const client = mqtt.connect(brokerUrl, options);

// MQTT topics
const temperatureTopic = 'sensor/temperature';
const fanControlTopic = 'fan/control';

let fanStatus = 'off';

// Handle MQTT connection
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe(temperatureTopic, (err) => {
        if (!err) {
            console.log(`Subscribed to topic: ${temperatureTopic}`);
        }
    });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
    if (topic === temperatureTopic) {
        console.log(`Received message: ${message.toString()}`);
        const data = JSON.parse(message.toString());
        io.emit('temperature', data);

        // Check if temperature exceeds threshold and control the fan
        if (data.temperature > 28 && fanStatus !== 'on') {
            fanStatus = 'on';
            client.publish(fanControlTopic, JSON.stringify({ action: 'turn_on' }));
            io.emit('fanStatus', { status: fanStatus });
            console.log('Fan turned on due to high temperature');
        } else if (data.temperature <= 28 && fanStatus !== 'off') {
            fanStatus = 'off';
            client.publish(fanControlTopic, JSON.stringify({ action: 'turn_off' }));
            io.emit('fanStatus', { status: fanStatus });
            console.log('Fan turned off due to temperature normalization');
        }
    }
});

// Serve static files
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
