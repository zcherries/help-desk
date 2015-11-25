//Topic
//Question
//Votes
//Useful Links

//Topic is parent to Questions
//Each question has a vote count
//Each question has useful Links

//Townhall component
var Townhall = React.createClass({
  componentDidMount: function() {
    this.getTopics();
  },

  getInitialState: function() {
    return { topics: [] }
  },

  getTopics: function() {
    $.ajax({
      type: 'GET',
      url: this.props.url,
      success: function(response) {
        this.setState({topics: response.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error getting from: " + this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  postTopic: function(topic) {
    $.ajax({
      type: 'POST',
      url: this.props.url,
      data: {title: topic},
      success: function(response) {
        this.setState({topics: response.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error posting to: " + this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var topics = this.state.topics.map(function(topic, idx) {
      return (
        <Topic key={idx} topicId={topic._id} text={topic.title} questions={topic.questions} />
      )
    });
    return (
      <div className="townhall">
        <h1>Townhall</h1>
        <div className="frm">
          <TopicForm postTopic={this.postTopic} />
        </div>
        <div className="topics">
          {topics}
        </div>
      </div>
    )
  }
});

//Topic component
var Topic = React.createClass({
  getInitialState: function() {
    return { questions: [] }
  },

  listQuestions: function() {
    //var self = this;
    if (this.state.questions.length) {
      return this.state.questions.map(function(question, idx) {
        return (
          <Question key={idx} q_id={question._id}
            updateVote={this.updateVote}
            updateResources={this.updateResources}>{question}</Question>
        )
      }.bind(this));
    }
    return this.props.questions.map(function(question, idx) {
      return (
        <Question key={idx} q_id={question._id}
          updateVote={this.updateVote}
          updateResources={this.updateResources}>{question}</Question>
      )
    }.bind(this));
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

  updateVote: function(vote) {
    vote.topic_id = this.props.topicId;
    $.ajax({
      type: 'POST',
      url: 'topics/question/vote',
      data: vote,
      success: function(response) {
        this.setState({ questions: response.data });
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error posting to: " + this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  updateResources: function(resources) {
    resources.topic_id = this.props.topicId;
    $.ajax({
      type: 'POST',
      url: 'topics/question/resources',
      data: resources,
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
        <h3>{this.props.text}</h3>
        <QuestionForm postQuestion={this.postQuestion} />
        {topic_questions}
      </div>
    )
  }
});

//Question Component
var Question = React.createClass({
  getInitialState: function() {
    return {

    }
  },

  plusOne: function() {
    var count = this.props.children.votes + 1
    this.props.updateVote({question_id: this.props.q_id, vote: count});
  },

  minusOne: function() {
    var count = this.props.children.votes - 1
    if (count >= 0) {
      this.props.updateVote({question_id: this.props.q_id, vote: count});
    }
  },

  updateResourceList: function(e) {
    //var resources = (React.findDOMNode(this.refs.newText).value).split(/\r\n|\r|\n/g);
    var resources = (e.target.value).split(/\r\n|\r|\n/g);
    console.log(resources);
    if (resources.length) {
      this.props.updateResources({question_id: this.props.q_id, resources: resources});
    }
  },

  render: function() {
    return (
      <div className="question">
        <span className="title">{this.props.children.title}</span>
        <span>
          <span className="votes">Votes: {this.props.children.votes}</span>
          <button className="btn btn-success btn-sm glyphicon glyphicon-thumbs-up" onClick={this.plusOne} />
          <button className="btn btn-warning btn-sm glyphicon glyphicon-thumbs-down" onClick={this.minusOne} />
          <button onClick={this.updateResourceList} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
          <textarea ref="newText"
            defaultValue={this.props.children.resources} onChange={this.updateResourceList}></textarea>
        </span>
      </div>
    )
  }
});

//TopicForm Component
var TopicForm = React.createClass({
  getInitialState: function() {
    return { topic: '' }
  },

  handleTextChange: function(e) {
    this.setState({topic: e.target.value});
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

//QuestionForm Component
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
      <div className="question_form">
      <form onSubmit={this.submitHandler}>
        <input type="text" placeholder="Post a question" value={this.state.question} onChange={this.handleTextChange} />
        <input type="submit" value="Post Question" />
      </form>
      </div>
    )
  }
});

ReactDOM.render(<Townhall url='/townhall/topics' />, document.getElementById('container'));
