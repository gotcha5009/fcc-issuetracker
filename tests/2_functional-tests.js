const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    // #1
    test("Create an issue with every field: POST request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .post("/api/issues/apitest")
            .send(
                {
                    'issue_title': 'test',
                    'issue_text': 'test',
                    'created_by': 'user',
                    'assigned_to': 'me',
                    'status_text': 'unknown'
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.issue_title, "test");
                assert.equal(res.body.issue_text, "test");
                assert.equal(res.body.created_by, 'user');
                assert.equal(res.body.assigned_to, 'me');
                assert.equal(res.body.status_text, 'unknown');
                assert.equal(res.body.open, true);
                assert.exists(res.body._id);
                assert.exists(res.body.created_on);
                assert.exists(res.body.updated_on);
                test_id = res.body._id;
                done();
            });
    });
    // #2
    test("Create an issue with only required fields: POST request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .post("/api/issues/apitest")
            .send(
                {
                    'issue_title': 'test',
                    'issue_text': 'test',
                    'created_by': 'user'
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.issue_title, "test");
                assert.equal(res.body.issue_text, "test");
                assert.equal(res.body.created_by, 'user');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.equal(res.body.open, true);
                assert.exists(res.body._id);
                assert.exists(res.body.created_on);
                assert.exists(res.body.updated_on);
                done();
            });
    })
    // #3
    test("Create an issue with missing required fields: POST request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .post("/api/issues/apitest")
            .send(
                {
                    'issue_title': 'test',
                    'issue_text': 'test'
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    })
    // #4
    test("View issues on a project: GET request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .get("/api/issues/apitest")
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                done();
            });
    })
    // #5
    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .get("/api/issues/apitest?open=false")
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                done();
            });
    })
    // #6
    test("View issues on a project with one filter: GET request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .get("/api/issues/apitest?open=false&issue_title=test")
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                done();
            });
    })
    // #7
    test("Update one field on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .put("/api/issues/apitest")
            .send(
                {
                    _id: test_id,
                    issue_title: 'test123'
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, test_id)
                done();
            });
    })
    // #8
    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .put("/api/issues/apitest")
            .send(
                {
                    _id: test_id,
                    issue_title: 'test123',
                    issue_text: "text test"
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, test_id)
                done();
            });
    })
    // #9
    test("Update an issue with missing _id: PUT request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .put("/api/issues/apitest")
            .send(
                {
                    issue_title: 'test123',
                    issue_text: "text test"
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    })
    // #10
    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .put("/api/issues/apitest")
            .send(
                {
                    _id: test_id
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, test_id)
                done();
            });
    })
    // #11
    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .put("/api/issues/apitest")
            .send(
                {
                    _id: '6016cec87c70522780d624',
                    issue_title: 'test123',
                    issue_text: "text test"
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, '6016cec87c70522780d624')
                done();
            });
    })
    // #12
    test("Delete an issue: DELETE request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .delete("/api/issues/apitest")
            .send(
                {
                    _id: test_id,
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.result, 'successfully deleted');
                assert.equal(res.body._id, test_id)
                done();
            });
    })
    // #13
    test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .delete("/api/issues/apitest")
            .send(
                {
                    _id: '601c1d8f92c87006bc9424',
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, '601c1d8f92c87006bc9424')
                done();
            });
    })
    // #14
    test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", (done) => {
        chai
            .request(server)
            .delete("/api/issues/apitest")
            .send(
                {
                }
            )
            .end(function (err, res) {
                //console.log(res);
                assert.equal(res.statusCode, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    })
});
