require('dotenv').config();
const { addKeyword } = require('@bot-whatsapp/bot');
const Permission = require('../models/permission');
const MyService = require('../services/service');

let permissionsArray = [];
let permissionInstance = new Permission();
let name;
let dni;

let documentName=''

const apiService = new MyService('http://'+process.env.URL_SERVICE+':8080/api/form');

/*--------Firma de Documento--------------------------------------------------------------*/

const flowSigner = addKeyword([])
    .addAnswer(
        '🙏 *Gracias por tu paciencia.*' )
    .addAnswer(
            '✅ El proceso ha finalizado con éxito.' )
    .addAnswer(
        '👨‍💻 *Información del Desarrollador:* \n' +
        '📛 *Nombre:* Juan Carlos Estévez Hidalgo \n' +
        '📧 *Correo:* juank20097@gmail.com \n' +
        '📱 *Teléfono:* +593 980365958 \n' +
        '📂 *Repositorio GitHub:* https://github.com/juank20097 \n' )
    

/*--------Validación de otro Permiso--------------------------------------------------------------*/
const flowOtroPermisoNo = addKeyword(['2'])
    .addAnswer(
        '⏳ *Por favor, espera.* \n' +
        '📝 Estamos generando tu documento de permiso. Te lo enviaremos en breve.'
    )
    .addAction(() => {
        (async () => {
            try {
                const permissionsArrayJSON = JSON.stringify(permissionsArray);
                const postResponse = await apiService.postData('/excel/' + dni + '/' + encodeURIComponent(name), permissionsArrayJSON);
                console.log('Datos obtenidos con POST:', postResponse);
                documentName = postResponse.document;
            } catch (error) {
                console.error('Error consumiendo el servicio:', error.message);
            }
        })();
    })
    .addAction(async (ctx, {provider, gotoFlow}) => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(5000);
        // Production
        await provider.sendFile(ctx.from+'@s.whatsapp.net', 'doc/'+documentName)
        // Develop
        // await provider.sendFile(ctx.from+'@s.whatsapp.net', 'doc/GRI-GTIC-P01-F02_SolicitudPermisos_2024-10-24_110539.xlsx')
        return gotoFlow(flowSigner)
    }
    );

const flowOtroPermisoSi = addKeyword(['1'])
.addAction((ctx, { gotoFlow }) => {
    console.log('⚠️ Cantidad de permisos actuales:', permissionsArray.length);
    return gotoFlow(flowSelectIpOrigen)
},
)

/*--------Verificación--------------------------------------------------------------*/

const flowVerNo = addKeyword(['2'])
.addAnswer('❌ *Lamentamos que los datos ingresados no sean correctos.*\n' +
    'Por favor, vuelve a ingresar los datos correspondientes:')
.addAction((ctx, { gotoFlow }) => {
    console.log('🔄 Redirigiendo al flujo para ingresar datos nuevamente...');
    console.log('⚠️ Cantidad de permisos actuales:', permissionsArray.length);
    return gotoFlow(flowSelectIpOrigen)
},
)

const flowVerSi = addKeyword(['1'])
.addAction(() => {
    permissionsArray.push(permissionInstance)
    console.log('✅ Registro guardado exitosamente.');
})
.addAnswer(
    [
        '🔄 *¿Deseas ingresar otro registro?*',
        '👉 *1.* Sí',
        '👉 *2.* No'
    ],
    { capture: true }, 
        async (ctx, { flowDynamic, fallBack }) => {
            const respuesta = ctx.body.trim(); 
            console.log('Opción de otroPermiso seleccionada:', respuesta); 
            if (respuesta === '1') {
                return await flowDynamic('✅ Has seleccionado *Sí*.'); 
            } else if (respuesta === '2') {
                return await flowDynamic('✅ Has seleccionado *No*.'); 
            } else {
                return fallBack(); 
            }
        },
    [flowOtroPermisoSi,flowOtroPermisoNo]
)

