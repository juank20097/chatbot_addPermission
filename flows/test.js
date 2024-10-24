const Permission = require('../models/permission');
const MyService = require('../services/service');

let permissionsArray = [];
let permissionInstance = new Permission();

const apiService = new MyService('http://localhost:8080/api/form');

permissionInstance.ipOrigin='Grupo Arquitectura',
permissionInstance.areaOrigin='SDNAS',
permissionInstance.descriptionOrigin='Grupo Arquitectura',
permissionInstance.ipDestination='192.168.1.1',
permissionInstance.descriptionDestination='DNTI',
permissionInstance.areaDestination='DNTI',
permissionInstance.protocol='HTTP,HTTPS',
permissionInstance.ports='22,443,8080',
permissionInstance.duration='Permanente'


permissionsArray.push(permissionInstance);
permissionsArray.push(permissionInstance);
permissionsArray.push(permissionInstance);
permissionsArray.push(permissionInstance);
permissionsArray.push(permissionInstance);

(async () => {
    try {
        const permissionsArrayJSON = JSON.stringify(permissionsArray);
        const postResponse = await apiService.postData('/excel', permissionsArrayJSON);
        console.log('Datos obtenidos con POST:', postResponse);

    } catch (error) {
        console.error('Error consumiendo el servicio:', error.message);
    }
})();