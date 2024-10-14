class Permission {
    constructor(
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