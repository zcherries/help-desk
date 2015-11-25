var Question = React.createClass({
  render: function() {
    return (
      <p>
        <span>{this.props.content.title}</span>
        <span>{this.props.content.votes}</span>
        <span>{this.props.content.resources}</span>
      </p>
    )
  }
});

var QuestionForm = React.createClass({
  getInitialState: function() {
    return { question: '' }
  },

  handleTextChange: function(e) {
    this.setState({question: e.target.value});
  },

  submitHandler: function(e) {//add topic key in order to locate in database
    e.preventDefault();
    var question = this.state.question.trim();
    if (question) {
      this.props.postQuestion({ title: question, resources: [], votes: 0 })
    }
    this.setState({question: ''});
  },

  render: function() {
    return (
      <form onSubmit={this.submitHandler}>
        <input type="text" placeholder="Post a question" value={this.state.question} onChange={this.handleTextChange} />
        <input type="submit" value="Post Question" />
      </form>
    )
  }
});
