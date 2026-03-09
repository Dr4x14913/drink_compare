# Drink Compare

A vibe coded web application to compare the value of alcoholic drinks based on price, volume, and alcohol content.

## Features

- **Manual Entry**: Add drinks manually with name, volume, alcohol percentage, and price
- **Barcode Scanning**: Scan product barcodes using your camera to automatically fetch drink data
- **Smart Comparison**: Calculate value scores using the formula: `(alcohol % × volume) / price`
- **Persistent Storage**: Your drinks are saved in the browser's local storage
- **Error Handling**: Clear error messages when barcode data is missing or invalid

## How It Works

1. Add drinks either manually or by scanning their barcode
2. The app fetches product data from Open Food Facts API
3. A value score is calculated for each drink
4. Drinks are sorted by score (highest = best value)

## Technologies

- **HTML5** + **Tailwind CSS** for styling
- **JavaScript** (vanilla) for logic
- **html5-qrcode** for barcode scanning
- **Open Food Facts API** for product data

## Usage

1. Open `index.html` in a modern web browser
2. Enter drink details manually or click "Scan" to use your camera

> The html5-qrcode library require using https or local host to work

## License

MIT
