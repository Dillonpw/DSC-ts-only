function navigateTo(page) {
    switch (page) {
        case 'toHome':
            fetch('index.html')
                .then(function (response) { return response.text(); })
                .then(function (data) {
                var contentDiv = document.getElementById('content');
                if (contentDiv) {
                    contentDiv.innerHTML = data;
                    attachEventListeners();
                }
            })
                .catch(function (error) { return console.error('Error loading page:', error); });
            break;
        case 'toAgeCalculator':
            fetch('calculatorPage.html')
                .then(function (response) { return response.text(); })
                .then(function (data) {
                var contentDiv = document.getElementById('content');
                if (contentDiv) {
                    contentDiv.innerHTML = data;
                    attachEventListeners();
                }
            })
                .catch(function (error) { return console.error('Error loading page:', error); });
            break;
        case 'toScheduleApp':
            fetch('schedulePage.html')
                .then(function (response) { return response.text(); })
                .then(function (data) {
                var contentDiv = document.getElementById('content');
                if (contentDiv) {
                    contentDiv.innerHTML = data;
                    attachEventListeners();
                }
            })
                .catch(function (error) { return console.error('Error loading page:', error); });
            break;
        default:
            document.getElementById('content').innerHTML = '';
    }
}
function calcYearDiff(year) {
    var currentYear = new Date().getFullYear();
    var difference = currentYear - year;
    return difference;
}
function handleSubmit(event) {
    event.preventDefault();
    var yearInput = document.getElementById('year');
    var year = parseInt(yearInput.value);
    if (!isNaN(year)) {
        var age = calcYearDiff(year);
        displayResult(age);
    }
}
function displayResult(age) {
    var resultDiv = document.getElementById('result');
    resultDiv.textContent = "Patient is: ".concat(age);
}
function formatDate(date) {
    var year = date.getUTCFullYear();
    var month = String(date.getUTCMonth() + 1).padStart(2, '0');
    var day = String(date.getUTCDate()).padStart(2, '0');
    return "".concat(year, "-").concat(month, "-").concat(day);
}
function getDayOfWeek(dayIndex) {
    var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    return days[dayIndex];
}
function generateRotatingSchedule(workDays, offDays, totalDays, startDate) {
    var schedule = [];
    var currentDate = new Date(startDate);
    var daysScheduled = 0;
    while (daysScheduled < totalDays) {
        var formattedDate = formatDate(currentDate);
        var dayOfWeek = getDayOfWeek(currentDate.getDay());
        var shift = daysScheduled % (workDays + offDays) < workDays ? 'Work' : 'Off';
        schedule.push({ date: formattedDate, dayOfWeek: dayOfWeek, shift: shift });
        daysScheduled++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedule;
}
function generateSchedule(e) {
    e.preventDefault();
    var workDays = parseInt(document.getElementById('workDays').value, 10);
    var offDays = parseInt(document.getElementById('offDays').value, 10);
    var totalDays = parseInt(document.getElementById('totalDays').value, 10);
    var startDateInput = document.getElementById('startDate').value;
    var startDate = new Date(startDateInput);
    var rotatingSchedule = generateRotatingSchedule(workDays, offDays, totalDays, startDate);
    renderTableView(rotatingSchedule);
    setCookie('workDays', workDays.toString(), 7);
    setCookie('offDays', offDays.toString(), 7);
    setCookie('totalDays', totalDays.toString(), 7);
    setCookie('startDate', startDateInput, 7);
}
function renderTableView(schedule) {
    var scheduleTable = document.getElementById('scheduleTable');
    scheduleTable.innerHTML = '';
    schedule.forEach(function (entry) {
        var row = document.createElement('tr');
        var dateCell = document.createElement('td');
        dateCell.textContent = entry.date;
        var dayOfWeekCell = document.createElement('td');
        dayOfWeekCell.textContent = entry.dayOfWeek;
        var shiftCell = document.createElement('td');
        shiftCell.textContent = entry.shift;
        row.appendChild(dayOfWeekCell);
        row.appendChild(dateCell);
        row.appendChild(shiftCell);
        scheduleTable.appendChild(row);
    });
}
function setCookie(name, value, daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
}
function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length);
    }
    return null;
}
function prefillInputs() {
    document.getElementById('workDays').value =
        getCookie('workDays') || '';
    document.getElementById('offDays').value =
        getCookie('offDays') || '';
    document.getElementById('totalDays').value =
        getCookie('totalDays') || '';
    document.getElementById('startDate').value =
        getCookie('startDate') || '';
}
var popUp = function () {
    var popUp = document.getElementById('moreInfo');
    var button = document.getElementById('popBtn');
    popUp.style.display = 'flex';
    button.style.display = 'none';
};
var popDown = function () {
    var popUp = document.getElementById('moreInfo');
    var button = document.getElementById('popBtn');
    popUp.style.display = 'none';
    button.style.display = 'block';
};
function attachEventListeners() {
    var toHome = document.getElementById('toHome');
    if (toHome) {
        toHome.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo('home');
        });
    }
    var toAgeCalculator = document.getElementById('toAgeCalculator');
    if (toAgeCalculator) {
        toAgeCalculator.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo('ageCalculator');
        });
    }
    var toScheduleApp = document.getElementById('toScheduleApp');
    if (toScheduleApp) {
        toScheduleApp.addEventListener('click', function (e) {
            e.preventDefault();
            navigateTo('scheduleApp');
        });
    }
    var generateButton = document.getElementById('generate');
    if (generateButton) {
        generateButton.addEventListener('click', function (e) {
            e.preventDefault();
            generateSchedule(e);
        });
    }
    var popBtn = document.getElementById('popBtn');
    if (popBtn) {
        popBtn.addEventListener('click', popUp);
    }
    var moreInfo = document.getElementById('moreInfo');
    if (moreInfo) {
        moreInfo.addEventListener('click', popDown);
    }
    var ageForm = document.getElementById('ageForm');
    if (ageForm) {
        ageForm.addEventListener('submit', handleSubmit);
    }
    document.querySelectorAll('[data-navigate]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var page = link.getAttribute('data-navigate');
            if (page) {
                navigateTo(page);
            }
        });
    });
}
window.onload = function () {
    attachEventListeners();
    prefillInputs();
};
