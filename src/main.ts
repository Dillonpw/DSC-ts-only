interface ScheduleEntry {
    date: string;
    dayOfWeek: string;
    shift: string;
}

function navigateTo(page: string): void {
    console.log("navigating to:", page)
    switch (page) {
        case 'toHome':
            fetch('index.html')
                .then((response) => response.text())
                .then((data) => {
                    const contentDiv = document.getElementById('content');
                    if (contentDiv) {
                        contentDiv.innerHTML = '';
                        attachEventListeners();
                    }
                })
                .catch((error) => console.error('Error loading page:', error));
            break;
        case 'toAgeCalculator':
            fetch('calculatorPage.html')
                .then((response) => response.text())
                .then((data) => {
                    const contentDiv = document.getElementById('content');
                    if (contentDiv) {
                        contentDiv.innerHTML = data;
                        attachEventListeners();
                    }
                })
                .catch((error) => console.error('Error loading page:', error));
            break;
        case 'toScheduleApp':
            fetch('schedulePage.html')
                .then((response) => response.text())
                .then((data) => {
                    const contentDiv = document.getElementById('content');
                    if (contentDiv) {
                        contentDiv.innerHTML = data;
                        attachEventListeners();
                    }
                })
                .catch((error) => console.error('Error loading page:', error));
            break;
        default:
            document.getElementById('content')!.innerHTML = '';
    }
}

function calcYearDiff(year: number): number {
    const currentYear = new Date().getFullYear();
    const difference = currentYear - year;
    return difference;
}

function handleSubmit(event: Event): void {
    event.preventDefault();

    const yearInput = document.getElementById('year') as HTMLInputElement;
    const year = parseInt(yearInput.value);

    if (!isNaN(year)) {
        const age = calcYearDiff(year);
        displayResult(age);
    }
}

function displayResult(age: number): void {
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    resultDiv.textContent = `Patient is: ${age}`;
}

function formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDayOfWeek(dayIndex: number): string {
    const days = [
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

function generateRotatingSchedule(
    workDays: number,
    offDays: number,
    totalDays: number,
    startDate: Date
): ScheduleEntry[] {
    const schedule: ScheduleEntry[] = [];
    let currentDate = new Date(startDate);
    let daysScheduled = 0;

    while (daysScheduled < totalDays) {
        const formattedDate = formatDate(currentDate);
        const dayOfWeek = getDayOfWeek(currentDate.getDay());
        const shift =
            daysScheduled % (workDays + offDays) < workDays ? 'Work' : 'Off';
        schedule.push({ date: formattedDate, dayOfWeek, shift });
        daysScheduled++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedule;
}

function generateSchedule(e: Event): void {
    e.preventDefault();
    const workDays = parseInt(
        (document.getElementById('workDays') as HTMLInputElement).value,
        10
    );
    const offDays = parseInt(
        (document.getElementById('offDays') as HTMLInputElement).value,
        10
    );
    const totalDays = parseInt(
        (document.getElementById('totalDays') as HTMLInputElement).value,
        10
    );
    const startDateInput = (
        document.getElementById('startDate') as HTMLInputElement
    ).value;
    const startDate = new Date(startDateInput);

    const rotatingSchedule = generateRotatingSchedule(
        workDays,
        offDays,
        totalDays,
        startDate
    );
    renderTableView(rotatingSchedule);

    setCookie('workDays', workDays.toString(), 30);
    setCookie('offDays', offDays.toString(), 30);
    setCookie('totalDays', totalDays.toString(), 30);
    setCookie('startDate', startDateInput, 30);
}

function renderTableView(schedule: ScheduleEntry[]): void {
    const scheduleTable = document.getElementById(
        'scheduleTable'
    ) as HTMLTableElement;
    scheduleTable.innerHTML = '';
    schedule.forEach((entry) => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date;
        const dayOfWeekCell = document.createElement('td');
        dayOfWeekCell.textContent = entry.dayOfWeek;
        const shiftCell = document.createElement('td');
        shiftCell.textContent = entry.shift;
        row.appendChild(dayOfWeekCell);
        row.appendChild(dateCell);
        row.appendChild(shiftCell);
        scheduleTable.appendChild(row);
    });
}

function setCookie(name: string, value: string, daysToExpire: number): void {
    const date = new Date();
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function prefillInputs(): void {
    (document.getElementById('workDays') as HTMLInputElement).value =
        getCookie('workDays') || '';
    (document.getElementById('offDays') as HTMLInputElement).value =
        getCookie('offDays') || '';
    (document.getElementById('totalDays') as HTMLInputElement).value =
        getCookie('totalDays') || '';
    (document.getElementById('startDate') as HTMLInputElement).value =
        getCookie('startDate') || '';
}

const popUp = (): void => {
    const popUp = document.getElementById('moreInfo') as HTMLDivElement;
    const button = document.getElementById('popBtn') as HTMLButtonElement;
    popUp.style.display = 'flex';
    button.style.display = 'none';
};

const popDown = (): void => {
    const popUp = document.getElementById('moreInfo') as HTMLDivElement;
    const button = document.getElementById('popBtn') as HTMLButtonElement;
    popUp.style.display = 'none';
    button.style.display = 'block';
};

function attachEventListeners(): void {
    const navHeader = document.getElementById('navHeader');
    const dropdown = document.getElementById('dropdown');

    if (navHeader && dropdown) {
        navHeader.addEventListener('click', () => {
            dropdown.classList.toggle('show');
        });
    } else {
        console.error('NavHeader or Dropdown elements not found');
    }

    const navLinks = document.querySelectorAll('[data-navigate]');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-navigate');
            if (page) {
                navigateTo(page);
            }
        });
    });

    const toHome = document.getElementById('toHome');
    if (toHome) {
        toHome.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('home');
        });
    }

    const toAgeCalculator = document.getElementById('toAgeCalculator');
    if (toAgeCalculator) {
        toAgeCalculator.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('ageCalculator');
        });
    }

    const toScheduleApp = document.getElementById('toScheduleApp');
    if (toScheduleApp) {
        toScheduleApp.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('scheduleApp');
        });
    }

    const generateButton = document.getElementById('generate');
    if (generateButton) {
        generateButton.addEventListener('click', (e) => {
            e.preventDefault();
            generateSchedule(e);
        });
    }

    const popBtn = document.getElementById('popBtn');
    if (popBtn) {
        popBtn.addEventListener('click', popUp);
    }

    const moreInfo = document.getElementById('moreInfo');
    if (moreInfo) {
        moreInfo.addEventListener('click', popDown);
    }

    const ageForm = document.getElementById('ageForm');
    if (ageForm) {
        ageForm.addEventListener('submit', handleSubmit);
    }
}

window.onload = (): void => {
    attachEventListeners();
    prefillInputs();
};
