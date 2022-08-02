/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Author: Jafar Pashami (jpashami@dal.ca)
// Date: 2022-06-22

//'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const CAUtil = require('./lib/CAUtil.js');
const AppUtil = require('./lib/AppUtil.js');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./lib/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./lib/AppUtil.js');
const walletPath = path.join(__dirname, 'Org1');


// http server config
const http = require("http");
const url = require('url');
const host = '0.0.0.0';
const port = 8952;
let completeProfile = '';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

let identity = 'Org1 Admin'
let networkConnections = {}
let gateway = null
let network = null
var contract = null

async function initialNetwork139() {
    try {
        const ccp = AppUtil.buildJunglekidsOrg1();
        // Connect to a gateway peer
        const wallet = await buildWallet(Wallets, walletPath);
		if (gateway == null)
			gateway = new Gateway();
		if (network == null) {
			console.log("Build a network instance")
			await gateway.connect(ccp, {
				wallet,
				identity: identity,
				discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
			});
        } 
    } catch (err) {
        console.error('Connection to Networking failed',err);
    }
}

async function initialContract139() {
    try {
        // Obtain the smart contract with which our application wants to interact
        console.log('Connecting the Network using a gateway "channel1".')
        network = await gateway.getNetwork('channel1');
        contract = network.getContract('JafarSecAssign');
        networkConnections['JafarSecAssign'] = contract;
        console.log('contract:', contract);
		return contract;
    } catch (err) {
        console.log('Can not connect to contract !',err)
    }
}
// Create a Listener function
const requestListener139 = async function (req, res) {

	const queryObject = url.parse(req.url, true).query;

	console.log("req.url:", req.url)

	let result = ''
	let id = ''
	let value = ''

	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader("Content-Type", "application/json");

	if (req.url.startsWith("/read")) {
		id = queryObject.id
		result = await readAsset(id)
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/update")) {
		value = queryObject.value
		id = queryObject.id
		result = await updateAsset(id, value)
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith("/create")) {
		value = queryObject.value
		id = queryObject.id
		result = await createAsset(id, value)
		res.writeHead(200);
		res.end(result);

	} else if (req.url.startsWith("/delete")) {
		id = queryObject.id
		result = await deleteAsset(id)
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/approve")) {
		value = queryObject.value
		id = queryObject.id
		result = await approveAsset(id, value)
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/reject")) {
		value = queryObject.value
		id = queryObject.id
		result = await rejectAsset(id, value)
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/exist")) {
		id = queryObject.id
		result = await existAsset(id)
		res.writeHead(200);
		res.end(result);
	} else {
		res.writeHead(200);
		res.end("please specify create, update, read or delete operation...");
	}

};
// Functions for creating and updating
async function existAsset(id) {
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		result = await contract.submitTransaction('jafarSecAssignExists139', id);
		console.log(result);
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function createAsset(id, value) {
	console.log('\n--> Evaluate Transaction: createAsset, function returns "true" if an asset with given assetID exist');
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		await contract.submitTransaction('createJafarSecAssign139', id, value);
		result = "asset " + id + " was successfully created!";
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function updateAsset(id, value) {
	console.log('\n--> Evaluate Transaction: updateMyAsset, function returns "true" if an asset with given assetID exist');
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		await contract.submitTransaction('updateJafarSecAssign139', id, value);
		result = "asset " + id + " was successfully updated!";
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function readAsset(id) {
	console.log('\n--> Evaluate Transaction: ReadAsset, function returns "asset1" attributes');
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		result = await contract.evaluateTransaction('readJafarSecAssign139', id);
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function deleteAsset(id) {
	console.log('\n--> Evaluate Transaction: DeleteAsset, function returns "true" if an asset with given assetID exist');
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		await contract.submitTransaction('deleteJafarSecAssign139', id);
		result = "asset " + id + " was successfully deleted!";
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function approveAsset(id, signerName) {
	console.log('\n--> Evaluate Transaction: updateMyAsset, function returns "true" if an asset with given assetID exist');
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		await contract.submitTransaction('approveJafarSecAssign139', id, signerName);
		result = "asset " + id + " was successfully signed by "+signerName;
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

async function rejectAsset(id, signerName) {
	console.log('\n--> Evaluate Transaction: updateMyAsset, function returns "true" if an asset with given assetID exist');
	try {
        let contract = await getConnected139();
        console.log("Connected", contract);
    } catch (err) {
        console.log("Error to connect: ", err);
    }
	let result = '';
	try {
		await contract.submitTransaction('rejectJafarSecAssign139', id, signerName);
		result = "asset " + id + " was successfully signed by "+signerName;
	}
	catch (e) {
		result = e.message;
	}
	console.log(`*** Result: ${result}`);
	return result;
}

// get Connected to smart contract
async function getConnected139() {
	if (!networkConnections['JafarSecAssign']) {
		await initialContract139()
	}
	return networkConnections['JafarSecAssign']
}


// Runs through a server
const server = http.createServer(requestListener139);
server.listen(port, host, async () => {
    await initialNetwork139();
console.log(`Server Address: http://${host}:${port}`);
console.log(`Server Address .........................`);
});
