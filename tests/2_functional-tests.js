const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testId1;
  let testId2;

  suite('POST /api/issues/{project} => create issues', function() {

    test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Title',
          issue_text: 'Text',
          created_by: 'Author',
          assigned_to: 'Chai',
          status_text: 'In QA'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'Text');
          assert.equal(res.body.created_by, 'Author');
          assert.equal(res.body.assigned_to, 'Chai');
          assert.equal(res.body.status_text, 'In QA');
          assert.isTrue(res.body.open);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          testId1 = res.body._id;
          done();
        });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Required Title',
          issue_text: 'Required Text',
          created_by: 'Required Author'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Required Title');
          assert.equal(res.body.issue_text, 'Required Text');
          assert.equal(res.body.created_by, 'Required Author');
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.isTrue(res.body.open);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          testId2 = res.body._id;
          done();
        });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
          issue_title: 'Missing Fields Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'required field(s) missing' });
          done();
        });
    });

  });

  suite('GET /api/issues/{project} => view issues', function() {

    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtLeast(res.body.length, 2);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          done();
        });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({ created_by: 'Author' })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);
          res.body.forEach(function(issue) {
            assert.equal(issue.created_by, 'Author');
          });
          done();
        });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .get('/api/issues/apitest')
        .query({
          created_by: 'Author',
          assigned_to: 'Chai'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAbove(res.body.length, 0);
          res.body.forEach(function(issue) {
            assert.equal(issue.created_by, 'Author');
            assert.equal(issue.assigned_to, 'Chai');
          });
          done();
        });
    });

  });

  suite('PUT /api/issues/{project} => update issue', function() {

    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: testId1,
          issue_title: 'Updated Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: testId1 });
          done();
        });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: testId1,
          issue_title: 'Multi Updated Title',
          issue_text: 'Multi Updated Text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully updated', _id: testId1 });
          done();
        });
    });

    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          issue_title: 'No Id Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: testId1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'no update field(s) sent', _id: testId1 });
          done();
        });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .put('/api/issues/apitest')
        .send({
          _id: '5f665eb46e296f6b9b6a504d',
          issue_title: 'Invalid Id Title'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not update', _id: '5f665eb46e296f6b9b6a504d' });
          done();
        });
    });

  });

  suite('DELETE /api/issues/{project} => delete issue', function() {

    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id: testId1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { result: 'successfully deleted', _id: testId1 });
          done();
        });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({
          _id: '5f665eb46e296f6b9b6a504d'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'could not delete', _id: '5f665eb46e296f6b9b6a504d' });
          done();
        });
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
      chai
        .request(server)
        .delete('/api/issues/apitest')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'missing _id' });
          done();
        });
    });

  });

});
