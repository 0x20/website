import { fetchEvents, getLastModified, getLocalIsoString } from "./modules/ics-loader.js";

const icsEndpoint = '/calendar.ics';

// Adds events to homepage
async function processEvents(url) {
    const events = await fetchEvents(url);
    
    const now = new Date();
    var { futureEvents, pastEvents } = events.reduce((acc, event) => {
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
    futureEvents = futureEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    console.log("Amount of future events: " + futureEvents.length);
    // Process past events
    pastEvents = pastEvents.sort((a, b) => new Date(b.start) - new Date(a.start));
    console.log("Amount of past events: " + pastEvents.length);
     
    // Add events to HTML
    addFutureEvents(document.getElementById('upcomingEvents'), futureEvents);
    addPastEvents(document.getElementById('pastEvents'), pastEvents);
}

// Function to extract image URLs from the description
function extractImageUrls(description) {
    const imageRegex = /(https:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif))/gi;
    return description.match(imageRegex) || [];
}

function addPastEvents(target, events) {
    console.log("Adding past events to " + target.id);
    target.innerHTML = ""; // Clear existing content
    events.forEach(event => {
        const eventDate = new Date(event.start);
        const eventStr = getLocalIsoString(eventDate).split('T')[0];

        // Extract image URLs from event description
        const images = extractImageUrls(event.description);
        let imagesHTML = '';

        if (images.length > 0) {    
            images.forEach(url => {
                imagesHTML += `<img src="${url}" alt="Event Image" style="height:250px; margin:10px;">`;
            });
        }

        const eventHTML = `
        <div class="framed mb-5">
            <div class="mb-3">
                <colored>${eventStr}</colored> - <a href="#">${event.summary}</a>
            </div>
            <div>
                <p>${event.description}</p>
                <div>${imagesHTML}</div> <!-- Add the images here -->
            </div>
        </div>`;

        target.innerHTML += eventHTML;
    });
}

function addFutureEvents(target, events) {
    console.log("Adding future events to " + target.id);
    target.innerHTML = ""; // Clear existing content
    events.forEach(event => {
        const eventDate = new Date(event.start);
        const eventStr = getLocalIsoString(eventDate).split('T')[0];

        const eventHTML = `
        <div class="framed m-2 tile" style="min-width: 400px;height: 300px;">
            <div class="mb-3">
                <colored>${eventStr}</colored> - <a href="#">${event.summary}</a>
            </div>
            <div>
                <p>${event.description}</p>
            </div>
        </div>`;

        target.innerHTML += eventHTML;
    });
}

async function setLastUpdatedTimestamp(icsEndpoint) {
    const timeStamp = await getLastModified(icsEndpoint);
    const coloredDiv = document.getElementById("calenderLastUpdated");
    let [day, hour] = getLocalIsoString(timeStamp).split('T');
    hour = hour.split('.')[0];
    coloredDiv.innerHTML = `${day}, ${hour}`;
}

processEvents(icsEndpoint);
setLastUpdatedTimestamp(icsEndpoint);
