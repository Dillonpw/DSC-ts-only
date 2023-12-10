function navigateTo(page) {
    switch (page) {
        case 'ageCalculator':
            fetch('calculator.html')
                .then(function (response) { return response.text(); })
                .then(function (data) {
                document.getElementById('content').innerHTML = data;
            })
                .catch(function (error) { return console.error('Error loading page:', error); });
            break;
        case 'scheduleApp':
            fetch('schedule.html')
                .then(function (response) { return response.text(); })
                .then(function (data) {
                document.getElementById('content').innerHTML = data;
            })
                .catch(function (error) { return console.error('Error loading page:', error); });
            break;
        default:
            document.getElementById('content').innerHTML = '';
    }
}
