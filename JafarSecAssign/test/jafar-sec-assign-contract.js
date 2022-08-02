/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { JafarSecAssignContract } = require('..');
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

describe('JafarSecAssignContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new JafarSecAssignContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"jafar sec assign 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"jafar sec assign 1002 value"}'));
    });

    describe('#jafarSecAssignExists', () => {

        it('should return true for a jafar sec assign', async () => {
            await contract.jafarSecAssignExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a jafar sec assign that does not exist', async () => {
            await contract.jafarSecAssignExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createJafarSecAssign', () => {

        it('should create a jafar sec assign', async () => {
            await contract.createJafarSecAssign(ctx, '1003', 'jafar sec assign 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"jafar sec assign 1003 value"}'));
        });

        it('should throw an error for a jafar sec assign that already exists', async () => {
            await contract.createJafarSecAssign(ctx, '1001', 'myvalue').should.be.rejectedWith(/The jafar sec assign 1001 already exists/);
        });

    });

    describe('#readJafarSecAssign', () => {

        it('should return a jafar sec assign', async () => {
            await contract.readJafarSecAssign(ctx, '1001').should.eventually.deep.equal({ value: 'jafar sec assign 1001 value' });
        });

        it('should throw an error for a jafar sec assign that does not exist', async () => {
            await contract.readJafarSecAssign(ctx, '1003').should.be.rejectedWith(/The jafar sec assign 1003 does not exist/);
        });

    });

    describe('#updateJafarSecAssign', () => {

        it('should update a jafar sec assign', async () => {
            await contract.updateJafarSecAssign(ctx, '1001', 'jafar sec assign 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"jafar sec assign 1001 new value"}'));
        });

        it('should throw an error for a jafar sec assign that does not exist', async () => {
            await contract.updateJafarSecAssign(ctx, '1003', 'jafar sec assign 1003 new value').should.be.rejectedWith(/The jafar sec assign 1003 does not exist/);
        });

    });

    describe('#deleteJafarSecAssign', () => {

        it('should delete a jafar sec assign', async () => {
            await contract.deleteJafarSecAssign(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a jafar sec assign that does not exist', async () => {
            await contract.deleteJafarSecAssign(ctx, '1003').should.be.rejectedWith(/The jafar sec assign 1003 does not exist/);
        });

    });

});
