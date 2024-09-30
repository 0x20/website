import { fetchEvents } from "./modules/ics-loader.js";

const icsEndpoint  = '/calendar.ics';

//Adds events to homepage
async function processEvents(url){
    const events = await fetchEvents(url);

    // Process future events
    const now = new Date();
    const closestPastEvents = events
        .filter((ev) => new Date(ev.start) < now)
        .sort((a, b) => new Date(b.start) - new Date(a.start)) // Sort by start date
        .slice(0, 10); // Get the closest 5 future events

    // Add events to HTML
    const upcomingEventsList = document.getElementById('upcomingEvents');
    

    addEvents(upcomingEventsList, closestPastEvents);
}

function addEvents(target, events) {
    target.innerHTML = ""; // Clear existing content
    events.forEach(event => {
        const eventDate = new Date(event.start);
        const eventHTML = `<colored>${eventDate.toISOString().split('T')[0]}</colored> - <a href="#">${event.summary}</a><br>`;
        target.innerHTML += eventHTML;
    });
}

processEvents(icsEndpoint);