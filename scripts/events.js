import { fetchEvents, getLastModified } from "./modules/ics-loader.js";

const icsEndpoint  = '/calendar.ics';

//Adds events to homepage
async function processEvents(url){
    const events = await fetchEvents(url);
    // Sort by start date
    const closestPastEvents = events.sort((a, b) => new Date(b.start) - new Date(a.start)); 
    // Add events to HTML
    const upcomingEventsList = document.getElementById('upcomingEvents');
    addEvents(upcomingEventsList, closestPastEvents);
}

function addEvents(target, events) {
    target.innerHTML = ""; // Clear existing content
    events.forEach(event => {
        const eventDate = new Date(event.start);
        const eventStr = eventDate.toISOString().split('T')[0];
        const eventHTML = `
        <div class="framed mb-5">
            <div class="mb-3">
                <colored>${eventStr}</colored> - <a href="#">${event.summary}</a>
            </div>
            <div>
                <p>${event.description}</colored>
            </div>
        </div>`;
        target.innerHTML += eventHTML;
    });
}

async function setLastUpdatedTimestamp(icsEndpoint){
    const timeStamp = await getLastModified(icsEndpoint);
    const coloredDiv = document.getElementById("calenderLastUpdated");
    let [day, hour] = timeStamp.toISOString().split('T');
    hour = hour.split('.')[0];
    coloredDiv.innerHTML = `${day}, ${hour}`;
}

processEvents(icsEndpoint);
setLastUpdatedTimestamp(icsEndpoint);
