// global vars
        var imgStyle = {width: "100px", height: "100px", margin: "2px"};
        var imagePath = '../class-roster/img';
        var avatarPaths = [];
        for (var i=0; i<22; i++) {
          avatarPaths.push(imagePath + '/' + i + '.jpg');
        }


        var AvatarGallery = React.createClass({
          handleClick: function(e) {
            var imgsrc = e.target.getAttribute('src');
            var state = {imgsrc: imgsrc};
            this.props.updateParentState(state);
          },
          render: function() {
            var imgs = avatarPaths.map(function(url, idx) {
              return (
                <img id="imgsrc"
                     src={ url }
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
                <p>http://github.com/{ studentInfo.gitHandle }</p>
              </div>
            );
          }
        });

        var AddStudentForm = React.createClass({
          handleChange: function(e) {
            console.log(e.target.id);
            var state = {};
            state[e.target.id] = e.target.value;
            this.props.updateParentState(state);
          },
          render: function() {
            return (
              <div className="col-md-8">
                <form method="post">
                  <label htmlFor="firstname">First name:</label>
                  <input type="text" id="firstname" onChange={ this.handleChange } />
                  <label htmlFor="lastname">Last name:</label>
                  <input type="text" id="lastname" onChange={ this.handleChange }/>
                  <label htmlFor="email">Email:</label>
                  <input type="text" id="email" onChange={ this.handleChange }/>
                  <label htmlFor="git-handle">GitHub username:</label>
                  <input type="text" id="gitHandle" onChange={ this.handleChange }/>
                </form>
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
              gitHandle: '',
              imgsrc: './img/default.gif'
            };
          },
          render: function() {
            return (
              <div className="app">
                <h1 className="text-center">Add New Student</h1>
                <AddStudentForm updateParentState={ this.handleChange }/>
                <StudentPreview studentInfo={ this.state }/>
                <AvatarGallery updateParentState={ this.handleChange } />
              </div>
            );
          }
        });

        ReactDOM.render(
          <AddStudentContainer />,
          document.getElementById('react-mountpoint')
        );