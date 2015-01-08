'use strict';

var React = require('react');
var Poll = require('./poll.jsx');
var pollActions = require('./view-poll-actions');

module.exports = React.createClass({
    render: function() {
        return (
            <div>
              <Poll />
              <ul className="action-list">
                <li>
                  <button type="button" className="btn btn-primary"
                          onClick={pollActions.save}>
                    <span className="glyphicon glyphicon-save" /> Save
                  </button>
                </li>
                <li>
                  <button type="button" className="btn btn-success"
                          onClick={pollActions.apply}>
                    <span className="glyphicon glyphicon-floppy-disk" /> Apply
                  </button>
                </li>
                <li>
                  <button type="button" className="btn btn-danger"
                          onClick={pollActions.deletePoll}>
                    <span className="glyphicon glyphicon-remove" /> Delete
                  </button>
                </li>
              </ul>
            </div>
        );
    }
});
