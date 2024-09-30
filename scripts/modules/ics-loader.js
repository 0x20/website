export {fetchEvents}

import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";

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

    return events;
}