function showTime() {
    let todayDate = new Date();
    let hours = todayDate.getHours();
    let minutes = todayDate.getMinutes();
    let seconds = todayDate.getSeconds();
    let period = 'AM';

    if (hours === 0) {
        h = 12;
    }
    if (hours > 12) {
        h = h - 12;
        period = 'PM';
    }

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    let timer = hours + ':' + minutes + ':' + seconds + period;
    document.getElementById('displayClock').innerText = timer;
    document.getElementById('displayClock').innerHTML = timer;

    setTimeout(showTime, 1000);
}
showTime();