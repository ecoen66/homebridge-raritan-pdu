# homebridge-raritan-pdu
A [Raritan](https://www.raritan.com) PX-5475 PDU plugin for
[Homebridge](https://github.com/nfarina/homebridge).

This code is heavily based on the work of invliD's [homebridge-digipower-pdu](https://github.com/invliD/homebridge-digipower-pdu) accessory.

# Installation
Run these commands:

    % sudo npm install -g homebridge
    % sudo npm install -g homebridge-raritan-pdu


NB: If you install homebridge like this:

    sudo npm install -g --unsafe-perm homebridge

Then all subsequent installations must be like this:

    sudo npm install -g --unsafe-perm homebridge-raritan-pdu

# Configuration

Example accessory config (needs to be added to the homebridge config.json):
 ...

		"accessories": [
        	{
            "name": "Lab PDU",
            "ip": "192.168.1.70",
            "snmp_community": "RW",
            "outlet_count": 24,
            "accessory": "Raritan PDU",
            "manufacturer": "Raritan-PDU",
            "model": "PX-5475",
            "serial": "PL70750024",
            "firmware": "01.03.12.9123"
        	}
      	]
 ...

### Config Explanation:

Field           			| Description
----------------------------|------------
**accessory**   			| (required) Must always be "Raritan PDU".
**name**					| (required) The name you want to use for control of the PDU accessory.
**ip_address**  			| (required) The internal ip address of your PDU.
**snmp_community**  		| (required) The Read/Write community string for your PDU.
**outlet_count**  			| (required) The number of outlets in your PDU. This is an Integer, so no quotes around this number.
**manufacturer**			| (optional) This shows up in the homekit accessory Characteristics.
**model**					| (optional) This shows up in the homekit accessory Characteristics.
**serial**					| (optional) This shows up in the homekit accessory Characteristics.
**firmware**				| (optional) This shows up in the homekit accessory Characteristics.

# Supported Agents
The only tested Raritan PDU model for this plugin is the one that I have in my lab, the PX-5475.
This is accomplished using the [PX-PDU-MIB](https://d3b2us605ptvk2.cloudfront.net/download/PX/v1.5.13/PX-1.5.13-MIB.txt).

