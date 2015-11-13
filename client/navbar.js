
var HelloUser = React.createClass({
  getInitialState: function () {
    return {
       username: 'mks-user'
    }
  },

  render: function(){
    return ( <div> 
      Hello {this.state.username} <br />
      Change Name: <input type="text" value={this.state.username} onChange= {this.handleChange} /><br />
      note 1: need to define component before you can render it<br/>
      note 2: render return can only contain 1 div element <br />
      
    </div>)
  },
  
  handleChange: function(e){
    this.setState({
      username: e.target.value
    });
  }, 
});
        
React.render(<HelloUser />, document.getElementById('app'));


var NavUser = React.createClass({
  getInitialState: function() {
    return {
      username: 'default-user',
      slack: '#',
      github: '#',
      urls: ['slackIt', 'gitHubIt', 'reactIt', 'nodeIt']
    }
  },
  addLink: function(url){
    this.state.urls.push(url);
    this.setState({
      urls: this.state.urls
    });
  },
  render: function() {
    return (<div>
      <h3>User Component</h3>
      Welcome, {this.state.username} <br/>
      <span>Slack: {this.state.slack} </span>
      <span> | Github: <a href=""> {this.state.github}</a> </span>
      <ShowList names={this.state.urls} />
      <AddLink addNew={this.addLink} />     
    </div>)
  }
});

var NavOrg = React.createClass({
  getInitialState: function() {
    return {
      orgName: 'My Org',
      resource1: 'My First Resource Link',
      resource2: 'My Second Resource Link'
    }
  },
  render: function() {
    return (<div>
      <h3>Org Component</h3>
      <span>{this.state.orgName} </span>
      <span> || </span>
      <span>{this.state.resource1} </span>
      <span>{this.state.resource2}</span>
    </div> )
  }
});

var ShowList = React.createClass({
  render: function(){
    var listItems = this.props.names.map(function(item){
      return <li>{item} </li>;
  });
  return (
    <div>
      <h4> Links </h4>
      <ul> <a href=""> {listItems} </a> </ul>
    </div>)
  }
});

var AddLink = React.createClass({
  getInitialState: function(){
    return {
      newLink: ''
    }
  },
  propTypes: {
    addNew: React.PropTypes.func.isRequired
  },
  updateNewLink: function (e){
    this.setState({
      newLink: e.target.value
    });
  },
  handleAddNew: function(){
    this.props.addNew(this.state.newLink);
    this.setState({
      newLink: ''
    });
  },
  render: function(){
    return (<div>
      <input type="text" value={this.state.newLink} onChange={this.updateNewLink} />
      <button onClick={this.handleAddNew}> Add Link </button>
    </div>)
  }
});
    

var NavContainer = React.createClass({
  render: function() {
    return (
      <div>
        <NavOrg />
        <NavUser />
      </div>
    )
  }
});

React.render(<NavContainer />, document.getElementById('navbar'));



  
