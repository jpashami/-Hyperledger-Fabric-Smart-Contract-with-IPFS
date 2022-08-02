// let recoverAddress = ethers.utils.recoverAddress ( hashedMessage , signature );
// console.log('Recover Address: ', recoverAddress);
// let publicKey = ethers.utils.recoverPublicKey(hashedMessage , signature);
// console.log('Public Key: ', publicKey);

https://docs.ethers.io/v4/api-utils.html#cryptographic-functions

Cryptographic Functions
Elliptic Curve
utils . computeAddress ( publicOrPrivateKey )   =>   Address
Computes the Ethereum address given a public key or private key.
utils . computePublicKey ( publicOrPrivateKey [ , compressed = false ] )   =>   hex
Compute the public key for publicOrPrivateKey, optionally compressed. If publicOrPrivateKey is a public key, it may be either compressed or uncompressed.
utils . recoverAddress ( digest , signature )   =>   Address
Returns the Ethereum address by using ecrecover with the digest for the signature.
utils . recoverPublicKey ( digest , signature )   =>   hex
Returns the public key by using ecrecover with the digest for the signature.
utils . verifyMessage ( messageStringOrArrayish , signature )   =>   Addresss
Returns the address of the account that signed messageStringOrArrayish to generate signature.
verify a message signature
let signature = "0xddd0a7290af9526056b4e35a077b9a11b513aa0028ec6c9880948544508f3c63" +
                  "265e99e47ad31bb2cab9646c504576b3abc6939a1710afc08cbf3034d73214b8" +
                  "1c";

let signingAddress = Wallet.verifyMessage('hello world', signature);

console.log(signingAddress);
// "0x14791697260E4c9A71f18484C9f997B308e59325"
Hash Functions
utils . keccak256 ( hexStringOrArrayish )   =>   hex
Compute the keccak256 cryptographic hash of a value, returned as a hex string. (Note: often Ethereum documentation refers to this, incorrectly, as SHA3)
utils . sha256 ( hexStringOrArrayish )   =>   hex
Compute the SHA2-256 cryptographic hash of a value, returned as a hex string.
hashing binary data
console.log(utils.keccak256([ 0x42 ]));
// '0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111'

console.log(utils.keccak256("0x42"));
// '0x1f675bff07515f5df96737194ea945c36c41e7b4fcef307b7cd4d0e602a69111'


console.log(utils.sha256([ 0x42 ]));
// '0xdf7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c'

console.log(utils.sha256("0x42"));
// '0xdf7e70e5021544f4834bbee64a9e3789febc4be81470df629cad6ddb03320a5c'
Hash Function Helpers
utils . hashMessage ( stringOrArrayish )   =>   hex
Compute the prefixed message hash of a stringOrArrayish, by converting the message to bytes (as necessary) and prefixing with \x19Ethereum Signed Message\n and the length of the message. See the eth_sign JSON-RPC method for more information.
utils . id ( utf8String )   =>   hex
Compute the keccak256 cryptographic hash of a UTF-8 string, returned as a hex string.
hashing utf-8 strings
// Convert the string to binary data
let message = "Hello World";
let messageBytes = utils.toUtf8Bytes(message);
utils.keccak256(messageBytes);
// '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba'

// Which is equivalent to using the id function
utils.id("Hello World");
// '0x592fa743889fc7f92ac2a37bb1f5ba1daf2a5c84741ca0e0061d243a2e6707ba'


// Compute the sighash for a Solidity method
console.log(utils.id("addr(bytes32)"));
// '0x3b3b57de213591bb50e06975ea011e4c8c4b3e6de4009450c1a9e55f66e4bfa4'