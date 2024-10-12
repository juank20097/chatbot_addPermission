class Permission {
    constructor(
        id = null,
        ipOrigin = '',
        descriptionOrigin = '',
        areaOrigin = '',
        ipDestination = '',
        descriptionDestination = '',
        areaDestination = '',
        protocol = '',
        ports = '',
        duration = ''
    ) {
        this.id = id; // Se asignará automáticamente cuando sea necesario
        this.ipOrigin = ipOrigin;
        this.descriptionOrigin = descriptionOrigin;
        this.areaOrigin = areaOrigin;
        this.ipDestination = ipDestination;
        this.descriptionDestination = descriptionDestination;
        this.areaDestination = areaDestination;
        this.protocol = protocol;
        this.ports = ports;
        this.duration = duration;
    }
}

module.exports = Permission;