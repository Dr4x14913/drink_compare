// Storage functions for localStorage
function saveDrinks(drinks) {
    localStorage.setItem('drinks', JSON.stringify(drinks));
}

function loadDrinks() {
    const stored = localStorage.getItem('drinks');
    return stored ? JSON.parse(stored) : [];
}
