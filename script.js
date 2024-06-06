document.addEventListener('DOMContentLoaded', () => {
    const adhanAudio = document.getElementById('adhan-audio');
    const termsModal = document.getElementById('terms-modal');
    const locationModal = document.getElementById('location-modal');
    const mainContent = document.getElementById('main-content');
    const termsContinueButton = document.getElementById('terms-continue');
    const acceptTermsCheckbox = document.getElementById('accept-terms');
    const locationContinueButton = document.getElementById('location-continue');
    const cityInput = document.getElementById('city');
    const countryInput = document.getElementById('country');

    // Show terms and conditions modal
    termsModal.style.display = 'flex';

    acceptTermsCheckbox.addEventListener('change', () => {
        termsContinueButton.disabled = !acceptTermsCheckbox.checked;
    });

    termsContinueButton.addEventListener('click', () => {
        termsModal.style.display = 'none';
        locationModal.style.display = 'flex';
    });

    locationContinueButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        const country = countryInput.value.trim();

        if (city && country) {
            locationModal.style.display = 'none';
            mainContent.style.display = 'block';
            fetchPrayerTimes(city, country);
        } else {
            alert('Please enter both city and country.');
        }
    });

    // Function to fetch prayer times
    const fetchPrayerTimes = async (city, country) => {
        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=2`);
            const data = await response.json();

            // Assuming the API returns an object with prayer times
            const times = data.data.timings;

            // Update the HTML elements with the fetched prayer times
            document.getElementById('fajr').textContent = times.Fajr;
            document.getElementById('dhuhr').textContent = times.Dhuhr;
            document.getElementById('asr').textContent = times.Asr;
            document.getElementById('maghrib').textContent = times.Maghrib;
            document.getElementById('isha').textContent = times.Isha;

            // Convert prayer times to Date objects
            const prayerTimes = {
                fajr: convertToTimeObject(times.Fajr),
                dhuhr: convertToTimeObject(times.Dhuhr),
                asr: convertToTimeObject(times.Asr),
                maghrib: convertToTimeObject(times.Maghrib),
                isha: convertToTimeObject(times.Isha)
            };

            // Check prayer times every minute
            setInterval(() => {
                checkPrayerTimes(prayerTimes);
            }, 60000);
        } catch (error) {
            console.error('Error fetching prayer times:', error);
        }
    };

    // Function to convert time string to Date object
    const convertToTimeObject = (timeString) => {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
            hours = 0;
        }
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    };

    // Function to check current time against prayer times
    const checkPrayerTimes = (prayerTimes) => {
        const now = new Date();
        for (const prayer in prayerTimes) {
            const prayerTime = prayerTimes[prayer];
            if (now.getHours() === prayerTime.getHours() && now.getMinutes() === prayerTime.getMinutes()) {
                playAdhan(prayer);
            }
        }
    };

    // Function to play adhan audio
    const playAdhan = (prayer) => {
        if (document.getElementById(`${prayer}-toggle`).checked) {
            adhanAudio.play();
        }
    };

    // Add event listeners to menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            handleMenuClick(item.getAttribute('data-action'));
        });
    });

    // Function to handle menu clicks
    const handleMenuClick = (action) => {
        switch (action) {
            case 'deed-checklist':
                window.location.href = 'deed-checklist.html';
                break;
            case 'how-to-pray':
                window.location.href = 'how-to-pray.html';
                break;
            case 'al-quran':
                window.location.href = 'al-quran.html';
                break;
            case 'qibla':
                window.location.href = 'compass.html';
                break;
            case 'islamic-calendar':
                window.location.href = 'ramadan-calendar.html';
                break;
            case 'tasbeeh':
                window.location.href = 'tasbeeh.html';
                break;
            case 'community':
                alert('Navigating to Community');
                break;
            case 'dua':
                window.location.href = 'dua.html';
                break;
            case 'settings':
                window.location.href = 'settings.html';
                break;
            default:
                alert('Unknown action');
        }
    };
});

//--Deed-Checklist--//
document.addEventListener('DOMContentLoaded', () => {
    const checklistItems = document.querySelectorAll('.checklist-item');

    checklistItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
        });
    });
});

//-- How to Pray --//

function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', () => {
    // Other script functionalities
});

//-- Ramadan Calendar--//
document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.querySelectorAll('.calendar-day');

    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            console.log('Day clicked:', day); // Debugging log
            day.classList.toggle('completed');
        });
    });
});
//-- Compass functionality--//
const compassCircle = document.querySelector(".compass-circle");
const startBtn = document.querySelector(".start-btn");
const myPoint = document.querySelector(".my-point");
let compass;
const isIOS = !(
  navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
  navigator.userAgent.match(/AppleWebKit/)
);

function init() {
  startBtn.addEventListener("click", startCompass);
  navigator.geolocation.getCurrentPosition(locationHandler);
}

function startCompass() {
  if (isIOS) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
        } else {
          alert("has to be allowed!");
        }
      })
      .catch(() => alert("not supported"));
  } else {
    window.addEventListener("deviceorientationabsolute", handler, true);
  }
}

function handler(e) {
  compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

  // ±15 degree
  if (
    (pointDegree < Math.abs(compass) && pointDegree + 15 > Math.abs(compass)) ||
    pointDegree > Math.abs(compass + 15) ||
    pointDegree < Math.abs(compass)
  ) {
    myPoint.style.opacity = 0;
  } else if (pointDegree) {
    myPoint.style.opacity = 1;
  }
}

let pointDegree;

function locationHandler(position) {
  const { latitude, longitude } = position.coords;
  pointDegree = calcDegreeToPoint(latitude, longitude);

  if (pointDegree < 0) {
    pointDegree = pointDegree + 360;
  }
}

function calcDegreeToPoint(latitude, longitude) {
  // Qibla geolocation
  const point = {
    lat: 21.422487,
    lng: 39.826206,
  };

  const phiK = (point.lat * Math.PI) / 180.0;
  const lambdaK = (point.lng * Math.PI) / 180.0;
  const phi = (latitude * Math.PI) / 180.0;
  const lambda = (longitude * Math.PI) / 180.0;
  const psi =
    (180.0 / Math.PI) *
    Math.atan2(
      Math.sin(lambdaK - lambda),
      Math.cos(phi) * Math.tan(phiK) -
        Math.sin(phi) * Math.cos(lambdaK - lambda)
    );
  return Math.round(psi);
}

init();