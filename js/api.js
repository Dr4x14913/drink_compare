// Open Food Facts API Client
class OpenFoodFacts {
    constructor() {
        this.API_BASE = 'https://world.openfoodfacts.net/api/v2';
    }

    async getProduct(code) {
        try {
            const url = `${this.API_BASE}/product/${code}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Product not found');
                }
                throw new Error('Request failed');
            }
            
            const data = await response.json();
            const product = data.product || {};
            
            const result = {
                name: product.product_name,
                volume: product.product_quantity,
                alcohol: product.nutriments?.alcohol,
                error: null
            };
            
            // Validate returned data
            if (!result.name) {
                result.error = 'Product name not found in API response';
            }
            if (!result.volume) {
                if (result.error) {
                    result.error += ', volume not found';
                } else {
                    result.error = 'Volume not found in API response';
                }
            }
            if (result.alcohol === undefined || result.alcohol === null) {
                if (result.error) {
                    result.error += ', alcohol content not found';
                } else {
                    result.error = 'Alcohol content not found in API response';
                }
                result.alcohol = null;
            }
            
            return result;
        } catch (error) {
            console.error('Error fetching product:', error);
            return { 
                name: null, 
                volume: null, 
                alcohol: null,
                error: error.message || 'Failed to fetch product data' 
            };
        }
    }
}