const flowVerificacion = addKeyword([permissionInstance.duration,'1'])
.addAction(async (ctx, { flowDynamic }) => {
    const respuesta = [
        'Esta información es la guardada actualmente:',
        `*IP de Origen*: ${permissionInstance.ipOrigin || 'No definida'}`,
        `*Descripción de Origen*: ${permissionInstance.descriptionOrigin || 'No definida'}`,
        `*Área de Origen*: ${permissionInstance.areaOrigin || 'No definida'}`,
        `*IP de Destino*: ${permissionInstance.ipDestination || 'No definida'}`,
        `*Descripción de Destino*: ${permissionInstance.descriptionDestination || 'No definida'}`,
        `*Área de Destino*: ${permissionInstance.areaDestination || 'No definida'}`,
        `*Protocolo*: ${permissionInstance.protocol || 'No definida'}`,
        `*Puertos*: ${permissionInstance.ports || 'No definida'}`,
        `*Duración*: ${permissionInstance.duration || 'No definida'}`,
    ].join('\n');
    return await flowDynamic([{ body: respuesta }]);
},
)
.addAnswer(
    [
        '🔍 *El registro almacenado es correcto?*',
        '👉 *1.* Sí',
        '👉 *2.* No'
    ],
    { capture: true }, 
    async (ctx, { flowDynamic, fallBack }) => {
        const respuesta = ctx.body.trim();
        console.log('Opción de almacenado seleccionada:', respuesta);
        if (respuesta === '1') {
            return await flowDynamic('✅ Has seleccionado *Si*.');
        } else if (respuesta === '2') {
            return await flowDynamic('✅ Has seleccionado *No*.');
        } else {
            return fallBack();
        }
    },
    [flowVerSi,flowVerNo]
    )

/*--------Duración--------------------------------------------------------------*/

const flowPermanente = addKeyword(['1'])
    .addAction(() => {
        permissionInstance.duration = 'Permanente';
        console.log('✅ Duración guardada:', permissionInstance.duration);
    })
    .addAction(async (ctx, { flowDynamic }) => {
        const respuesta = [
            'Esta información es la guardada actualmente:',
            `*IP de Origen*: ${permissionInstance.ipOrigin || 'No definida'}`,
            `*Descripción de Origen*: ${permissionInstance.descriptionOrigin || 'No definida'}`,
            `*Área de Origen*: ${permissionInstance.areaOrigin || 'No definida'}`,
            `*IP de Destino*: ${permissionInstance.ipDestination || 'No definida'}`,
            `*Descripción de Destino*: ${permissionInstance.descriptionDestination || 'No definida'}`,
            `*Área de Destino*: ${permissionInstance.areaDestination || 'No definida'}`,
            `*Protocolo*: ${permissionInstance.protocol || 'No definida'}`,
            `*Puertos*: ${permissionInstance.ports || 'No definida'}`,
            `*Duración*: ${permissionInstance.duration || 'No definida'}`,
        ].join('\n');
        return await flowDynamic([{ body: respuesta }]);
    },
    )
    .addAnswer(
        [
            '🔍 *El registro almacenado es correcto?*',
            '👉 *1.* Sí',
            '👉 *2.* No'
        ],
        { capture: true }, 
        async (ctx, { flowDynamic, fallBack }) => {
            const respuesta = ctx.body.trim();
            console.log('Opción de almacenado seleccionada:', respuesta);
            if (respuesta === '1') {
                return await flowDynamic('✅ Has seleccionado *Si*.');
            } else if (respuesta === '2') {
                return await flowDynamic('✅ Has seleccionado *No*.');
            } else {
                return fallBack();
            }
        },
        [flowVerSi,flowVerNo]
    )


const flowDuracion = addKeyword(['2']) 
    .addAnswer(
        '⏳ *Por favor, ingresa la duración respectiva:*',
        { capture: true }, 
        (ctx) => {
            permissionInstance.duration = ctx.body.trim();
            console.log('✅ Duración guardada:', permissionInstance.duration);
        },
        [flowVerificacion] 
    );

