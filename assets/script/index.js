'use strict';
/*
    Object-orientd JavaScript
    Paul Funston

    Alarm Clock Assignment 01
*/

//Utility functions

function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function select(selector, parent = document) {
    return parent.querySelector(selector);
}

function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    })
} 

const setAlarm = select('.alarm-set');
const cancelAlarm = select('.alarm-cancel')
const currentTime = select('.current-time');
const displayTimer = select('.display-timer');
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]/;
const userTimeWanted = select('.alarm-time')

let now = '';
let nowHour = 0;
let nowMin = 0;
let nowSec = 0;

// function on load sets interval
// function interval runs every second to update time

function startClock() {
    setInterval(updateTime, 1000);
}

function updateTime() {
    getCurrentTime();
    currentTime.innerHTML = now;
}

function getCurrentTime() {
    const date = new Date()
    now = date.toTimeString().substring(0,8);
    nowHour = date.getHours();
    nowMin = date.getMinutes();
    nowSec = date.getSeconds();
    return now
}

onEvent('onload', currentTime, startClock());

onEvent('click', setAlarm, setTimer);
onEvent('click', cancelAlarm, cancelTimer);

function setTimer() {
    let alarm = userTimeWanted.value;
    console.log(displayTimer);
    console.log(alarm);
    if (timeRegex.test(alarm)) {
        displayTimer.innerText = alarm;
    } else {
        displayTimer.innerText = "please enter a valid time";
    }
}

function cancelTimer() {
    displayTimer.innerHTML = '';
}