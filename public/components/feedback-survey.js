(function() {
  // global vars
  var _formData = {
    shoutout: '',
    tags: {},
    timesubmitted: '5:30PM, Saturday'
  };

  var data = {
    _id:"564b92444a2d3726550e55cf",
    author:"William Carroll",
    content:"help",
    timesubmitted:"Tue Nov 17 2015 12:16:43 GMT-0800 (PST)",
    timeclosed:"Tue Nov 17 2015 12:31:01 GMT-0800 (PST)",
    accepted:false,
    closed:false,
    assignedFellow:"Joe Nayigiziki",
    __v:0,
    tags:["JavaScript", "MongoDB", "React", "Express", "Node.js"],
    feedback:"empty"
  };

  // var data = {
  //   author: "William Carroll",
  //   content: "I need help with Mongo and React",
  //   tags: ["Mongo", "React", "JavaScript"],
  //   timesubmitted: "4:52PM, Saturday",
  //   timeclosed: "5:00PM, Saturday"
  // };

  // Component Props:
  // tag: (e.g. "Mongo" or "JavaScript" or "mySQL")
  // key: mandatory for React
  var RatingRow = React.createClass({
    handleClick: function(e) {
      this.setState({
        thumbsUp: false,
        thumbsMiddle: false,
        thumbsDown: false
      });

      var state = {};
      state[e.target.id] = true;
      this.setState(state);
      _formData.tags[this.props.tag] = e.target.id;
    },

    getInitialState: function() {
      return {
        thumbsUp: false,
        thumbsMiddle: false,
        thumbsDown: false
      };
    },
    render: function() {
      var selected;
      for (var key in this.state) {
        if (this.state[key]) selected = key;
      }
      return (
        <div className="rating">
          <p className="tag">{ this.props.tag }</p>
          <div className="thumbs-container">
            <span id="thumbsDown" onClick={ this.handleClick } className="thumbs thumbs-down glyphicon glyphicon-thumbs-down"></span>
            <span id="thumbsMiddle" onClick={ this.handleClick } className="thumbs thumbs-middle glyphicon glyphicon-thumbs-up"></span>
            <span id="thumbsUp" onClick={ this.handleClick } className="thumbs thumbs-up glyphicon glyphicon-thumbs-up"></span>
          </div>
        </div>
      );
    }
  });

  // Component Props:
  // tags: an array of technology names (e.g. ["Mongo", "JavaScript", "mySql"])
  // callbackParent: function to allow events to be broadcast to parents
  var RatingContainer = React.createClass({
    render: function() {
      var ratings = this.props.tags.map(function(tag, idx) {
        return (
          <RatingRow tag={ tag } key={ idx } />
        );
      });
      return (
        <div className="box ratings-container">
          { ratings }
        </div>
      );
    }
  });

  // Component Props:
  // formData: JSON object to simulate data from db
  var SurveyForm = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault();
      var shoutout = this.refs.shoutout;
      _formData.shoutout = shoutout.value;
      console.log('_formData: ' + JSON.stringify(_formData));

      var feedback = 'shoutout:' + _formData.shoutout + '\n';
      for (var key in _formData.tags) {
        feedback += key + ':' + _formData.tags[key] + '\n';
      }
      feedback.timesubmitted = new Date();
      data.feedback = feedback;
      
      $.post('/feedback', data, function(response) {
        console.log('successfully posted feedback! response: ' + JSON.stringify(response));
      });
    },
    onRatingChange: function(state) {
      this.setState(state);
    },
    componentWillMount: function() {
      _formData.author = this.props.formData.author;
    },
    getInitialState: function() {
      return {
        thumbsUp: false,
        thumbsMiddle: false,
        thumbsDown: false
      };
    },
    render: function() {
      var formData = this.props.formData;
      var apostrophe = "\'".charAt(0);
			return (
				<div className="survey-form">
					<h1 id='header'>Hi, { formData.author }</h1>
          <h1 id='header2'>How unstuck are you?</h1>
					<p id='notification'>Our system notified us that your Help Desk Request ended: { formData.timeclosed }</p>
          <h3>Please assess { formData.assignedFellow + apostrophe }s proficiency in the following</h3>
					<RatingContainer tags={ formData.tags } callbackParent={ this.onRatingChange } />
					<h3 id='shoutout'>Any shout outs?</h3>
					<form method="post" onSubmit={ this.handleSubmit }>
						<textarea ref="shoutout" id='shoutout-text' className="form-control" rows="3" placeholder="Additional feedback is appreciated..."></textarea>
            <input className="btn btn-default" id='submit' type="submit" value="Submit" />
					</form>
				</div>
			);
		}
	});

  ReactDOM.render(
  	<SurveyForm formData={ data } />,
  	document.getElementById('feedback-survey')
  );
})();