// Open Food Facts API Client
class OpenFoodFacts {
    constructor() {
        this.API_BASE = 'https://world.openfoodfacts.net/api/v2';
    }

    async getProduct(code) {
        try {
            const url = `${this.API_BASE}/product/${code}`;
            const response = await fetch(url, { timeout: 10000 });
            if (!response.ok) throw new Error('Request failed');
            const data = await response.json();
            const product = data.product || {};
            
            return {
                name: product.product_name,
                volume: product.product_quantity,
                alcohol: product.nutriments?.alcohol,
            };
        } catch (error) {
            console.error('Error fetching product:', error);
            return { name: null, volume: null, alcohol: null };
        }
    }
}
