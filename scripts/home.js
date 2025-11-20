import { fetchEvents, getLocalIsoString } from "./modules/ics-loader.js";

const icsEndpoint  = '/calendar.ics';

// Space status banner functionality
async function updateSpaceStatusBanner() {
    const banner = document.getElementById('space-open-banner');

    try {
        const response = await fetch('https://windowserver.0x20.be/spaceapi.json');

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Check the state of the space
        if (data.state && typeof data.state.open === 'boolean') {
            if (data.state.open) {
                // Show the banner
                banner.classList.remove('hidden');
            } else {
                // Hide the banner
                banner.classList.add('hidden');
            }
        } else {
            // Hide banner if tracker is down
            banner.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching the space status:', error);
        // Hide banner on error
        banner.classList.add('hidden');
    }
}

// Poll the endpoint every 30 seconds
setInterval(updateSpaceStatusBanner, 30000);

// Initial update
updateSpaceStatusBanner();

//Adds events to homepage
async function processEvents(url){
    const events = await fetchEvents(url);
    
    // Categorize events into future and past using reduce
    const now = new Date();
    const { futureEvents, pastEvents } = events.reduce((acc, event) => {
        if (event.start) {
            const eventDate = new Date(event.start);
            if (eventDate > now) 
                acc.futureEvents.push(event);
            else if (eventDate < now) 
                acc.pastEvents.push(event);
        }
        return acc;
    }, { futureEvents: [], pastEvents: [] });

    // Process future events
    const closestFutureEvents = futureEvents
        .sort((a, b) => new Date(a.start) - new Date(b.start)) // Sort by start date
        .slice(0, 5); // Get the closest 5 future events

    // Process past events
    const recentPastEvents = pastEvents
        .sort((a, b) => new Date(b.start) - new Date(a.start)) // Sort by start date
        .slice(0, 5); // Get the last 5 most recent past events

    // Add events to HTML
    const upcomingEventsList = document.getElementById('upcomingEvents');
    const pastEventsList = document.getElementById('pastEvents');

    addEvents(upcomingEventsList, closestFutureEvents);
    addEvents(pastEventsList, recentPastEvents);
}

function addEvents(target, events) {
    target.innerHTML = ""; // Clear existing content
    events.forEach(event => {
        const eventDate = new Date(event.start);
        const eventHTML = `<colored>${getLocalIsoString(eventDate).split('T')[0]}</colored> - <a href="./events.html#${event.uid}">${event.summary}</a>
<br>`;
        target.innerHTML += eventHTML;
    });
}

processEvents(icsEndpoint);