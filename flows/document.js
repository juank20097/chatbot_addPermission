const { addKeyword } = require('@bot-whatsapp/bot');
const Permission = require('../models/permission');

let permissionsArray = [];
const permissionInstance = new Permission();

const flowSelectDescriptionOrigen = addKeyword(['Grupo arquitectura'])
    .addAnswer(
        'Gracias por usar el sistema de generación de permisos. ¡Hasta pronto!'
    )

const flowGArquitectura = addKeyword(['Grupo arquitectura'])
    .addAction(() => {
        permissionInstance.ipOrigen = 'Grupo Arquitectura';
    })
    .addAnswer(
    null,
    null,
    null,
    [flowSelectDescriptionOrigen]
)

const flowIpOrigen = addKeyword(['otro'])
    .addAnswer('Has seleccionado Otro.')
    .addAnswer('Por favor, ingrese la IP de Origen:', null, (ctx) => {
        permissionInstance.ipOrigin = ctx.body; 
    },
    [flowSelectDescriptionOrigen]
    );


const flowPrincipal = addKeyword(['documento'])
    .addAnswer('Bienvenido a la generación de Permisos')
    .addAnswer(
        [
            'Selecciona la dirección de IP de Origen',
        ],
        {
            buttons: [
                { body: 'Grupo Arquitectura' },
                { body: 'Otro' },
            ],
        },
        null,
        [flowIpOrigen, flowGArquitectura]
    )

module.exports = {
    flowPrincipal,
    flowIpOrigen,
    flowGArquitectura
};