const flowSelectDuracion = addKeyword([permissionInstance.protocol,'1'])
.addAnswer(
    [
        '⏳ *Por favor, ingresa la duración respectiva:*',
        '👉 *1.* Permanente',
        '👉 *2.* Otro'
    ],
    { capture: true }, 
    async (ctx, { flowDynamic, fallBack }) => {
        const respuesta = ctx.body.trim();
        console.log('Opción de duración seleccionada:', respuesta);

        if (respuesta === '1') {
            return await flowDynamic('✅ Has seleccionado *Permanente*.');
        } else if (respuesta === '2') {
            return await flowDynamic('✅ Has seleccionado *Otro*.');
        } else {
            return fallBack();
        }
    },
    [flowDuracion,flowPermanente]
)

/*--------Puerto--------------------------------------------------------------*/

const flowPuerto = addKeyword([permissionInstance.protocol])
.addAnswer(
    '🔌 *Por favor, ingresa los puertos respectivos:*',
    { capture: true },
    (ctx) => {
        permissionInstance.ports = ctx.body.trim(); 
        console.log('✅ Puertos guardados:', permissionInstance.ports); 
    },
    [flowSelectDuracion]
);

/*--------Protocolo--------------------------------------------------------------*/

const flowHTTP = addKeyword(['1'])
    .addAction(() => {
        permissionInstance.protocol = 'HTTP, HTTPS'; 
        console.log('✅ Protocolo guardado:', permissionInstance.protocol);
    })
    .addAnswer(
        '🔌 *Por favor, ingresa los puertos respectivos:*',
        { capture: true },
        (ctx) => {
            permissionInstance.ports = ctx.body.trim(); 
            console.log('✅ Puertos guardados:', permissionInstance.ports); 
        },
        [flowSelectDuracion]
    );

const flowProtocolo = addKeyword(['2']) 
    .addAnswer('Has seleccionado la opción "Otro".')
    .addAnswer(
        '🔧 *Por favor, ingresa el protocolo respectivo:*',
        { capture: true },
        (ctx) => {
            permissionInstance.protocol = ctx.body.trim();
            console.log('✅ Protocolo guardado:', permissionInstance.protocol);
        },
        [flowPuerto]
    );

const flowSelectProtocolo = addKeyword([permissionInstance.areaDestination])
    .addAnswer(
    [
        '🔍 A continuación, selecciona el protocolo respectivo:',
        '👉 *1*. HTTP, HTTPS',
        '👉 *2*. Otro'
    ],
    { capture: true }, 
    async (ctx, { flowDynamic, fallBack }) => {
        const respuesta = ctx.body.trim();
        console.log('Opción de protocolo seleccionada:', respuesta);

        if (respuesta === '1') {
            return await flowDynamic('✅ Has seleccionado *HTTP, HTTPS*.');
        } else if (respuesta === '2') {
            return await flowDynamic('✅ Has seleccionado *Otro*.');
        } else {
            return fallBack();
        }
    },
    [flowProtocolo, flowHTTP]
    );

/*--------Área de Destino--------------------------------------------------------------*/

const flowAreaDestino = addKeyword([permissionInstance.descriptionDestination])
    .addAnswer(
        '📍 *Por favor, ingresa el área de destino:*',
        { capture: true }, 
        (ctx) => {
            permissionInstance.areaDestination = ctx.body.trim(); 
            console.log('✅ Área de Destino guardada:', permissionInstance.areaDestination); 
        },
        [flowSelectProtocolo] 
    );

/*--------Descripción de Destino--------------------------------------------------------------*/

const flowDesDestino = addKeyword([permissionInstance.ipDestination])
    .addAnswer(
        '✏️ *Por favor, ingresa la descripción del destino:*',
        { capture: true },
        (ctx) => {
            permissionInstance.descriptionDestination = ctx.body.trim();
            console.log('✅ Descripción de Destino guardada:', permissionInstance.descriptionDestination);
        },
        [flowAreaDestino] 
    );

/*--------Ip de Destino--------------------------------------------------------------*/

