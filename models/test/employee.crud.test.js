const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  after(() => {
    mongoose.models = {};
  });

  before(async () => {

    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch(err) {
      console.error(err);
    }

  });

  describe('Reading data', () => {
    
    before(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'firstName2', lastName: 'lastName2', department: 'IT2' });
      await testEmpTwo.save();
    });

    it('should return all the data with find method', async () => {
      const employee = await Employee.find();
      const expectedLength = 2;
      expect(employee.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with findOne method', async () => {
      const employee = await Employee.findOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      expect(employee.firstName).to.be.equal('firstName1');
      expect(employee.lastName).to.be.equal('lastName1');
      expect(employee.department).to.be.equal('IT1');
    });

    after(async () => {
      await Employee.deleteMany();
    });

  });
  
  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      await employee.save();
      const savedEmployee = await Employee.findOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      expect(savedEmployee).to.not.be.null;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });
  
  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'firstName2', lastName: 'lastName2', department: 'IT2' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' },
          { $set: { firstName: 'firstName1ok', lastName: 'lastName1ok', department: 'IT1ok' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'firstName1ok', lastName: 'lastName1ok', department: 'IT1ok' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      employee.firstName = 'firstName1ok';
      await employee.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: 'firstName1ok' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'firstName1ok', lastName: 'lastName1ok', department: 'IT1ok' }});
      const employee = await Employee.find();
      expect(employee[0].firstName).to.be.equal('firstName1ok');
      expect(employee[1].firstName).to.be.equal('firstName1ok');
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Removing data', () => {
    
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'firstName2', lastName: 'lastName2', department: 'IT2' });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      const removeEmployee = await Employee.findOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      expect(removeEmployee).to.be.null;
    });
  
    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'firstName1', lastName: 'lastName1', department: 'IT1' });
      expect(removedEmployee).to.be.null;
    });
  
    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employee = await Employee.find();
      expect(employee.length).to.be.equal(0);
    });
    
    afterEach(async () => {
      await Employee.deleteMany();
    });

  });

});