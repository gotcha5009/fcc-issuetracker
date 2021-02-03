'use strict';

const { ObjectId } = require("mongodb");

module.exports = function (app, client) {

  app.route('/api/issues/:project')

    .get(async function (req, res) {
      try {
        let project = req.params.project;
        const collection = client.db('database').collection(project);
        console.log(req.query);
        if (req.query.open) {
          if (req.query.open === "true") {
            req.query.open = true;
          }
          if (req.query.open === "false") {
            req.query.open = false;
          }
        }
        if (req.query._id) {
          req.query._id = ObjectId(req.query._id) || req.query._id;
        }
        const docs = await collection.find(req.query).toArray();
        res.json(docs);
      } catch (err) {
        res.send();
        throw err;
      }
    })

    .post(async function (req, res) {
      try {
        if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
          res.json({
            error: "required field(s) missing"
          });
        } else {
          const project = req.params.project;
          const collection = client.db('database').collection(project);
          const issue = {
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
          const project = req.params.project;
          const collection = client.db('database').collection(project);
          const result = await collection.updateOne(
            { _id: ObjectId(req.body._id) },
            {
              $set: {
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                created_by: req.body.created_by,
                assigned_to: req.body.assigned_to,
                status_text: req.body.status_text,
                open: req.body.open === undefined ? undefined : false,
                updated_on: new Date().toISOString()
              }
            },
            {
              upsert: false,
              ignoreUndefined: true
            }
          );
          console.log(result.modifiedCount);
          if (result.modifiedCount === 0) {
            res.json({ error: 'could not update', '_id': req.body._id });
          } else {
            res.json({ result: 'successfully updated', '_id': req.body._id });
          }
        }
      } catch (err) {
        res.json({ error: 'could not update', '_id': req.body._id });
        throw err;
      }


    })

    .delete(async function (req, res) {
      try {
        if (!req.body._id) {
          res.json({ error: 'missing _id' });
        } else {
          const project = req.params.project;
          const collection = client.db('database').collection(project);
          const result = await collection.deleteOne({ _id: ObjectId(req.body._id) });
          console.log(result.deletedCount);
          if (result.deletedCount === 0) {
            res.json({ error: 'could not delete', '_id': req.body._id });
          } else {
            res.json({ result: 'successfully deleted', '_id': req.body._id });
          }
        }
      } catch (err) {
        res.json({ error: 'could not delete', '_id': req.body._id });
        throw err;
      }


    });

};
