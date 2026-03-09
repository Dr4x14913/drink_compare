// Score calculation: (alcohol % × volume) / price
function calculateScore(drink) {
    const alcohol = parseFloat(drink.alcohol) || 0;
    const volume = parseFloat(drink.volume) || 0;
    const price = parseFloat(drink.price) || 1;
    return price > 0 ? (alcohol * volume) / price : 0;
}
