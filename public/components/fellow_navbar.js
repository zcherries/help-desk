var socket = io();

//Component for User profile
var NavUser = React.createClass({
  render: function() {
    var placeholder = this.props.data;
    var placeholderUrls = this.props.data[0].urls;
    var userListItems = placeholderUrls.map(function(item,idx) {
      return (<MenuItem key={idx} href={item.link}>{item.text} </MenuItem>);
    });
    return (
        <NavDropdown eventKey={3} title={"Welcome, " + placeholder[0].username} id="basic-nav-dropdown">
          {userListItems}
        </NavDropdown>
    );
  }
});

var userData = [
  {id: 1,
    username: 'Fellow',
    slack: '#',
    github: '#',
    urls: [{text:'My Cohort',link:'#'},{text:'slackIt',link:'#'},{text:'gitHubIt',link:'#'},{text:'reactIt',link:'#'},{text:'nodeIt',link:'#'}]
  }
];

//Component for MKS Org links
var NavOrg = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    var orgListItems = this.props.data.map(function(item) {
      return <span key={item.id}><a href={item.link} target={item.target} /*onClick={HelpRequestManager.show}*/>{item.title}</a></span>;
    });
    return (
      <div>
        <div className='org-list'>{orgListItems}<span><a href="#" /*onClick={helpReq.show}*/>Help Desk</a></span></div>
      </div>
    )
  }
});

var Navbar = ReactBootstrap.Navbar;
var Nav = ReactBootstrap.Nav;
var NavItem = ReactBootstrap.NavItem;
var NavDropdown = ReactBootstrap.NavDropdown;
var MenuItem = ReactBootstrap.MenuItem;

var NavbarHD = React.createClass({
  toggle: function() {
    this.refs.left.toggle();
  },

  render: function() {
    return <div>
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/fellow/#">Help Desk Manager</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="http://bookstrap.makersquare.com/curriculum/curriculum" target="_blank">Syllabus</NavItem>
            <NavItem eventKey={2} href="http://bookstrap.makersquare.com/curriculum" target="_blank">Repo List</NavItem>
            <NavItem eventKey={2} href="http://wiki.makersquare.com/" target="_blank">Student Wiki</NavItem>
            <NavItem eventKey={2} href="/townhall/#">Townhall</NavItem>
            <NavItem eventKey={2} href="/calendar/#">Calendar</NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} onClick={this.toggle}>Toggle Bug Log</NavItem>
            <NavUser data={userData} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Menu ref="left" alignment="left">
        <BugLogContainer dataEndPoint={ dataEndPoint } />
      </Menu>
    </div>;
  }
});

var Menu = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
  },

  toggle: function() {
    this.state.visible === false ? this.setState({ visible: true }) : this.setState({ visible: false });
  },

  render: function() {
    return <div className="menu">
      <div className={(this.state.visible ? "visible " : "") + this.props.alignment}>{this.props.children}</div>
    </div>;
  }
});

