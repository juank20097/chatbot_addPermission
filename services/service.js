const axios = require('axios');

class MyService {
    constructor(baseURL) {
        // Inicializa la instancia de axios con una URL base para todas las peticiones
        this.api = axios.create({
            baseURL: baseURL,
            timeout: 5000, // Tiempo de espera máximo (opcional)
            headers: {
                'Content-Type': 'application/json',
                // Puedes agregar otros encabezados si es necesario, como tokens de autorización
            }
        });
    }

    // Método para realizar una petición GET
    async getData(endpoint) {
        try {
            const response = await this.api.get(endpoint);
            return response.data; // Retorna la data obtenida de la respuesta
        } catch (error) {
            console.error('Error al hacer la petición GET:', error.message);
            throw error;
        }
    }

    // Método para realizar una petición POST
    async postData(endpoint, data) {
        try {
            const response = await this.api.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error('Error al hacer la petición POST:', error.message);
            throw error;
        }
    }

}

module.exports = MyService;
