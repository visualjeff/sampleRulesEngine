const faker = require('faker');

const Guber = function () {};

//Function fills up an array with records.  You tell it how many to produce.
Guber.prototype.generateFakePayload = (numberOfRecords, allowDuplicates = false, includeHoles = false) => {
    return new Array(numberOfRecords).fill({}).reduce((accumulator, value, index) => {
	const randomBoolean = (allowDuplicates ? Math.random() < 0.2 : false); //80% true (no duplicate) / 20% false (duplicates)
	if (randomBoolean && index > 0) {
	    //Make a copy of the last entry (essentially a duplicate)
            //console.log('Duplicate record created!');
            accumulator[index] = accumulator[index - 1];
	    return accumulator;
	} else {
	    const holesBoolean = (includeHoles ? Math.random() < 0.2 : false); //80% true (normal) / 20% false (undefined)
            if (holesBoolean) {
                //console.log('injected hole in the Array!');
	        accumulator[index] = undefined;
	    } else {
                //console.log('created unique record!');
	        accumulator[index] = _generateRecord();
	    }
	}
	return accumulator;    
    }, [])
}

//Stub out your fake record below
const _generateRecord = () => {
    return {
        "id": faker.random.number(),
        "category": "UserManagement",
        "correlationId": faker.random.uuid(),
	"result": "success",
        "resultReason": "Successfully added member to group",
	"activityDisplayName": "Add member to group",
	"activityDateTime": "2018-01-09T21:20:02.7215374Z",
	"loggedByService": "Core Directory",
	"initiatedBy": {
  	    "user": {
	        "id": faker.random.uuid(),
	         "displayName": `${faker.name.firstName()} ${faker.name.lastName()}`,
	         "userPrincipalName": faker.internet.email(),
	         "ipAddress": faker.internet.ip()
	    },
	    "app": null
	},
	"targetResources": [{
	    "@odata.type": "#microsoft.graph.TargetResourceGroup",
	    "id": faker.random.uuid(),
	    "displayName": faker.internet.domainName(),
	    "modifiedProperties": [{
	        "displayName": "Action Client Name",
	        "oldValue": null,
	        "newValue": "DirectorySync"
	    }],
	    "groupType": "unifiedGroups"
	}, {
	    "@odata.type": "#microsoft.graph.targetResourceUser",
	    "id": faker.random.uuid(),
	    "displayName": null,
	    "modifiedProperties": [],
	    "userPrincipalName": faker.internet.email()
	}],
	"additionalDetails": [{
	    "key": "Additional Detail Name",
	    "value": "Additional Detail Value"
	}]
    }
}

exports.Guber = new Guber();
