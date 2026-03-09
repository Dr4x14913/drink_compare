// UI rendering and event handlers
let html5QrCode = null;
let html5QrcodeScanner = null;
let scannerModal = null;

// Initialize modal click handler
document.addEventListener('DOMContentLoaded', () => {
    scannerModal = document.getElementById('scanner-modal');
    if (scannerModal) {
        scannerModal.addEventListener('click', (e) => {
            // Click on modal background (not content)
            if (e.target === scannerModal) {
                window.closeScanner();
            }
            // Handle close buttons - use closest() to find button even if clicking inner element
            const closeBtn = e.target.closest('[onclick="closeScanner()"]');
            if (closeBtn) {
                e.stopPropagation();
                window.closeScanner();
            }
        });
    }
});

function renderDrinks() {
    const drinks = loadDrinks();
    const sortedDrinks = [...drinks].sort((a, b) => b.score - a.score);
    
    const container = document.getElementById('drinks-list');
    if (sortedDrinks.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No drinks added yet. Add one above!</p>';
        return;
    }

    container.innerHTML = sortedDrinks.map(drink => `
        <div class="glass rounded-lg p-4 animate-pulse-slow">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div class="flex-1">
                    <h3 class="text-xl font-bold">${escapeHtml(drink.name)}</h3>
                    <p class="text-gray-400 text-sm">${drink.volume}ml • ${drink.alcohol}% alc • €${drink.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center justify-between w-full md:w-auto gap-4">
                    <div class="text-right">
                        <div class="text-3xl font-bold neon-text">${drink.score.toFixed(2)}</div>
                        <div class="text-gray-400 text-sm">Score</div>
                    </div>
                    <button onclick="removeDrink(${drink.id})" class="text-red-400 hover:text-red-300 p-2" title="Remove">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function addDrink(drink) {
    const drinks = loadDrinks();
    const newDrink = {
        id: Date.now(),
        name: drink.name || 'Unknown',
        volume: parseFloat(drink.volume) || 0,
        alcohol: parseFloat(drink.alcohol) || 0,
        price: parseFloat(drink.price) || 0,
        score: calculateScore(drink),
    };
    drinks.push(newDrink);
    saveDrinks(drinks);
    renderDrinks();
}

function addManualDrink() {
    const drink = {
        name: document.getElementById('manual-name').value,
        volume: document.getElementById('manual-volume').value,
        alcohol: document.getElementById('manual-alcohol').value,
        price: document.getElementById('manual-price').value,
    };

    if (!drink.name || !drink.volume || !drink.alcohol || !drink.price) {
        alert('Please fill in all fields');
        return;
    }

    addDrink(drink);
    
    // Clear form
    document.getElementById('manual-name').value = '';
    document.getElementById('manual-volume').value = '';
    document.getElementById('manual-alcohol').value = '';
    document.getElementById('manual-price').value = '';
}

function onScanSuccess(decodedText, decodedResult) {
    document.getElementById('barcode-code').value = decodedText;
    fetchProductData(decodedText);
    closeScanner();
}

function openScanner() {
    const modal = document.getElementById('scanner-modal');
    const reader = document.getElementById('reader');
    
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    reader.innerHTML = '';
    
    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            videoConstraints: { facingMode: "environment" }
        },
        false
    );
    html5QrcodeScanner.render(onScanSuccess);
}

function closeScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(() => {});
        html5QrcodeScanner = null;
    }
    if (html5QrCode) {
        html5QrCode.stop().catch(() => {});
        html5QrCode = null;
    }
    const modal = document.getElementById('scanner-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function fetchProductData(code) {
    const client = new OpenFoodFacts();
    try {
        const data = await client.getProduct(code);
        if (data) {
            if (data.name) document.getElementById('manual-name').value = data.name;
            if (data.volume) document.getElementById('manual-volume').value = data.volume;
            if (data.alcohol) document.getElementById('manual-alcohol').value = data.alcohol;
        }
    } catch (err) {
        console.error('Error fetching product:', err);
    }
}

function scanBarcode() {
    const code = document.getElementById('barcode-code').value;
    if (!code) {
        alert('Enter a barcode!');
        return;
    }

    fetchProductData(code);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function removeDrink(id) {
    if (!confirm('Remove this drink?')) return;
    
    const drinks = loadDrinks();
    const filtered = drinks.filter(d => d.id !== id);
    saveDrinks(filtered);
    renderDrinks();
}

function clearAllDrinks() {
    if (loadDrinks().length === 0) return;
    if (!confirm('Clear all drinks?')) return;
    
    saveDrinks([]);
    renderDrinks();
}
