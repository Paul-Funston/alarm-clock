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
let nowYear = 0;
let nowMonth = 0;
let nowDay = 0;
let nowHour = 0;
let nowMin = 0;
let wantedHour = 0;
let wantedMinute = 0;

// function on load sets interval
// function interval runs every second to update time

function startClock() {
    setInterval(updateTime, 1000);
}

function updateTime() {
    getCurrentTime();
    currentTime.innerHTML = now.substring(0,8);
}

function getCurrentTime() {
    const date = new Date();
    now = date.toTimeString();
    nowYear = date.getFullYear();
    nowMonth = date.getMonth();
    nowDay = date.getDate();
    nowHour = date.getHours();
    nowMin = date.getMinutes();
}

onEvent('onload', currentTime, startClock());

onEvent('click', setAlarm, setTimer);
onEvent('click', cancelAlarm, cancelTimer);

function setTimer() {
    let alarmWanted = userTimeWanted.value.trim();

    if (timeRegex.test(alarmWanted)) {
        displayAlarm(alarmWanted);
        let alarmTime = createAlarmDate(alarmWanted);
        armTimer(alarmTime);
    } else {
        displayTimer.innerText = "please enter a valid time";
    }
}

function cancelTimer() {
    displayTimer.innerHTML = '';
}

function displayAlarm(alarmWanted) {
    displayTimer.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${alarmWanted}`;
}

function createAlarmDate(alarmWanted) {
    wantedHour = parseInt(alarmWanted.slice(0, 2));
    wantedMinute = parseInt(alarmWanted.slice(-2));

    const alarm = new Date(nowYear, nowMonth, nowDay, wantedHour, wantedMinute);
    console.log(alarm);
    return alarm.toTimeString();
}

function armTimer(alarmTime) {
    let interval = alarmTime - now;
    console.log(interval);
}

function playAlarm(interval) {

}