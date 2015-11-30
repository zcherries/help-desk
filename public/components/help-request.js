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
      inputTags: [],
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
  },
  sendRequest: function(e) {
    e.preventDefault();
    _formData.content = this.refs.content.value.trim()
    _formData.timesubmitted = new Date();

    $.post('/', _formData, function(data) {
      console.log('successfully posted! data: ' + JSON.stringify(data));
      this.clearForm();
    }.bind(this));
    _formData.tags = [];
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

ReactDOM.render(
<HelpRequestTab className='help-request' />, document.getElementById('help-request')
);