var users = [
  {firstname:"Andrew",lastname:"Howes",email:"none",gitHandle:"andrewhws",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/0.jpg"},
  {firstname:"Aram",lastname:"Simonian",email:"none",gitHandle:"aram91",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/1.jpg"},
  {firstname:"Casandra",lastname:"Silva",email:"silvacasandra@gmail.com",gitHandle:"casandrawith1s",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/2.jpg"},
  {firstname:"Chelsea",lastname:"Cheung",email:"chelseatcheung@gmail.com",gitHandle:"chelseatcheung",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/3.jpg"},
  {firstname:"Cory",lastname:"Dang",email:"cory.q.dang@gmail.com",gitHandle:"coryd4ng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/4.jpg"},
  {firstname:"Seyi",lastname:"Williams",email:"none",gitHandle:"git2go",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/5.jpg"},
  {firstname:"Jeffrey",lastname:"Yang",email:"jeffycyang@gmail.com",gitHandle:"jeffycyang",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/6.jpg"},
  {firstname:"Jonathan",lastname:"Kvicky",email:"jonkvix@gmail.com",gitHandle:"jonkvix",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/7.jpg"},
  {firstname:"Jonathan",lastname:"Tamsut",email:"jtamsut1993@gmail.com",gitHandle:"jtamsut",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/8.jpg"},
  {firstname:"Kevin",lastname:"Cheng",email:"09chengk@gmail.com",gitHandle:"k-cheng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/9.jpg"},
  {firstname:"Marc",lastname:"Reicher",email:"msreicher@gmail.com",gitHandle:"marcreicher",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/10.jpg"},
  {firstname:"Marcus",lastname:"Ellis",email:"none",gitHandle:"marcusmellis89",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/11.jpg"},
  {firstname:"Mike",lastname:"Martin",email:"martinms.usc@gmail.com",gitHandle:"martinms-usc",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/12.jpg"},
  {firstname:"Matt",lastname:"Murkidjanian",email:"matthewmurkidjanian@gmail.com",gitHandle:"mmurkidjanian",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/13.jpg"},
  {firstname:"Nick",lastname:"Krein",email:"nkreinmusic@gmail.com",gitHandle:"nkreinmusic",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/14.jpg"},
  {firstname:"Stephanie",lastname:"Raad",email:"none",gitHandle:"Stephyraad",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/15.jpg"},
  {firstname:"Avi",lastname:"Samloff",email:"avi.samloff@gmail.com",gitHandle:"theavish",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/16.jpg"},
  {firstname:"Timothy",lastname:"Lai",email:"timothy.lai@gmail.com",gitHandle:"tim-lai",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/17.jpg"},
  {firstname:"Tina",lastname:"Lai",email:"none",gitHandle:"tinalai",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/18.jpg"},
  {firstname:"Vidiu",lastname:"Chiu",email:"vidiuchiu@gmail.com",gitHandle:"VDUCHEW",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/19.jpg"},
  {firstname:"William",lastname:"Carroll",email:"wcarroll@wustl.edu",gitHandle:"wpcarro",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/20.jpg"},
  {firstname:"Zachary",lastname:"Herries",email:"hotziggity@gmail.com",gitHandle:"zcherries",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/21.jpg"}
];

var randomIdx = Math.floor(Math.random() * users.length);
var randomUser = users[randomIdx];
var randomAuthor = randomUser.firstname + ' ' + randomUser.lastname;

var _formData = {
  author: randomAuthor,
  content: '',
  tags: [],
  timesubmitted: '',
  timeclosed: '',
  accepted: false,
  closed: false,
  assignedFellow: 'no fellow assigned',
  feedback: 'empty'
};

var author = 'Joe Nayigiziki';
var dataEndPoint = 'http://localhost:8000/data/bugalerts';


var Log = React.createClass({

  render: function() {
    return (
      <ul>
        {this.props.bugs.map((bug, taskIndex) =>
          <li key={taskIndex} onClick={this.props.remove} value={taskIndex} data={bug._id}>
            {bug.author + ': ' + bug.content}
          </li>
        )}
      </ul>
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

  remove: function (ev) {
    ev.preventDefault();
    var id = ev.target.data;
    console.log("remove clicked value:",ev.target.data);
    $.post('/data/bugs/delete', id);
    this.setState(function (state) {
      state.bugs.splice(ev.target.value,1);
      return {bugs: state.bugs};
    });
  },

  loadBugsFromServer: function() {
    console.log("data endpoint",this.props.dataEndPoint);

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
        <div className='help-text'>Bug Log</div>
        <BugCompose dataEndPoint={ this.props.dataEndPoint } />
        <Log bugs={ this.state.bugs } remove={this.remove} />
      </div>
    );
  }
});

ReactDOM.render(<NavbarHD />, document.getElementById("nav"));
