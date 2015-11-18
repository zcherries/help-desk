
//Component for User profile
var NavUser = React.createClass({
  getInitialState: function() {
    return {
      listVisible: false
    };
  },

  select: function(item) {
    this.props.selected = item;
  },

  show: function() {
    this.setState({ listVisible: true });
    document.addEventListener("click", this.hide);
  },

  hide: function() {
    this.setState({ listVisible: false });
    document.removeEventListener("click", this.hide);
  },

  render: function() {
    var placeholder = this.props.data;
    var placeholderUrls = this.props.data[0].urls;
    var userListItems = placeholderUrls.map(function(item,idx) {
      return <li key={idx}><a href="{item}">{item}</a> </li>;
    });
    return (
        <div>
        <p onClick={this.show} role="button" className="dropdown-toggle" data-toggle="dropdown"> Welcome, {placeholder[0].username} <span className="caret"></span> </p>
        <ul id='dropdown' className={"dropdown-menu" + (this.state.listVisible ? <ul>{userListItems}</ul> : "" )}>{userListItems}</ul>
        
        </div>
    )
  }
});


var userData = [
  {id: 1, 
    username: 'default-user', 
    slack: '#', 
    github: '#', 
    urls: ['My Cohort','slackIt', 'gitHubIt', 'reactIt', 'nodeIt']
  },
];

var orgData = [
  {id: 1, title: 'Syllabus', link: '#'},
  {id: 2, title: 'Repo List', link: '#'},
  {id: 3, title: 'Wiki', link: '#'},
  {id: 4, title: 'Help Desk', link: '#'},
];

//Component for MKS Org links
var NavOrg = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    var orgListItems = this.props.data.map(function(item) {
      return <span key={item.id}><a href="{item.link}">{item.title}</a></span>;
    });
    return (
      <div>
        <div className='org-list'>{orgListItems}</div>
      </div>
    ) 
  }
});
    
//component to render multiple components inside navbar
var NavContainer = React.createClass({
  render: function() {
    return (
      <nav className="navbar ">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" >
            <div className="navbar-left">
            </div>
            <ul className="nav navbar-nav navbar-right" >
              <li>
                <NavOrg data={orgData} />
              </li>
      
              <li>
                <NavUser data={userData} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
});

ReactDOM.render(<NavContainer />, document.getElementById('navbar'));


//dropdown backup
        // <p className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" onClick={this.show}> Welcome, {placeholder[0].username} <span className="caret"></span> </p>
        //   {this.state.listVisible ? <ul>{userListItems}</ul> : "" }

// render backup
//         <div className="navbar-nav navbar-collapse collapse navbar-right" >
//           <div style={{display: 'inline-block'}}>
//           </div>
//           <div style={{display: 'inline-block'}}>
//           <p>&nbsp; </p>
//           </div>
//           <div style={{display: 'inline-block'}}>
//           </div>
//         </div>
  
