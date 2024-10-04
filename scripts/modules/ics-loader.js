export {fetchEvents, getLastModified}

import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

async function fetchEvents(filePath) {
    const response = await fetch(filePath);
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

    return events;
}

//Use this function to see when the server was last update
async function getLastModified(filePath) {
    const response = await fetch(filePath);
    const lastModified = response.headers.get('Last-Modified');
    if (lastModified) 
        return new Date(lastModified);
    return null;
}