'use strict';

const { ObjectId } = require("mongodb");

module.exports = function (app, client) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;

    })

    .post(async function (req, res) {
      try {
        if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
          res.json({
            error: "required field(s) missing"
          });
        } else {
          let project = req.params.project;
          let collection = client.db('database').collection(project);
          let issue = {
            assigned_to: req.body.assigned_to || "",
            status_text: req.body.status_text || "",
            open: true,
            _id: new ObjectId(),
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            created_on: new Date().toISOString(),
            updated_on: new Date().toISOString()
          };
          const result = await collection.insertOne(issue);
          console.log(result.ops[0])
          res.send(result.ops[0]);
        }
      } catch (err) {
        throw err;
      }

    })

    .put(async function (req, res) {
      try {
        if (!req.body._id) {
          res.json({ error: 'missing _id' });
        } else if (!req.body.issue_title && !req.body.issue_text && !req.body.created_by && !req.body.assigned_to & !req.body.status_text) {
          res.json({ error: 'no update field(s) sent', '_id': req.body._id });
        } else {
          let project = req.params.project;
          let collection = client.db('database').collection(project);
          let doc = await collection.findOne({ _id: ObjectId(req.body._id) });
          console.log(doc);
          if (doc === null) {
            res.json({ error: 'could not update', '_id': req.body._id });
          } else {
            doc.issue_title = req.body.issue_title || doc.issue_title;
            doc.issue_text = req.body.issue_text || doc.issue_text;
            doc.created_by = req.body.created_by || doc.created_by;
            doc.assigned_to = req.body.assigned_to || doc.assigned_to;
            doc.status_text = req.body.status_text || doc.status_text;
            doc.updated_on = new Date().toISOString();
            console.log(doc);
            collection.save(doc, (err, result) => {
              if (err) {
                throw err;
              } else {
                res.json({ result: 'successfully updated', '_id': req.body._id });
              }
            })
          };
        }
      } catch (err) {
        res.json({ error: 'could not update', '_id': req.body._id });
        throw err;
      }


    })

    .delete(function (req, res) {
      let project = req.params.project;

    });

};
