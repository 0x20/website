async function updateTracker() {
    const statusElement = document.getElementById('status');

    try {
        const response = await fetch('https://windowserver.0x20.be/spaceapi.json');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Check the state of the space
        if (data.state && typeof data.state.open === 'boolean') {
            if (data.state.open) {
                statusElement.textContent = 'space is open!';
            } else {
                statusElement.textContent = 'space is closed';
            }
        } else {
            statusElement.textContent = 'tracker is down 🤦';
        }
    } catch (error) {
        console.error('Error fetching the tracker data:', error);
        statusElement.textContent = 'tracker is down 🤦';
    }
}

// Poll the endpoint every 30 seconds
setInterval(updateTracker, 30000);

// Initial update
updateTracker();
