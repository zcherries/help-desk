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

//Question Component
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

//TopicForm Component
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
      <form onSubmit={this.submitHandler}>
        <input type="text" placeholder="Post a question" value={this.state.question} onChange={this.handleTextChange} />
        <input type="submit" value="Post Question" />
      </form>
    )
  }
});

ReactDOM.render(<Townhall url='/townhall/topics' />, document.getElementById('container'));
