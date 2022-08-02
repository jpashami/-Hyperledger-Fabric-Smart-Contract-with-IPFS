/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class JafarSecAssignContract extends Contract {

    async jafarSecAssignExists139(ctx, jafarSecAssignId) {
        const buffer = await ctx.stub.getState(jafarSecAssignId);
        return (!!buffer && buffer.length > 0);
    }

    async createJafarSecAssign139(ctx, jafarSecAssignId, value) {
        const exists = await this.jafarSecAssignExists139(ctx, jafarSecAssignId);
        if (exists) {
            throw new Error(`The jafar sec assign ${jafarSecAssignId} already exists`);
        }
        const asset = { 
            id: jafarSecAssignId,
            value: value,
            buyerSignature: '',
            sellerSignature: '',
            assetStatus: 'Initialized, Pending for approval',
            buyerApproval: 0, // 0:pending, 1: approved, 2:rejected
            sellerApproval: 0 // 0:pending, 1: approved, 2:rejected
         };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(jafarSecAssignId, buffer);
        return asset.assetStatus;
    }

    async readJafarSecAssign139(ctx, jafarSecAssignId) {
        const exists = await this.jafarSecAssignExists139(ctx, jafarSecAssignId);
        if (!exists) {
            throw new Error(`The jafar sec assign ${jafarSecAssignId} does not exist`);
        }
        const buffer = await ctx.stub.getState(jafarSecAssignId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateJafarSecAssign139(ctx, jafarSecAssignId, newAssetValue) {
        const exists = await this.jafarSecAssignExists139(ctx, jafarSecAssignId);
        if (!exists) {
            throw new Error(`The jafar sec assign ${jafarSecAssignId} does not exist`);
        }
        const asset = await this.readJafarSecAssign139(ctx, jafarSecAssignId);
        asset.value = newAssetValue;
        asset.assetStatus = 'Updated, Pending to verify';
        asset.buyerApproval = 0;
        asset.sellerApproval = 0;
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(jafarSecAssignId, buffer);
        return asset;
    }

    async deleteJafarSecAssign139(ctx, jafarSecAssignId) {
        const exists = await this.jafarSecAssignExists139(ctx, jafarSecAssignId);
        if (!exists) {
            throw new Error(`The jafar sec assign ${jafarSecAssignId} does not exist`);
        }
        await ctx.stub.deleteState(jafarSecAssignId);
    }

    async approveJafarSecAssign139(ctx, jafarSecAssignId, signerName) {
        const exists = await this.jafarSecAssignExists139(ctx, jafarSecAssignId);
        if (!exists) {
            throw new Error(`The jafar sec assign ${jafarSecAssignId} does not exist`);
        }
        const asset = await this.readJafarSecAssign139(ctx, jafarSecAssignId);
        if (signerName == 'buyer') {
            if (asset.sellerApproval==1) {
                asset.assetStatus = 'Approved by both parties';
                asset.buyerApproval = 1;
            } else if (asset.sellerApproval==2) {
                asset.assetStatus = 'Approved by buyer, Rejected by seller';
                asset.buyerApproval = 1;
            } else {
                asset.assetStatus = 'Approved by buyer, Pending for seller';
                asset.buyerApproval = 1;
            }
        } else if (signerName == 'seller') {
            if (asset.buyerApproval ==1) {
                asset.assetStatus = 'Approved by both parties';
                asset.sellerApproval = 1;
            } else if (asset.buyerApproval == 2) {
                asset.assetStatus = 'Approved by seller, Rejected by buyer';
                asset.sellerApproval = 1;
            } else {
                asset.assetStatus = 'Approved by seller, Pending buyer';
                asset.sellerApproval = 1;
            }
        console.log(asset.assetStatus);
        } else {
            console.error('ERROR: Approval Failed. Signer should be buyer or seller.')
        }
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(jafarSecAssignId, buffer);
        return asset;
    }

    async rejectJafarSecAssign139(ctx, jafarSecAssignId, signerName) {
        const exists = await this.jafarSecAssignExists139(ctx, jafarSecAssignId);
        if (!exists) {
            throw new Error(`The jafar sec assign ${jafarSecAssignId} does not exist`);
        }
        const asset = await this.readJafarSecAssign139(ctx, jafarSecAssignId);
        if (signerName == 'buyer') {
            if (asset.sellerApproval==2) {
                asset.assetStatus = 'Rejected by both parties';
                asset.buyerApproval = 2;
            } else if (asset.sellerApproval==1) {
                asset.assetStatus = 'Rejected by buyer, Approved by seller';
                asset.buyerApproval = 2;
            } else {
                asset.assetStatus = 'Rejected by buyer, Pending for seller';
                asset.buyerApproval = 2;
            }
        } else if (signerName == 'seller') {
            if (asset.buyerApproval ==2) {
                asset.assetStatus = 'Rejected by both parties';
                asset.sellerApproval = 2;
            } else if (asset.buyerApproval == 1) {
                asset.assetStatus = 'Rejected by seller, Approved by buyer';
                asset.sellerApproval = 2;
            } else {
                asset.assetStatus = 'Rejected by seller, pending for buyer';
                asset.sellerApproval = 2;
            }
        console.log(asset.assetStatus);
        } else {
            console.error('ERROR: Rejection request Failed. Signer should be buyer or seller.')
        }
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(jafarSecAssignId, buffer);
        return asset;
    }
}

module.exports = JafarSecAssignContract;
