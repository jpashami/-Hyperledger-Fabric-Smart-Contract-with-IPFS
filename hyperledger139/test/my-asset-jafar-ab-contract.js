/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { MyAssetJafarAbContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('MyAssetJafarAbContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new MyAssetJafarAbContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"my asset jafar ab 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"my asset jafar ab 1002 value"}'));
    });

    describe('#myAssetJafarAbExists', () => {

        it('should return true for a my asset jafar ab', async () => {
            await contract.myAssetJafarAbExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a my asset jafar ab that does not exist', async () => {
            await contract.myAssetJafarAbExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createMyAssetJafarAb', () => {

        it('should create a my asset jafar ab', async () => {
            await contract.createMyAssetJafarAb(ctx, '1003', 'my asset jafar ab 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"my asset jafar ab 1003 value"}'));
        });

        it('should throw an error for a my asset jafar ab that already exists', async () => {
            await contract.createMyAssetJafarAb(ctx, '1001', 'myvalue').should.be.rejectedWith(/The my asset jafar ab 1001 already exists/);
        });

    });

    describe('#readMyAssetJafarAb', () => {

        it('should return a my asset jafar ab', async () => {
            await contract.readMyAssetJafarAb(ctx, '1001').should.eventually.deep.equal({ value: 'my asset jafar ab 1001 value' });
        });

        it('should throw an error for a my asset jafar ab that does not exist', async () => {
            await contract.readMyAssetJafarAb(ctx, '1003').should.be.rejectedWith(/The my asset jafar ab 1003 does not exist/);
        });

    });

    describe('#updateMyAssetJafarAb', () => {

        it('should update a my asset jafar ab', async () => {
            await contract.updateMyAssetJafarAb(ctx, '1001', 'my asset jafar ab 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"my asset jafar ab 1001 new value"}'));
        });

        it('should throw an error for a my asset jafar ab that does not exist', async () => {
            await contract.updateMyAssetJafarAb(ctx, '1003', 'my asset jafar ab 1003 new value').should.be.rejectedWith(/The my asset jafar ab 1003 does not exist/);
        });

    });

    describe('#deleteMyAssetJafarAb', () => {

        it('should delete a my asset jafar ab', async () => {
            await contract.deleteMyAssetJafarAb(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a my asset jafar ab that does not exist', async () => {
            await contract.deleteMyAssetJafarAb(ctx, '1003').should.be.rejectedWith(/The my asset jafar ab 1003 does not exist/);
        });

    });

});
