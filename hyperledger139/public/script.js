
// Script for calling Rest APIs from localserver created by index.js

document.addEventListener("DOMContentLoaded", function () {

	document.getElementById('buyerApprove').disabled = true;
	document.getElementById('sellerApprove').disabled = true;

	document.getElementById("readContract").addEventListener("click", async function () {
		readStatus139();
	});

	document.getElementById("InsertContract").addEventListener("click", async function () {
		initContract139();
	});

	document.getElementById("buyerApprove").addEventListener("click", async function () {
		approveContract139('buyer');
	});

	document.getElementById("buyerReject").addEventListener("click", async function () {
		rejectContract139('buyer');
	});
	
	document.getElementById("sellerApprove").addEventListener("click", async function () {
		approveContract139('seller');
	});

	document.getElementById("sellerReject").addEventListener("click", async function () {
		rejectContract139('seller');
	});
	
	document.getElementById("deleteContract").addEventListener("click", async function () {
		deleteContract139();
	});
	
	document.getElementById("readIPFScontent").addEventListener("click", async function () {
		const result = await ipfsFetch139();
		document.getElementById('value').value = result;
	});

	document.getElementById("buyerCheckGenuine").addEventListener("click", async function () {
		await checkDocumentGen139('buyer');
	});

	document.getElementById("sellerCheckGenuine").addEventListener("click", async function () {
		await checkDocumentGen139('seller');
	});

	// document.getElementById("checkBuyerSig").addEventListener("click", async function () {
	// 	await verifyMessage139('buyer');
	// });
});

async function readStatus139() {
	let statusData = '';
	const contractId = document.getElementById('id').value;
	await fetch(`http://localhost:8952/read?id=${contractId}`)
	.then(function (response) {
		return response.json();
	})
	.then(function(data) {
		statusData = data;
		console.log("Contract Status reading successfully finished: " + data);
		// writing the data to front
		const html = `
        <li><b> Contract ID:</b> ${data.id}</li>
        <li><b>Contract Status:</b> ${data.assetStatus}</li>
		<li><b>Contract Hash Value:</b> ${data.value}</li>
		`; 
		// <li><b>Buyer Signature:</b> ${data.buyerSignature}</li>
		// <li><b>Seller Signature:</b> ${data.sellerSignature}</li>
		
		document.getElementById("contractStatus").innerHTML = html;
	}).catch (function (err) {
		console.error(err)
	});
	return statusData;
}

async function initContract139() {
	const contractId = document.getElementById('id').value;
	console.log(contractId);
	let content = document.getElementById('value').value;
	console.log(content);
	const hashValue = await hashMessage139(content);
	console.log('hash value: ' + hashValue);
	const contractExists = await fetch(`http://localhost:8952/exist?id=${contractId}`)
	.then(function (response) {
		console.log(response);
		return response.json();
	})
	console.log(contractExists);
	// const existValue = false; //existValueJson.value;
	if (!contractExists) {
		await fetch(`http://localhost:8952/create?id=${contractId}&value=${hashValue}`)
		.then(() => {
		console.log("Successfully Initialized");
		})
		.catch (err => {
			console.log("contract initialization error:", err);
		});
	} else {
		if (confirm("Contract exists. Are you going to update this contract?")) {
			await fetch(`http://localhost:8952/update?id=${contractId}&value=${hashValue}`)
			.then(() => {
			console.log("Successfully Updated");
			})
			.catch(err => {
				console.log("Error in updating", err);
			})			
		} else {
			console.log("Nothing happened. Please try anther contract ID.");
		}
	}
	readStatus139();
}

