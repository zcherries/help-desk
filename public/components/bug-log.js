(function() {

  var socket = io();

  var author = 'Joe Nayigiziki';
  var dataEndPoint = 'http://localhost:8000/data/bugs';

  var Log = React.createClass({
    render: function() {
      var bugs = this.props.bugs.map(function(bug, idx) {
        return  (
          <p key={idx}>{ bug.author + ': ' + bug.content }</p>
        );
      });
      return (
        <div>
          { bugs }
        </div>
      );
    }
  });

  var BugCompose = React.createClass({
    retrieveFormData: function() {
      return this.refs.bugMessage.value;
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var postData = {
        author: author,
        content: this.retrieveFormData(),
        timestamp: new Date()
      };
      $.post(dataEndPoint, postData, function(data) {
        console.log('server response: ' + data);
      });
    },
    render: function() {
      return (
        <div id="bug-compose">
          <form method="post" onSubmit={ this.handleSubmit }>
            <textarea ref="bugMessage" className="form-control" rows="3" placeholder="Describe the bug..."></textarea>
            <input type="submit" id='submit' value="submit" />
          </form>
        </div>
      );
    }
  });

  var BugLogContainer = React.createClass({
    getInitialState: function() {
      return {
        bugs: []
      };
    },
    loadBugsFromServer: function() {
      $.get(this.props.dataEndPoint, function(data) {
        this.setState({
          bugs: data
        });
      }.bind(this));
      // adds to state
    },
    componentWillMount: function() {
      // make GET request to DB to load data
      this.loadBugsFromServer();
    },
    componentDidMount: function() {
      // listen to DB to changes
      socket.on('new-bugalert', function(data) {
        this.loadBugsFromServer();
      }.bind(this));
    },
    render: function() {
      return(
        <div className='bug-container'>
          <Log bugs={ this.state.bugs } />
          <BugCompose dataEndPoint={ this.props.dataEndPoint } mount={}/>
        </div>
      );
    }
	});

  ReactDOM.render(
  	<BugLogContainer dataEndPoint={ dataEndPoint } />,
  	document.getElementById('bug-log')
  );
})();