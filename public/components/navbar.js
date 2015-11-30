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
      return (<li key={idx}><a href={item.link}>{item.text}</a> </li>);
    });
    return (
        <div>
          <p onClick={this.show} role="button" className="dropdown-toggle" data-toggle="dropdown"> Welcome, {placeholder[0].username} <span className="caret"></span> </p>
          <ul id='dropdown' className={"dropdown-menu" + (this.state.listVisible ? <ul>{userListItems}</ul> : "" )}>{userListItems}</ul>
        </div>
    );
  }
});


var userData = [
  {id: 1,
    username: 'default-user',
    slack: '#',
    github: '#',
    urls: [{text:'My Cohort',link:'#'},{text:'slackIt',link:'#'},{text:'gitHubIt',link:'#'},{text:'reactIt',link:'#'},{text:'nodeIt',link:'3'}]
  },
];

//Component for MKS Org links
var NavOrg = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    var orgListItems = this.props.data.map(function(item) {
      return <span key={item.id}><a href={item.link} target={item.target} >{item.title}</a></span>;
    });
    return (
      <div>
        <div className='org-list'>{orgListItems}<span><a href="#" >Help Desk</a></span></div>
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
            <a href="/student/#">Student Help Desk</a>
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
            <NavItem eventKey={1} onClick={this.toggle}>Toggle Help Desk</NavItem>
            <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Action</MenuItem>
              <MenuItem eventKey={3.2}>Another action</MenuItem>
              <MenuItem eventKey={3.3}>Something else here</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Separated link</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Menu ref="left" alignment="left">
        <HelpRequestTab />
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

var Tag = React.createClass({
  removeSelf: function(e) {
    this.props.parentRemoveTag(this.refs.tagText.innerHTML);
  },
  render: function() {
    return (
      <div className="chip" tagName={ this.props.text } onClick={ this.removeSelf }>
        <span ref="tagText">{ this.props.text }</span><i className='material-icons'>close</i>
      </div>
    );
  }
});

var TagContainer = React.createClass({
  render: function () {
    var tagNodes = this.props.data.map(function(tag, idx) {
      return (
        <Tag text={ tag } parentRemoveTag={ this.props.parentRemoveTag } key={ idx } />
      );
    }.bind(this))
    return (
      <div className="taglist">
        { tagNodes }
      </div>
    );
  }
});

var TagSubmit = React.createClass({
  getInitialState: function() {
    return {
      inputTags: []
    };
  },
  clearForms: function() {
    this.refs.tag.value = '';
  },
  parentRemoveTag: function(tagText) {
    var inputTags = this.state.inputTags.slice();
    var tagIdx = inputTags.indexOf(tagText);
    inputTags.splice(tagIdx, 1)
    this.setState({
      inputTags: inputTags
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var tagText = this.refs.tag.value.trim();
    _formData.tags.push(tagText);
    this.setState({
      inputTags: this.state.inputTags.concat(tagText)
    });
    this.clearForms();
  },
  render: function () {
    return (
      <div className='submit-tags'>
        <form className="submit-tag" onSubmit={this.handleSubmit} >
          <input type="text" id='input' autoComplete="off" placeholder="Enter tags" ref="tag"/>
          <input type="submit" id='input-submit' value="Add Tags" />
        </form>
        <TagContainer data={ this.state.inputTags } parentRemoveTag={ this.parentRemoveTag } />
      </div>
    );
  }
});

var HelpRequestTab = React.createClass({
  clearForm: function() {
    this.refs.content.value = '';
    this.refs
  },
  sendRequest: function(e) {
    e.preventDefault();
    _formData.content = this.refs.content.value.trim()
    _formData.timesubmitted = new Date();
    $.post('/', _formData, function(data) {
      console.log('successfully posted! data: ' + JSON.stringify(data));
      this.clearForm();
    }.bind(this));
  },
  render: function() {
    return (
      <div className="help">
        <div className='help-text'>Help</div>
        <textarea ref="content" className="request-text form-control" rows="3" id="content" placeholder="What do you need help on?"></textarea>
        <TagSubmit /><br/>
        <button id='request-submit' onClick={this.sendRequest}>Submit Help Request</button>
      </div>
    );
  }
});

ReactDOM.render(<NavbarHD />, document.getElementById("nav"));
