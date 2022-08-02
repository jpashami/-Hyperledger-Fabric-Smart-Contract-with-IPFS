
import { ethers } from "ethers";


// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

let resultContent = '';
// http server config
const http = require("http");
const url = require('url');
const host = '0.0.0.0';
const port = 2020;

// Create a Listener function
const requestListener139 = async function (req, res) {

	const queryObject = url.parse(req.url, true).query;

	console.log("req.url:", req.url)

	let result = '';
	let id = '';
	let value = '';
  let key = '';
  let hash = '';
  let signature = '';

	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader("Content-Type", "application/json");

	if (req.url.startsWith("/hash")) {
		value = queryObject.value;
    result = await hashMessage139(value);
    console.log(result);
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/sign")) {
    key = queryObject.key;
    value = queryObject.value;
		result = await signMessage139(key, value);
        console.log(result);
		res.writeHead(200);
		res.end(result);
	} else if (req.url.startsWith("/verify")) {
    hash = queryObject.hash;
    signature = queryObject.signature;
		result = await verifyMessage139(hash, signature);
    console.log(result);
		res.writeHead(200);
		res.end(result);
	} else {
		res.writeHead(200);
		res.end("please specify create, update, read or delete operation...");
	}
} ;


// Runs through a server
const server = http.createServer(requestListener139);
server.listen(port, host, async () => {
    console.log(`Server Address: http://localhost:${port}`);
    console.log(`Server Address .........................`);
});

async function hashMessage139(data) {
	const hashedMessage = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(data)).toString('hex');
  console.log('Hashed Message: ',hashedMessage);
	return hashedMessage;
}

async function signMessage139(key , data) {
  // Hash the content
  let hashedMessage = await hashMessage139(data)
  console.log(hashedMessage);
  // Create a wallet to sign the message with Privatekey
  let privateKey = key ; //'88baa3fc6093b4e2ac3af01e6c7df81d490afe00af8e4eff57911549ded032fe';
  let wallet = new ethers.Wallet(privateKey);
  // Sign the string message
  let signatureContent = await wallet.signMessage(hashedMessage);  
  console.log(signatureContent);
  return signatureContent;
}

async function verifyMessage139(hashedMessage, signatureContent) {
  let signingAddress = ethers.utils.verifyMessage(hashedMessage, signatureContent);
  console.log('Signing Address: ', signingAddress); 
  return signingAddress;
}


// test:
// PrivateKey: 88baa3fc6093b4e2ac3af01e6c7df81d490afe00af8e4eff57911549ded032fe
// signingAddress: 0xd7500804ECE4D1EA1Ba97d634C3bA62e353d9f3D
// HashedMessage: 0x1c8aff950685c2ed4bc3174f3472287b56d9517b9c948127319a09a7a36deac8
// Signature: 0xc702dfc11cf4ecb0a82f6c6e531fb0a507232641a1083b0a15d5582ac0f3219162f29c28a6acedb29f775d353070d2b42bf35e34eea48684100f7c6b57d646bc1b