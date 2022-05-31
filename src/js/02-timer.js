// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  btnStarEl: document.querySelector('[data-start]'),
  daysOutEl: document.querySelector('.value[data-days]'),
  hoursOutEl: document.querySelector('.value[data-hours]'),
  minutesOutEl: document.querySelector('.value[data-minutes]'),
  secondsOutEl: document.querySelector('.value[data-seconds]'),
};

let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const timeDifference = selectedDates[0] - Date.now();

    if (timeDifference >= 0) {
      refs.btnStarEl.disabled = false;

      refs.btnStarEl.addEventListener('click', () => {
        onBtnStartHandle(timeDifference);
      });
    } else {
      // window.alert('Please choose a date in the future');
      Notify.init({
        position: 'center-top',
      });
      Notify.failure('Please choose a date in the future');
    }
  },
};

flatpickr('#datetime-picker', options);

function onBtnStartHandle(time) {
  refs.btnStarEl.disabled = true;
  let delay = 1000;
  intervalId = setInterval(() => {
    if (time >= 0) {
      const { days = 0, hours = 0, minutes = 0, seconds = 0 } = convertMs(time);

      refs.daysOutEl.textContent = addLeadingZero(days);
      refs.hoursOutEl.textContent = addLeadingZero(hours);
      refs.minutesOutEl.textContent = addLeadingZero(minutes);
      refs.secondsOutEl.textContent = addLeadingZero(seconds);

      time -= delay;
    } else {
      clearInterval(intervalId);
    }
  }, delay);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