const flowIpDestino = addKeyword([permissionInstance.areaOrigin,'1'])
.addAnswer(
    '🌐 *Por favor, ingresa la IP de Destino:*',
    { capture: true },
    (ctx) => {
        permissionInstance.ipDestination = ctx.body.trim(); 
        console.log('✅ IP de Destino guardada:', permissionInstance.ipDestination);
    },
    [flowDesDestino] 
);

/*--------Área de Origen--------------------------------------------------------------*/

const flowAreaSDNAS = addKeyword(['1'])
    .addAction(() => {
        permissionInstance.areaOrigin = 'SDNAS';
        console.log('✅ Área de Origen guardada: ' + permissionInstance.areaOrigin);
    })
    .addAnswer(
        '🌐 *Por favor, ingresa la IP de Destino:*',
        { capture: true },
        (ctx) => {
            permissionInstance.ipDestination = ctx.body.trim(); 
            console.log('✅ IP de Destino guardada:', permissionInstance.ipDestination);
        },
        [flowDesDestino] 
    );

const flowAreaOrigen = addKeyword(['2'])
    .addAnswer(
        '✏️ *Por favor, ingresa el nombre del área de origen:*',
        { capture: true },
        (ctx) => {
            permissionInstance.areaOrigin = ctx.body.trim();
            console.log('✅ Área de Origen guardada:', permissionInstance.areaOrigin);
        },
        [flowIpDestino]
    );

const flowSelectAreaOrigen = addKeyword([permissionInstance.descriptionOrigin,'1'])
.addAnswer(
    [
        '🔍 A continuación, selecciona el área de origen:',
        '👉 *1*. SDNAS',
        '👉 *2*. Otro'
    ],
    { capture: true }, 
    async (ctx, { flowDynamic, fallBack }) => {
        const respuesta = ctx.body.trim();
        console.log('Área seleccionada:', respuesta);

        if (respuesta === '1') {
            return await flowDynamic('✅ Has seleccionado *SDNAS*.');
        } else if (respuesta === '2') {
            return await flowDynamic('✅ Has seleccionado *Otra área*.');
        } else {
            return fallBack();
        }
    },
    [flowAreaOrigen, flowAreaSDNAS]
)

/*--------Descripción de Origen--------------------------------------------------------------*/

const flowDesGArquitectura = addKeyword(['1'])
    .addAction((ctx) => {
        permissionInstance.descriptionOrigin = 'Grupo Arquitectura';
        console.log('✅ Descripción de Origen guardada: ' + permissionInstance.descriptionOrigin);
    })
    .addAnswer(
        [
            '🔍 A continuación, selecciona el área de origen:',
            '👉 *1*. SDNAS',
            '👉 *2*. Otro'
        ],
        { capture: true }, 
        async (ctx, { flowDynamic, fallBack }) => {
            const respuesta = ctx.body.trim();
            console.log('Área seleccionada:', respuesta);

            if (respuesta === '1') {
                return await flowDynamic('✅ Has seleccionado *SDNAS*.');
            } else if (respuesta === '2') {
                return await flowDynamic('✅ Has seleccionado *Otra área*.');
            } else {
                return fallBack();
            }
        },
        [flowAreaOrigen, flowAreaSDNAS]
    )

const flowDesOrigen = addKeyword(['2'])
    .addAnswer(
        '✏️ *Por favor, ingresa la descripción del origen:*', 
        { capture: true }, 
        (ctx) => {
            permissionInstance.descriptionOrigin = ctx.body.trim();
            console.log('✅ Descripción de Origen guardada:', permissionInstance.descriptionOrigin);
        },
        [flowSelectAreaOrigen]
    );

