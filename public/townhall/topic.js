var Topic = React.createClass({
  getInitialState: function() {
    return { questions: [] }
  },

  listQuestions: function() {
    if (this.state.questions.length) {
      return this.state.questions.map(function(question, idx) {
        return (
          <Question key={idx} questionId={question._id} content={question} />
        )
      });
    }
    return this.props.questions.map(function(question, idx) {
      return (
        <Question key={idx} questionId={question._id} content={question} />
      )
    });
  },

  postQuestion: function(question) {
    //console.log(this.props.url + "?topicId=" + this.props.topicId)
    $.ajax({
      type: 'POST',
      url: 'topics?topicId=' + this.props.topicId,
      data: question,
      success: function(response) {
        this.setState({ questions: response.data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error posting to: " + this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var topic_questions = this.listQuestions();
    return (
      <div className="topic">
        <p>{this.props.text}</p>
        {topic_questions}
        <div><QuestionForm postQuestion={this.postQuestion} /></div>
      </div>
    )
  }
});

var TopicForm = React.createClass({
  getInitialState: function() {
    return { topic: '' }
  },

  handleTextChange: function(e) {
    this.setState({topic: e.target.value});
    console.log(e.target.value);
  },

  submitHandler: function(e) {
    e.preventDefault();
    var topic = this.state.topic.trim();
    if (topic) {
      console.log(this.state.topic);
      this.props.postTopic(topic);
    }
    this.setState({topic: ''});
  },

  render: function() {
    return (
      <form onSubmit={this.submitHandler}>
        <input type="text" placeholder="Add a topic" value={this.state.topic} onChange={this.handleTextChange}/>
        <input type="submit" value="Post Topic" />
      </form>
    )
  }
});
