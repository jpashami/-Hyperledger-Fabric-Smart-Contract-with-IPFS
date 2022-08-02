# -Hyperledger-Fabric-Smart-Contract-with-IPFS
This assignment builds upon assignment A2 in which you developed a smart contract for an Hyperledger Fabric (HLF) blockchain. Thus, this assignment’s requirements are very similar to those of your assignment A3-Ethereum-with-IPFS, except that instead of using the Ethereum blockchain, you need to use HLF.
However, in assignment A2, you did not have to handle a business document, which could be a contract on which the companies need to agree. In this assignment, your application and the smart contract also need to handle a business document/contract: 
•	The document/contract needs to be stored on IPFS.
•	The Hashed document must be stored on the HLF.
•	Each company agreeing on the document, must first retrieve the document from IPFS and then check that the document stored on IPFS is genuine. To verify the originality of the document should compare it with the hashed document stored on the HLF Blockchain. 
•	After being sure about the originality then Each company can sign the document.

Solution Overview
This solution is more complicated than previous assignments because we are using multiple layers.
•	My Smart Contract whose name is JafarSecAssign has been deployed on HLF. 
•	Index.js file is responsible to invoke smart contract methods and publish them as REST API. They are published on localhost:8952.
•	Ipfs.js is responsible to fetch data from ipfs and provide the response on localhost:2222.
•	Cryptotools.js is responsible to provide methods for hashing and signing messages. It is accessible on localhost:2020.
•	Script.js is a Dapp that handles the business process of the assignment.
•	Index.html provides the user interface to have a GUI to interact with users.