const flowSelectDesOrigen = addKeyword([permissionInstance.ipOrigin,'1'])
.addAnswer(
    [
        '🔍 A continuación, selecciona la descripción del origen:',
        '👉 *1*. Grupo Arquitectura',
        '👉 *2*. Otra descripción'
    ],
    { capture: true },
    async (ctx, { flowDynamic, fallBack }) => {
        const respuesta = ctx.body.trim();
        console.log('Opción de descripción seleccionada:', respuesta);

        if (respuesta === '1') {
            return await flowDynamic('✅ Has seleccionado *Grupo Arquitectura*.');
        } else if (respuesta === '2') {
            return await flowDynamic('✅ Has seleccionado *Otra descripción*.');
        } else {
            return fallBack();
        }
    },
    [flowDesOrigen, flowDesGArquitectura]
)

     /*--------IP de Origen-------------------------------------------------------------------*/

const flowGArquitectura = addKeyword(['1'])
    .addAction((ctx) => {
        permissionInstance.ipOrigin = 'Grupo Arquitectura';
        console.log('✅ IP de Origen guardada: ' + permissionInstance.ipOrigin);
    })
    .addAnswer(
        [
            '🔍 A continuación, selecciona la descripción del origen:',
            '👉 *1*. Grupo Arquitectura',
            '👉 *2*. Otra descripción'
        ],
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            const respuesta = ctx.body.trim();
            console.log('Opción de descripción seleccionada:', respuesta);

            if (respuesta === '1') {
                return await flowDynamic('✅ Has seleccionado *Grupo Arquitectura*.');
            } else if (respuesta === '2') {
                return await flowDynamic('✅ Has seleccionado *Otra descripción*.');
            } else {
                return fallBack();
            }
        },
        [flowDesOrigen, flowDesGArquitectura]
    )

const flowIpOrigen = addKeyword(['2'])
    .addAnswer(
        '🔍 Por favor, ingresa la *dirección IP de Origen*: ',
        { capture: true }, 
        (ctx) => {
            permissionInstance.ipOrigin = ctx.body.trim();
            console.log('✅ Dirección IP de Origen guardada:', permissionInstance.ipOrigin);
        },
        [flowSelectDesOrigen]
    );

const flowSelectIpOrigen = addKeyword([]) 
    .addAction(() => {
        permissionInstance = new Permission();  
        console.log('🔄 Instancia de permisos creada.');
    })    
    .addAnswer(
        [
            '🔐 Vamos a configurar la *dirección de IP de origen* para los permisos.',
            '',
            'Por favor, selecciona una de las siguientes opciones:',
            '👉 *1*. Grupo Arquitectura',
            '👉 *2*. Otra dirección de IP'
        ],
        { capture: true },
        async (ctx, { flowDynamic, fallBack }) => {
            const respuesta = ctx.body.trim();
            console.log('Respuesta capturada en el flujo principal:', respuesta);
            if (respuesta === '1') {
                return await flowDynamic('✅ Has seleccionado *Grupo Arquitectura*.');
            } else if (respuesta === '2') {
                return await flowDynamic('✅ Has seleccionado *Otra dirección de IP*');
            } else {
                return fallBack();
            }
        },
        [flowGArquitectura, flowIpOrigen]
    )

const flowPrincipal = addKeyword(['permiso'])
    .addAction(() => {
        permissionsArray= [];
        permissionInstance = new Permission();  
        console.log('🔄 Instancia de permisos creada y array de permisos reiniciado.');
    })
    .addAnswer('👋 ¡Bienvenido al sistema de generación de permisos! 🎉')
    .addAnswer('😊 Antes de comenzar, necesitamos saber tu nombre completo.')
    .addAnswer(
        '✏️ *Por favor, escríbelo a continuación:*',
        { capture: true },
        async (ctx,{ flowDynamic }) => {
            name = ctx.body.trim(); 
            console.log('✅ Nombre guardado:', name);
            await flowDynamic(`😊 ¡Gracias, *${name}*! Ahora necesitamos tu número de cédula para continuar.`);
        }
    )
    .addAnswer(
        '*Por favor, ingrésalo a continuación:*',
        { capture: true },
        (ctx) => {
            dni = ctx.body.trim(); 
            console.log('✅ Dni guardado:', dni);
        },
        [flowSelectIpOrigen]
    )

module.exports = {
    flowPrincipal
};