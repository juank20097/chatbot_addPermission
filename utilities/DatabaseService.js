require('dotenv').config();
const { Client } = require('pg');

class DatabaseService {
    constructor() {
        // Configurar la conexión a la base de datos
        this.client = new Client({
            host: process.env.POSTGRES_DB_HOST,
            user: process.env.POSTGRES_DB_USER,
            database: process.env.POSTGRES_DB_NAME,
            password: process.env.POSTGRES_DB_PASSWORD,
            port: process.env.POSTGRES_DB_PORT,
        });
    }

    // Método para conectar a la base de datos
    async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
        }
    }

    // Método para ejecutar consultas SQL
    async executeQuery(query) {
        try {
            await this.client.query(query);
            console.log('🆗 Alter-Table ejecutado con éxito');
        } catch (error) {
            console.error('Error ejecutando la consulta:', error.stack);
        }
    }

    async disconnect() {
        try {
            await this.client.end();
        } catch (error) {
            console.error('Error al cerrar la conexión:', error);
        }
    }

     async alterTable() {
        const sqlQuery = `
            ALTER TABLE history
            ALTER COLUMN refserialize DROP NOT NULL;
        `;
        try {
            await this.connect();
            await this.executeQuery(sqlQuery);
        } catch (error) {
            console.error('Error ejecutando el ALTER TABLE:', error);
        } finally {
            await this.disconnect();
        }
    }
}

module.exports = DatabaseService;
