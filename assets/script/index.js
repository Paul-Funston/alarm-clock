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


const setAlarm = select('.alarm-set');
const cancelAlarm = select('.alarm-cancel')
const currentTime = select('.current-time');
const displayTimer = select('.display-timer');
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]/;
const userTimeWanted = select('.alarm-time');
const background = select('body');

let now = {};
let nowYear = 0;
let nowMonth = 0;
let nowDay = 0;
let nowHour = 0;
let nowMin = 0;
let wantedHour = 0;
let wantedMinute = 0;
let alarmID = {};

// function on load sets interval
// function interval runs every second to update time

function startClock() {
    setInterval(updateTime, 1000);
}

function updateTime() {
    getCurrentTime();
    currentTime.innerHTML = now.toTimeString().substring(0,8);
}

function getCurrentTime() {
    const date = new Date();
    now = date;
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
        displayAlarm(alarmWanted.substring(0,5));
        let alarmDate = createAlarmDate(alarmWanted);
        armTimer(alarmDate);
    } else {
        displayTimer.innerText = "please enter a valid time";
    }
}

function cancelTimer() {
    displayTimer.innerHTML = '';
    wantedHour = -1;
    wantedMinute = -1;
    clearInterval(alarmID);
    background.classList.remove('alarm');
    currentTime.classList.remove('alarm');
    cancelAlarm.classList.remove('alarm');
    userTimeWanted.value = '';
}

function displayAlarm(alarmWanted) {
    displayTimer.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${alarmWanted}`;
}

function createAlarmDate(alarmWanted) {
    wantedHour = parseInt(alarmWanted.slice(0, 2));
    wantedMinute = parseInt(alarmWanted.slice(3, 5));

    const alarm = new Date(nowYear, nowMonth, nowDay, wantedHour, wantedMinute);
    if (wantedHour < nowHour || wantedHour === nowHour && wantedMinute < nowMin) {
        alarm.setDate(alarm.getDate() + 1);
    }
    return alarm;
}

function armTimer(alarmDate) {
    let interval = alarmDate - now;
     if (interval >= 0) 
        setTimeout(playAlarm, (interval - 3000));
}

// Audio
const alarmBeep = new Audio(`./assets/media/audio/electric-piano-2.wav`);
alarmBeep.type = 'audio/wav';

function playAlarm() {
    alarmID = setInterval(() => {
        if (wantedHour === nowHour && wantedMinute === nowMin) {
            alarmBeep.play();
            currentTime.classList.toggle('alarm');
            background.classList.toggle('alarm');
            cancelAlarm.classList.add('alarm');
        }
    }, 1500)
}