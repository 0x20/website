import { fetchEvents, getLastModified, getLocalIsoString } from "./modules/ics-loader.js";

const icsEndpoint = '/calendar.ics';

// Adds events to homepage
async function processEvents(url) {
    const events = await fetchEvents(url);
    // Sort by start date
    const closestPastEvents = events.sort((a, b) => new Date(b.start) - new Date(a.start));
    // Add events to HTML
    const upcomingEventsList = document.getElementById('upcomingEvents');
    addEvents(upcomingEventsList, closestPastEvents);
}

// Function to extract image URLs from the description
function extractImageUrls(description) {
    const imageRegex = /(https:\/\/[^\s]+?\.(?:jpg|jpeg|png|gif))/gi;
    return description.match(imageRegex) || [];
}

function addEvents(target, events) {
    target.innerHTML = ""; // Clear existing content
    events.forEach(event => {
        const eventDate = new Date(event.start);
        const eventStr = getLocalIsoString(eventDate).split('T')[0];

        // Extract image URLs from event description
        const images = extractImageUrls(event.description);
        let imagesHTML = '';

        if (images.length > 0) {
            images.forEach(url => {
                imagesHTML += `<img src="${url}" alt="Event Image" style="width:200px; margin:10px;">`;
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

async function setLastUpdatedTimestamp(icsEndpoint) {
    const timeStamp = await getLastModified(icsEndpoint);
    const coloredDiv = document.getElementById("calenderLastUpdated");
    let [day, hour] = getLocalIsoString(timeStamp).split('T');
    hour = hour.split('.')[0];
    coloredDiv.innerHTML = `${day}, ${hour}`;
}

processEvents(icsEndpoint);
setLastUpdatedTimestamp(icsEndpoint);
