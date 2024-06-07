const socket = io();

const ctx = document.getElementById('temperatureChart').getContext('2d');
const temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature (°C)',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'second'
                },
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperature (°C)'
                }
            }
        }
    }
});

socket.on('temperature', (data) => {
    const now = new Date(data.timestamp);
    if (temperatureChart.data.labels.length >= 20) {
        temperatureChart.data.labels.shift();
        temperatureChart.data.datasets[0].data.shift();
    }
    temperatureChart.data.labels.push(now);
    temperatureChart.data.datasets[0].data.push(data.temperature);
    temperatureChart.update();
});

const fanStatusElement = document.getElementById('fanStatus');

socket.on('fanStatus', (data) => {
    fanStatusElement.textContent = data.status;
    if (data.status === 'on') {
        fanStatusElement.classList.add('on');
    } else {
        fanStatusElement.classList.remove('on');
    }
});
