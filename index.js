"use strict";
const {promisify} = require("es6-promisify");
var snmp = require("net-snmp");

var Characteristic, Service;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-raritan-pdu", "Raritan PDU", PDUAccessory);
}

// For a Raritan 24-port PDU model PX-5475

class PDUAccessory {

	constructor(log, config) {
		this.log = log;
		this.services = [];
		this.manufacturer = config.manufacturer;
 		this.model = config.model;
 		this.serial = config.serial;
 		this.firmware = config.firmware;
 		this.count = config.count;
		for (var i = 0; i < this.count; i++) {
			var service = new Service.Outlet(`Outlet ${i}`, i);
			this.services.push(service);

			service.getCharacteristic(Characteristic.On)
				.on('get', this.getOn.bind(this, i))
				.on('set', this.setOn.bind(this, i));
		}

		this.snmp = snmp.createSession(config.ip, config.snmp_community);
		this.snmp_get = promisify(this.snmp.get.bind(this.snmp));
		this.snmp_set = promisify(this.snmp.set.bind(this.snmp));

		var outlet_oids = [];
		for (var i = 0; i < this.count; i++) {
			outlet_oids.push(`1.3.6.1.4.1.13742.4.1.2.2.1.2.${i + 1}`);
		}
		var promises = [];
		for (var i = 0; i < outlet_oids.length; i += 2) {
			var slice = outlet_oids.slice(i, i + 2);
			promises.push(this.snmp_get(slice))
		}
		Promise.all(promises)
			.then(results => {
				var names = results
					.reduce((prev, current) => {
						return prev.concat(current);
					}, [])
					.map(varbind => {
						return varbind.value.toString().split(",")[0];
					});
				for (var i = 0; i < names.length; i++) {
					var name = names[i]
					service = this.services[i];
					service.displayName = name;
					service.setCharacteristic(Characteristic.Name, name);
				}
				this.log.info('Successfully loaded outlet names: ', names.join(', '));
			})
			.catch(error => {
				this.log.error(error.stack);
			});
	}

	getServices() {
	
		// Create Accessory Informaton Service
		var informationService = new Service.AccessoryInformation();
		if (this.manufacturer) informationService.setCharacteristic(Characteristic.Manufacturer, this.manufacturer);
		if (this.model) informationService.setCharacteristic(Characteristic.Model, this.model);
		if (this.serial) informationService.setCharacteristic(Characteristic.SerialNumber, this.serial);
		if (this.firmware) informationService.setCharacteristic(Characteristic.FirmwareRevision, this.firmware);

		this.services.push(informationService);
		
		return this.services;
	}

	getOn(index, callback) {
		this.log.info(`Retrieving socket ${index}.`);
		var switch_oids = [];
		switch_oids.push(`1.3.6.1.4.1.13742.4.1.2.2.1.3.${index + 1}`);
		this.snmp_get(switch_oids)
			.then(varbinds => {
				var on = varbinds[0].value == 1
				this.log.info(`Socket ${index} is ${on}.`);
				callback(null, on);
			})
			.catch(error => {
				this.log.info(`Error retrieving socket ${index} status.`);
				callback(error, null);
			});
	}

	setOn(index, on, callback) {
		this.log.info(`Switching socket ${index} to ${on}.`);    
		var switch_oid = `1.3.6.1.4.1.13742.4.1.2.2.1.3.${index + 1}`;
		var toggle = on ? 1 : 0;
		var snmp_parms = [
					{
						oid: switch_oid,
						type: snmp.ObjectType.Integer,
						value: toggle
					}
				];
		this.snmp_set(snmp_parms)
			.then(() => {
				this.log.info(`Successfully switched socket ${index} to ${on}.`);
				callback(null);
			})
			.catch(error => {
				this.log.error(`Error switching socket ${index} to ${on}.`);
				callback(error);
			});
	}

}
