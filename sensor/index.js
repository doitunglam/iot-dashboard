const mqtt = require('mqtt');

// Replace with your MQTT broker's URL
const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';  // Example: 'mqtt://localhost:1883' or 'mqtts://your-server-ip:8883'

// Options for connecting to the broker
const options = {
    clientId: 'sensor',
    username: 'sensor-username',
    password: 'sensor-password'  
};

// Create a client instance
const client = mqtt.connect(brokerUrl, options);

// Topic to publish to
const topic = 'sensor/temperature';

// Function to generate a random temperature value
function generateTemperature(baseTemperature) {
    const baseTemperatureValue = baseTemperature.value; // Base temperature in degrees Celsius
    const fluctuation = Math.random() - 0.5; // Random fluctuation between -0.5 and +0.5
    return baseTemperatureValue + fluctuation;
}

// Function to publish a temperature value with a timestamp
function publishTemperature(baseTemperature) {
    const temperature = generateTemperature(baseTemperature);
    baseTemperature.value = temperature;
    const timestamp = new Date().toISOString();

    const data = {
        temperature: temperature.toFixed(2), // Format temperature to 2 decimal places
        timestamp: timestamp
    };

    const message = JSON.stringify(data);

    client.publish(topic, message, { qos: 0 }, (err) => {
        if (err) {
            console.error('Failed to publish message:', err);
        } else {
            console.log('Published:', message);
        }
    });
}

// When the client connects to the broker
client.on('connect', () => {
    const baseTemperate = {value: 25};
    console.log('Connected to broker');

    // Publish a temperature value immediately
    publishTemperature(baseTemperate);

    // Set an interval to publish a temperature value every minute (60000 milliseconds)
    setInterval(() => publishTemperature(baseTemperate), 1000);
});

// Handle errors
client.on('error', (err) => {
    console.error('Connection error:', err);
    client.end();
});
