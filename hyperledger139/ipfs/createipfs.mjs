/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'ipfs-http-client';

const client = create();

import { AbortController } from "node-abort-controller";

global.AbortController = AbortController;

var MFS_path = '/document139';
client.files.write(MFS_path,
    new TextEncoder().encode("In this document buyer and seller agreed based on the content of this agreement"),
    { create: true }).then(async r => {

        client.files.stat(MFS_path, { hash: true }).then( async r => {
            let ipfsAddr = r.cid.toString();
            console.log("added file ipfs:", ipfsAddr)
            // console.log("created message on IPFS:", cid);
            const resp = await client.cat(ipfsAddr);
            let content = [];
            for await (const chunk of resp) {
                content = [...content, ...chunk];
                const raw = Buffer.from(content).toString('utf8')
                // console.log(JSON.parse(raw))
                console.log(raw)
            }

            // console.log(content.toString());
        });
    }).catch(e => {
        console.log(e);
    });
