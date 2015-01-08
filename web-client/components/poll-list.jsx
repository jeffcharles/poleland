'use strict';

var React = require('react');
var reflux = require('reflux');
var pollList = require('./poll-list');
var pollListStore = require('./../stores/poll-list');
var redirect = require('./../pages/redirect');

function onPollClick(e) {
    e.preventDefault();
    redirect.toHref(e.target.href);
}

module.exports = React.createClass({
    mixins: [reflux.connect(pollListStore)],
    getInitialState: function() {
        return {
            polls: [],
            canLoadMore: false
        };
    },
    render: function() {
        var loadMoreElem;
        if(this.state.canLoadMore) {
            loadMoreElem =
                <button type="button" className="btn btn-link" onClick={pollList.loadMorePolls}>
                  Load more polls...
                </button>;
        }
        return (
            <div>
              <h1>Available Polls</h1>
              <button onClick={pollList.createPoll} className="btn btn-default">
                <span className="glyphicon glyphicon-plus" /> Create poll
              </button>
              <ul>
                {this.state.polls.map(function(poll) {
                    var pollHref = '/polls/' + poll.id;
                    return (
                        <li key={poll.id}>
                          <a href={pollHref} onClick={onPollClick}>
                            {poll.title}
                          </a>
                        </li>
                    );
                })}
              </ul>
              {loadMoreElem}
            </div>
        );
    }
});
