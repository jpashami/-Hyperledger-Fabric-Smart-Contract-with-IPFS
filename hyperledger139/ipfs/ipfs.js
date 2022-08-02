import { create } from 'ipfs-http-client';
const client = create();

// Define "require"
import { createRequire } from "module";
const require = createRequire(import.meta.url);

let resultContent = '';
// http server config
const http = require("http");
const url = require('url');
const host = '0.0.0.0';
const port = 2222;

// Create a Listener function
const requestListener139 = async function (req, res) {

	//const queryObject = url.parse(req.url, true).query;

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
		const cid = 'QmSaqGgpJBrgTTVWcafob2tVvBiQwSXRnjkhVY2YoRUEsk';
		result = await readIPFS139(cid)
        console.log(resultContent);
		res.writeHead(200);
		res.end(resultContent);
	} else {
		res.writeHead(200);
		res.end("please specify create, update, read or delete operation...");
	}
} ;

async function readIPFS139(_cid) {
    const resp = await client.cat(_cid);
    let content = [];
    for await (const chunk of resp) {
        content = [...content, ...chunk];
        const raw = Buffer.from(content).toString('utf8')
        resultContent = raw;
    }
    // console.log(JSON.stringify(content));
    return resultContent;
}

// Runs through a server
const server = http.createServer(requestListener139);
server.listen(port, host, async () => {
    console.log(`Server Address: http://localhost:${port}`);
    console.log(`Server Address .........................`);
});
