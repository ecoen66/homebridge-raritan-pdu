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
If you're already running `homebridge` on your system,
then you already have a `~/.homebridge/config.json` file and no configuration is needed!

This is a "dynamic" platform plugin,
so it will automatically look for SNMP agents on the local network that respond to SNMPv2/public.
Future versions may allow you to specify addressing and authentication information for individual agents.

If this is your first time with `homebridge`,
this will suffice:

	{
		"bridge":
			{ "name": "Homebridge",
				"username": "CC:22:3D:E3:CE:30",
				"port": 51826,
				"pin": "031-45-154"
      		},
		"description": "",
		"accessories": [
        	{
            	"accessory": "Raritan PDU",
            	"name": "Lab PDU",
            	"ip": "192.168.1.70",
            	"snmp_community": "RW"
        	}
      	]
    }

# Supported Agents
The only tested Raritan PDU model for this plugin is the one that I have in my lab, the PX-5475.
This is accomplished using the [PX-PDU-MIB](https://d3b2us605ptvk2.cloudfront.net/download/PX/v1.5.13/PX-1.5.13-MIB.txt).

