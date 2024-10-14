const { addKeyword } = require('@bot-whatsapp/bot');
const Permission = require('../models/permission');

let permissionsArray = [];
let permissionInstance = new Permission();

const flowDesGArquitectura = addKeyword(['Grupo Arquitectura'])
    .addAction(() => {
        permissionInstance.descriptionOrigin = 'Grupo Arquitectura';
        return flowSelectAreaOrigen;
    })

const flowDesOrigen = addKeyword(['2','otro'])
    .addAction(() => {
        permissionInstance.descriptionOrigin = 'Grupo Arquitectura';
        return flowSelectAreaOrigen;
    })









const flowGArquitectura = addKeyword(['1','Grupo Arquitectura', 'grupo', 'arquitectura'])
    .addAction(() => {
        permissionInstance.ipOrigin = 'Grupo Arquitectura';
        console.error('IP de Origen guardada: ' + permissionInstance.ipOrigin);
    })
    .addAnswer(
        [
            'Ingresa la opción de Descripción de Origen:',
            '👉 1. Grupo Arquitectura',
            '👉 2. Otro'
        ],
        null,
        null,
        [flowDesOrigen, flowDesGArquitectura]
    )

    const flowIpOrigen = addKeyword(['2', 'otro']) // Detecta la palabra clave "2" o "otro"
    .addAnswer('Has seleccionado la opción "Otro".')
    .addAnswer('Por favor, ingrese la dirección IP de Origen:',{ capture: true },(ctx) => {
        permissionInstance.ipOrigin = ctx.body;
        console.error('IP de Origen guardada:', permissionInstance.ipOrigin);
    })
    .addAnswer(
        [
            'Ingresa la opción de Descripción de Origen:',
            '👉 1. Grupo Arquitectura',
            '👉 2. Otro'
        ],
        null,
        null,
        [flowDesOrigen, flowDesGArquitectura]
    );

const flowPrincipal = addKeyword(['documento'])
    .addAction(() => {
        permissionInstance = new Permission();  
    })
    .addAnswer('Bienvenido a la generación de Permisos')
    .addAnswer(
        [
            'Ingresa la opción de dirección de IP de Origen:',
            '👉 1. Grupo Arquitectura',
            '👉 2. Otro'
        ],
        null,
        null,
        [flowIpOrigen, flowGArquitectura]
    )

module.exports = {
    flowPrincipal,
    flowIpOrigen,
    flowGArquitectura
};