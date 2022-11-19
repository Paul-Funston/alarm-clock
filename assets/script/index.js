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


const setAlarmBtn = select('.alarm-set');
const cancelAlarmBtn = select('.alarm-cancel')
const currentTimeDisplay = select('.current-time');
const displayTimer = select('.display-timer');
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]/;
const userTimeWanted = select('.alarm-time');
const background = select('body');
const countdownDisplay = select('.display-countdown');

let now = {};
let nowYear = 0;
let nowMonth = 0;
let nowDay = 0;
let nowHour = 0;
let nowMin = 0;

let alarmDate = {};
let wantedHour = 0;
let wantedMinute = 0;

let alarmID = 0;
let timeRemaining = 0;
// function on load sets interval
// function interval runs every second to update time

function startClock() {
    setInterval(updateTime, 1000);
}

function updateTime() {
    getCurrentTime();
    currentTimeDisplay.innerHTML = now.toTimeString().substring(0,8);
    displayCountdown();
}

function getCurrentTime() {
    now = new Date();
    nowYear = now.getFullYear();
    nowMonth = now.getMonth();
    nowDay = now.getDate();
    nowHour = now.getHours();
    nowMin = now.getMinutes();
}

onEvent('onload', currentTimeDisplay, startClock());
onEvent('click', setAlarmBtn, setTimer);
onEvent('click', cancelAlarmBtn, cancelTimer);

function setTimer() {
    let alarmWanted = userTimeWanted.value.trim();

    if (timeRegex.test(alarmWanted)) {
        displayAlarm(alarmWanted.substring(0,5));
        let alarmDate = createAlarmDate(alarmWanted);
        armTimer(alarmDate);
        startCountdown(alarmDate);
    } else {
        displayTimer.innerText = "please enter a valid time";
    }
}

function displayAlarm(alarmWanted) {
    displayTimer.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${alarmWanted}`;
}

function createAlarmDate(alarmWanted) {
    wantedHour = parseInt(alarmWanted.slice(0, 2));
    wantedMinute = parseInt(alarmWanted.slice(3, 5));

    const alarm = new Date(nowYear, nowMonth, nowDay, wantedHour, wantedMinute);
    alarmDate = alarm;
    if (wantedHour < nowHour || (wantedHour === nowHour && wantedMinute < nowMin)) {
        alarm.setDate(alarm.getDate() + 1);
    }
    return alarm;
}

function armTimer(alarmDate) {
    let interval = alarmDate - now;
    setTimeout(playAlarm, (interval - 2000));
}

function cancelTimer() {
    displayTimer.innerHTML = '';
    wantedHour = -1;
    wantedMinute = -1;
    clearInterval(alarmID);
    background.classList.remove('alarm');
    currentTimeDisplay.classList.remove('alarm');
    cancelAlarmBtn.classList.remove('alarm');
    userTimeWanted.value = '';
    hideCountdown();
}

// countdown bonus
function startCountdown(alarmDate) {
    countdownDisplay.style.visibility = "visible"
    timeRemaining = alarmDate - now;
}

function hideCountdown() {
    countdownDisplay.style.visibility = "hidden"
}

function displayCountdown() {
    timeRemaining = alarmDate - now;
    let hoursRemain = Math.trunc((timeRemaining / 3_600_000)).toString().padStart(2, '0');
    let minutesRemain = Math.trunc((timeRemaining / 60_000) % 60).toString().padStart(2, '0');
    let secondsRemain = Math.trunc((timeRemaining / 1000) % 60).toString().padStart(2, '0');

    if (timeRemaining > 0) {
        countdownDisplay.innerText = `${hoursRemain}:${minutesRemain}:${secondsRemain}`;
    } else {
        hideCountdown();
    }
}

// Audio
const alarmBeep = new Audio(`./assets/media/audio/electric-piano-2.wav`);
alarmBeep.type = 'audio/wav';

function playAlarm() {
    let count = 0;
    alarmID = setInterval(() => {
        if (wantedHour === nowHour && wantedMinute === nowMin) {
            alarmBeep.play();
            currentTimeDisplay.classList.toggle('alarm');
            background.classList.toggle('alarm');
            cancelAlarmBtn.classList.add('alarm');
        } else {
            currentTimeDisplay.classList.remove('alarm');
            background.classList.remove('alarm');
            cancelAlarmBtn.classList.remove('alarm');
            count > 15? clearInterval(alarmID): count++;
        }
    }, 1500)
}