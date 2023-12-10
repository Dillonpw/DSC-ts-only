function navigateTo(page: string): void {
    switch (page) {
        case 'ageCalculator':
            fetch('ageCalculator.html')
                .then((response) => response.text())
                .then((data) => {
                    document.getElementById('content')!.innerHTML = data;
                })
                .catch((error) => console.error('Error loading page:', error));
                break;
        case 'scheduleApp':
            fetch('schdeulApp.html')
                .then((response) => response.text())
                .then((data) => {
                    document.getElementById('content')!.innerHTML = data;
                })
                .catch((error) => console.error('Error loading page:', error));
            break;
        default:
            document.getElementById('content')!.innerHTML = '';
    }
}
