'use strict';

const crypto = require('crypto');

// In-memory issue storage partitioned by project
const issuesDB = {};

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      let projectIssues = issuesDB[project] || [];

      const query = req.query;
      if (Object.keys(query).length > 0) {
        projectIssues = projectIssues.filter(issue => {
          for (const key of Object.keys(query)) {
            if (key === 'open') {
              const boolVal = (query.open === 'true' || query.open === true);
              if (issue.open !== boolVal) return false;
            } else if (key === '_id') {
              if (String(issue._id) !== String(query._id)) return false;
            } else {
              if (String(issue[key]) !== String(query[key])) return false;
            }
          }
          return true;
        });
      }

      res.json(projectIssues);
    })
    
    .post(function (req, res){
      const project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }

      const now = new Date().toISOString();
      const newIssue = {
        _id: crypto.randomBytes(12).toString('hex'),
        issue_title,
        issue_text,
        created_on: now,
        updated_on: now,
        created_by,
        assigned_to: assigned_to || '',
        open: true,
        status_text: status_text || ''
      };

      if (!issuesDB[project]) {
        issuesDB[project] = [];
      }
      issuesDB[project].push(newIssue);

      res.json(newIssue);
    })
    
    .put(function (req, res){
      const project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      const validUpdateFields = [
        'issue_title',
        'issue_text',
        'created_by',
        'assigned_to',
        'status_text',
        'open'
      ];

      const fieldsToUpdate = {};
      for (const field of validUpdateFields) {
        if (req.body[field] !== undefined && req.body[field] !== '') {
          if (field === 'open') {
            fieldsToUpdate[field] = (req.body.open === false || req.body.open === 'false') ? false : true;
          } else {
            fieldsToUpdate[field] = req.body[field];
          }
        }
      }

      if (Object.keys(fieldsToUpdate).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }

      // Find the issue in this project or fallback to any project
      let targetIssue = null;
      if (issuesDB[project]) {
        targetIssue = issuesDB[project].find(issue => String(issue._id) === String(_id));
      }
      if (!targetIssue) {
        for (const proj in issuesDB) {
          targetIssue = issuesDB[proj].find(issue => String(issue._id) === String(_id));
          if (targetIssue) break;
        }
      }

      if (!targetIssue) {
        return res.json({ error: 'could not update', '_id': _id });
      }

      Object.assign(targetIssue, fieldsToUpdate);
      targetIssue.updated_on = new Date().toISOString();

      return res.json({ result: 'successfully updated', '_id': _id });
    })
    
    .delete(function (req, res){
      const project = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        return res.json({ error: 'missing _id' });
      }

      let deleted = false;
      if (issuesDB[project]) {
        const index = issuesDB[project].findIndex(issue => String(issue._id) === String(_id));
        if (index !== -1) {
          issuesDB[project].splice(index, 1);
          deleted = true;
        }
      }

      if (!deleted) {
        for (const proj in issuesDB) {
          const index = issuesDB[proj].findIndex(issue => String(issue._id) === String(_id));
          if (index !== -1) {
            issuesDB[proj].splice(index, 1);
            deleted = true;
            break;
          }
        }
      }

      if (!deleted) {
        return res.json({ error: 'could not delete', '_id': _id });
      }

      return res.json({ result: 'successfully deleted', '_id': _id });
    });
    
};
