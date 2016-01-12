//Towhnall is a parent component to the Topic and Topic form components
//Topic is a parent component to Questions and Question Form components
//Each question has a vote count and listing of resources
//Townhall component
var Townhall = React.createClass({
  componentDidMount: function() {
    this.getTopics(); //ajax call to retrieve topics from database
    socket.on('topic_CUD', function() {
      this.getTopics();
    }.bind(this));
  },

  getInitialState: function() {
    return {
      topics: []
    }
  },

  getTopics: function() {
    $.ajax({
      type: 'GET',
      url: this.props.url,
      success: function(response) {
        this.setState({topics: response.data}); //update state
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    });
  },

  postTopic: function(topic) {
    $.ajax({
      type: 'POST',
      url: this.props.url,
      data: topic,
      success: function(response) {
        this.setState({topics: response.data});
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    });
  },

  removeTopic: function(topic) {
    topic.action = "remove"
    this.postTopic(topic);
  },

  render: function() { //render retrieved topics from database
    var topics = this.state.topics.map(function(topic, idx) {
      return (
        <Topic key={idx} topicId={topic._id} text={topic.title}
          removeTopic={this.removeTopic} questions={topic.questions} />
      )
    }.bind(this));
    return (
      <div className="townhall">
        <h1>Townhall</h1>
        <TopicForm postTopic={this.postTopic} />
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
    return { questions: [] } //array of a questions that belong to a topic
  },

  remove: function() {
    this.props.removeTopic({topic_id: this.props.topicId});
  },

  //generate questions as a result of either the state being updated
  //or the questions object being passed as a prop
  listQuestions: function() {
    if (this.state.questions.length) {
      return this.state.questions.map(function(question, idx) {
        return (
          <Question
            topicId={this.props.topicId}
            key={idx} q_id={question._id}
            removeQuestion={this.removeQuestion} updateVote={this.updateVote}
            updateResources={this.updateResources}>{question}</Question>
        )
      }.bind(this));
    }
    return this.props.questions.map(function(question, idx) {
      return (
        <Question
          topicId={this.props.topicId}
          key={idx} q_id={question._id}
          removeQuestion={this.removeQuestion} updateVote={this.updateVote}
          updateResources={this.updateResources}>{question}</Question>
      )
    }.bind(this));
  },

  postQuestion: function(question) {
    //append topic id to question object in order to identify the topic a question belongs to
    question.topic_id = this.props.topicId;
    $.ajax({
      type: 'POST',
      url: 'topics/topic/question',
      data: question,
      success: function(response) {
        this.setState({ questions: response.data });
      }.bind(this),
      error: function(xhr, status, err) {
      }.bind(this)
    });
  },
  //action property is used in the backend to specify database operation
  removeQuestion: function(question) {
    question.action = "remove";
    this.postQuestion(question);
  },

  updateVote: function(question) {
    question.action = "handleVote";
    this.postQuestion(question);
  },

  updateResources: function(question) {
    question.action = "handleResources";
    this.postQuestion(question);
  },

  render: function() {
    var topic_questions = this.listQuestions();
    return (
      <div className="topic">
        <h3>{this.props.text} <button className="btn btn-sm btn-danger glyphicon glyphicon-remove" onClick={this.remove}></button></h3>
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
      textAreaValue: this.props.children.resources
    };
  },

  componentDidMount: function() {
    socket.on('new_text', function(data) {
      if (data.q_id === this.props.q_id && data.topicId === this.props.topicId) {
        this.setState({ textAreaValue: data.content });
      }
    }.bind(this));
  },

  inform_clients: function(e){
    this.setState({textAreaValue: e.target.value});
    var resources = (e.target.value).split(/\r\n|\r|\n/g);
    var data = {
      q_id: this.props.q_id,
      topicId: this.props.topicId,
      content: resources
    };
     socket.emit('user_typing_pause', data);
  },

  remove: function() {
    this.props.removeQuestion({question_id: this.props.q_id});
  },

  //called when a question is upvoted
  upVote: function() {
    var count = this.props.children.votes + 1
    this.props.updateVote({question_id: this.props.q_id, vote: count});
  },

  //called when a question is downvoted
  downVote: function() {
    var count = this.props.children.votes - 1
    if (count >= 0) {
      this.props.updateVote({question_id: this.props.q_id, vote: count});
    }
  },

  updateResources: function(e) {
    var resources = (this.state.textAreaValue).split(/\r\n|\r|\n/g);
    for (var i = 0; i < resources.length; i++) {
      if (resources[i] !== this.props.children.resources[i]) {
        this.props.updateResources({question_id: this.props.q_id, resources: resources});
      }
    }
  },

  render: function() {
    return (
      <div className="question">
        <span className="question_title">
          {this.props.children.title}&nbsp;
          <button className="btn btn-sm btn-danger glyphicon glyphicon-remove" onClick={this.remove}></button>
        </span>
        <span className="votes">Votes: {this.props.children.votes}
          &nbsp;&nbsp;<button className="btn btn-success btn-sm glyphicon glyphicon-thumbs-up" onClick={this.upVote} />
          &nbsp;<button className="btn btn-warning btn-sm glyphicon glyphicon-thumbs-down" onClick={this.downVote} />
        </span>
        <textarea
          className="form-control"
          value={this.state.textAreaValue}
          onChange={this.inform_clients}
          onBlur={this.updateResources} />
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
      this.props.postTopic({title: topic});
    }
    this.setState({topic: ''});
  },

  render: function() {
    return (
      <div className="topic_form">
        <form onSubmit={this.submitHandler}>
          <input type="text" value={this.state.topic} onChange={this.handleTextChange}/>
          <input type="submit" value="Post Topic" />
        </form>
      </div>
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
      this.props.postQuestion({ title: question, resources: [""], votes: 0, action: "save" })
      this.setState({question: ''});
    }
  },

  render: function() {
    return (
      <div className="question_form">
        <form onSubmit={this.submitHandler}>
          <input type="text" value={this.state.question} onChange={this.handleTextChange} />
          <input type="submit" value="Post Question" />
        </form>
      </div>
    )
  }
});

ReactDOM.render(<Townhall url='/townhall/topics' />, document.getElementById('container'));
