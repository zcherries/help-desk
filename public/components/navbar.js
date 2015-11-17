//Component for User profile
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
    return (
      <div>
        <h3>User Component</h3>
        Welcome, {this.state.username}<br/>
        <span>Slack: {this.state.slack}</span>
        <span> | Github: <a href="">{this.state.github}</a> </span>
        <ShowList names={this.state.urls} />
        <AddLink addNew={this.addLink} />     
      </div>
    );
  }
});

//Component for MKS Org links
var NavOrg = React.createClass({
  getInitialState: function() {
    return {
      orgName: 'My Org',
      resource1: 'My First Resource Link',
      resource2: 'My Second Resource Link',
      resource3: 'HelpDesk'
    }
  },
  render: function() {
    return (
      <div>
        <h3>Org Component</h3>
        <span>{this.state.orgName}</span>
        <span> || </span>
        <span>{this.state.resource1}</span>
        <span>{this.state.resource2}</span>
      </div>
    );
  }
});

//sub-component for NavOrg.
//should refactor for use in any navbar component
var ShowList = React.createClass({
  render: function(){
    var listItems = this.props.names.map(function(item, idx){
      return <li key={idx}><a href="#">{item}</a></li>;
  });
    return (
      <div>
        <h4>Links</h4>
        <ul>
          {listItems}
        </ul>
      </div>
    );
  }
});

//for dev purposes. not needed depending on UI?
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
    return (
      <div>
        <input type="text" value={this.state.newLink} onChange={this.updateNewLink} />
        <button onClick={this.handleAddNew}> Add Link </button>
      </div>
    );
  }
});
    
//component to render multiple components inside navbar
var NavContainer = React.createClass({
  render: function() {
    return (
      <div>
        <div className="navbar navbar-left">
          <NavOrg />
        </div>
        <div className="navbar navbar-right">
          <NavUser />
        </div>
      </div>
    )
  }
});

ReactDOM.render(<NavContainer />, document.getElementById('navbar'));



  
