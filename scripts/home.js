import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

//Adds events to homepage

const icsEndpoint  = '/calendar.ics';

async function fetchEvents(url) {
    const response = await fetch(url);
    const data = await response.text();
    var vevents = [];

    try {
        var jcalData = ICAL.parse(data);
        var vcalendar = new ICAL.Component(jcalData);
        vevents = vcalendar.getAllSubcomponents('vevent');
    } catch (ex) {
        console.log("Parsing failed");
        console.log(ex.message);
        return; // Early return if parsing fails
    }

    const events = vevents.map(event => ({
        summary: event.getFirstPropertyValue('summary'),
        start: event.getFirstPropertyValue('dtstart'),
        end: event.getFirstPropertyValue('dtend'),
        uid: event.getFirstPropertyValue('uid'),
        description: event.getFirstPropertyValue('description'),
    }));
    const now = new Date();

    // Categorize events into future and past using reduce
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
        const eventHTML = `<colored>${eventDate.toISOString().split('T')[0]}</colored> - <a href="#">${event.summary}</a><br>`;
        target.innerHTML += eventHTML;
    });
}

fetchEvents(icsEndpoint);