async function checkDocumentGen139(signerName) {
    const documentContent = await ipfsFetch139();
    console.log(documentContent);
    // hash it
	const hashedMessage = await hashMessage139(documentContent);
    console.log('IPFS Document Hash: ',hashedMessage);
    // retrieve the hash from the blockchain
    let documentData = await readStatus139();
    let storedHash = documentData.value;
    console.log("Stored Hash on the Blockchain: ",storedHash);
    //compare the document hash and stored hash to verify or cancel the request 
    if (storedHash === hashedMessage) {
      console.log("Hash Verified! Document on IPFS is genuine.");
	  document.getElementById(`${signerName}Notification_1`).innerHTML = "<em>Hash <strong>Verified!</strong> Document on IPFS is genuine.</em>";
	  document.getElementById(`${signerName}Approve`).disabled = false;
    } else {
      console.log("Hash verification Failed! Document on IPFS is fake.");
	  document.getElementById(`${signerName}Notification_1`).innerHTML = "<em>Hash verification <strong>Failed!</strong> Document on IPFS is fake.</em>";
    }
  }



async function approveContract139(signerName) {
	
	let documentContent = await ipfsFetch139()
    document.getElementById('value').value = documentContent;
    // hash it
	let hashedMessage = await hashMessage139(document.getElementById('value').value);
    console.log('hashedMessage: ' + hashedMessage);
	if (signerName == 'buyer') {  
		let privateKey = '88baa3fc6093b4e2ac3af01e6c7df81d490afe00af8e4eff57911549ded032fe';
		console.log("Signer is Buyer!");
		const signature = await signMessage139(privateKey, hashedMessage);
		console.log('Signature: ' + signature);
		document.getElementById('buyerNotification_2').innerHTML =  `<em>Signed successfully by buyer. Signature: </em>${signature}`;
	} else if (signerName == 'seller') {
		let privateKey = '840b0379ae14f25992c24971a1cebf4a6662fd3c542e79e338bd331f2b23228c';
		console.log("Signer is SELLER!");
		const signature = await signMessage139(privateKey, hashedMessage);
		console.log(signature);
		document.getElementById('sellerNotification_2').innerHTML = `<em>Signed successfully by seller. Signature: </em>${signature}`;
	}	
	const contractId = document.getElementById('id').value;
	fetch(`http://localhost:8952/approve?id=${contractId}&value=${signerName}`)
	.then(() => {
		console.log("Successfully approved by "+signerName);
		readStatus139();
	});
}

async function rejectContract139(signerName) {
	const contractId = document.getElementById('id').value;
	fetch(`http://localhost:8952/reject?id=${contractId}&value=${signerName}`)
	.then(() => {
		console.log("Successfully rejected by "+signerName);
		readStatus139();
	});
}

async function deleteContract139(signerName) {
	const contractId = document.getElementById('id').value;
	fetch(`http://localhost:8952/delete?id=${contractId}`)
	.then(() => {
		console.log("Contract "+contractId+" Successfully deleted");
		readStatus139();
	});
}


async function ipfsFetch139() {
	const result = await fetch(`http://localhost:2222/read`);
	return result.text();
}

async function hashMessage139(value) {
	const result = await fetch(`http://localhost:2020/hash?value=${value}`);
	return result.text();
}

async function signMessage139(key, value) {
	const result = await fetch(`http://localhost:2020/sign?key=${key}&value=${value}`);
	return result.text();
}


////////////////////////// Under Construction ////////////////////////////////
// async function verifyMessage139(signerName) {
// 	let documentData = await readStatus139();
//     let hash = documentData.value;
// 	if (signerName == 'buyer') {
// 		let signature = documentData.buyerSignature; //0xc702dfc11cf4ecb0a82f6c6e531fb0a507232641a1083b0a15d5582ac0f3219162f29c28a6acedb29f775d353070d2b42bf35e34eea48684100f7c6b57d646bc1b;
// 		const result = await fetch(`http://localhost:2020/verify?hash=${hash}&signature=${signature}`);
// 		const buyerAddress = 0xd7500804ECE4D1EA1Ba97d634C3bA62e353d9f3D;
// 		if (result.text() == buyerAddress) {
// 			console.log('Buyer Signature is Valid.');
// 			console.log('Buyer Address: '+result.text());
// 		} else {
// 			console.log('Buyer Signature is NOT Valid!');
// 			console.log('Buyer Address: '+result.text());
// 		}
// 	} else if (signerName == 'seler') {
// 		signature = documentData.sellerSignature;
// 	}
// 	//const result = await fetch(`http://localhost:2020/sign?hash=${hash}&signature=${signature}`);
// 	return result.text();
// }