(function() {
  // global vars
  var users = [
    {firstname:"Andrew",lastname:"Howes",email:"no email available",githandle:"andrewhws",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/0.jpg"},
    {firstname:"Aram",lastname:"Simonian",email:"no email available",githandle:"aram91",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/1.jpg"},
    {firstname:"Casandra",lastname:"Silva",email:"silvacasandra@gmail.com",githandle:"casandrawith1s",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/2.jpg"},
    {firstname:"Chelsea",lastname:"Cheung",email:"chelseatcheung@gmail.com",githandle:"chelseatcheung",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/3.jpg"},
    {firstname:"Cory",lastname:"Dang",email:"cory.q.dang@gmail.com",githandle:"coryd4ng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/4.jpg"},
    {firstname:"Seyi",lastname:"Williams",email:"no email available",githandle:"git2go",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/5.jpg"},
    {firstname:"Jeffrey",lastname:"Yang",email:"jeffycyang@gmail.com",githandle:"jeffycyang",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/6.jpg"},
    {firstname:"Jonathan",lastname:"Kvicky",email:"jonkvix@gmail.com",githandle:"jonkvix",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/7.jpg"},
    {firstname:"Jonathan",lastname:"Tamsut",email:"jtamsut1993@gmail.com",githandle:"jtamsut",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/8.jpg"},
    {firstname:"Kevin",lastname:"Cheng",email:"09chengk@gmail.com",githandle:"k-cheng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/9.jpg"},
    {firstname:"Marc",lastname:"Reicher",email:"msreicher@gmail.com",githandle:"marcreicher",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/10.jpg"},
    {firstname:"Marcus",lastname:"Ellis",email:"no email available",githandle:"marcusmellis89",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/11.jpg"},
    {firstname:"Mike",lastname:"Martin",email:"martinms.usc@gmail.com",githandle:"martinms-usc",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/12.jpg"},
    {firstname:"Matt",lastname:"Murkidjanian",email:"matthewmurkidjanian@gmail.com",githandle:"mmurkidjanian",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/13.jpg"},
    {firstname:"Nick",lastname:"Krein",email:"nkreinmusic@gmail.com",githandle:"nkreinmusic",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/14.jpg"},
    {firstname:"Stephanie",lastname:"Raad",email:"no email available",githandle:"Stephyraad",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/15.jpg"},
    {firstname:"Avi",lastname:"Samloff",email:"avi.samloff@gmail.com",githandle:"theavish",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/16.jpg"},
    {firstname:"Timothy",lastname:"Lai",email:"timothy.lai@gmail.com",githandle:"tim-lai",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/17.jpg"},
    {firstname:"Tina",lastname:"Lai",email:"no email available",githandle:"tinalai",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/18.jpg"},
    {firstname:"Vidiu",lastname:"Chiu",email:"vidiuchiu@gmail.com",githandle:"VDUCHEW",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/19.jpg"},
    {firstname:"William",lastname:"Carroll",email:"wcarroll@wustl.edu",githandle:"wpcarro",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/20.jpg"},
    {firstname:"Zachary",lastname:"Herries",email:"hotziggity@gmail.com",githandle:"zcherries",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/21.jpg"}
  ];

  // inline React style
  var imgStyle = {width: "100px", height: "100px", margin: "2px"};

  var avatarPaths = [];
  users.forEach(function(user) {
    avatarPaths.push(user.imgsrc);
  });

  var AvatarGallery = React.createClass({
    handleClick: function(e) {
      var userInfo = {
        imgsrc: e.target.getAttribute('src'),
        firstname: e.target.getAttribute('data-firstname'),
        lastname: e.target.getAttribute('data-lastname'),
        email: e.target.getAttribute('data-email'),
        githandle: e.target.getAttribute('data-githandle')
      };
      this.props.updateParentState(userInfo);
    },
    render: function() {
      var imgs = users.map(function(user, idx) {
        return (
          <img id="imgsrc"
               data-firstname={ user.firstname }
               data-lastname={ user.lastname }
               data-email={ user.email }
               data-githandle={ user.githandle }
               src={ user.imgsrc }
               className="clickable img-rounded"
               style={ imgStyle } 
               key={ idx }
               onClick={ this.handleClick } />
        );
      }.bind(this));
      return (
        <div className="avatar-gallery" style={ {clear: "both"} }>
          <h3>Choose an avatar</h3>
          { imgs }
        </div>
      );
    }
  });

  var StudentPreview = React.createClass({
    render: function() {
      var studentInfo = this.props.studentInfo;
      return (
        <div className="col-md-4">
          <img src={ studentInfo.imgsrc } className="img-rounded center-block" style={ imgStyle }/>
          <h4>{ studentInfo.firstname } { studentInfo.lastname }</h4>
          <p>{ studentInfo.email }</p>
          <p>{ 'http:\/\/github.com/' + studentInfo.githandle }</p>
        </div>
      );
    }
  });

  var AddStudentContainer = React.createClass({
    handleChange: function(state) {
      this.setState(state);
    },
    getInitialState: function() {
      return {
        firstname: 'First',
        lastname: 'Last',
        email: 'name@email.com',
        githandle: '',
        imgsrc: '../assets/student-avatars/default.gif'
      };
    },
    render: function() {
      return (
        <div className="app">
          <h1 className="text-center">My Cohort</h1>
          <AvatarGallery updateParentState={ this.handleChange } />
          <StudentPreview studentInfo={ this.state }/>
        </div>
      );
    }
  });

  ReactDOM.render(<AddStudentContainer />,document.getElementById('class-roster'));
})();