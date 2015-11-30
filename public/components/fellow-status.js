// in Log component,
// in willUnmount: ( when component is removed, willUnmount fires the function )
// call the post request tomorrow

// parent component will have a method that handles the deleting of the ajax
// pass down as a prop to your child components
// when you click on it, find a way to pass the ID as a method,
// call the ajax request to the server
// server sends a response back,
// and the parent component receives it and resets its state

// don't worry about deleting it from the dom
// that's a side effect of deleting it off the database



handleClick: function() {
          var data = { id: this.props.obj._id };
          $.post('http://localhost:8000/data/delete', data, function(data) {
            console.log('posted!');
            this.props.parentClickHandler(data);
          }.bind(this));
        },

render: function() {
          var objectProps = [];
          for (var key in this.props.obj) {
            objectProps.push(<p>{key + ': ' + this.props.obj[key]}</p>);
          }
          return (
            <div className="db-entry" onClick={ this.handleClick }>
              <span>{ objectProps }</span>
            </div>
          );
        }


(function() {

  var fellows = [
    {firstname:"Andrew",lastname:"Howes",email:"none",gitHandle:"andrewhws",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/0.jpg"},
    {firstname:"Aram",lastname:"Simonian",email:"none",gitHandle:"aram91",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/1.jpg"},
    {firstname:"Casandra",lastname:"Silva",email:"silvacasandra@gmail.com",gitHandle:"casandrawith1s",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/2.jpg"},
    {firstname:"Chelsea",lastname:"Cheung",email:"chelseatcheung@gmail.com",gitHandle:"chelseatcheung",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/3.jpg"},
    {firstname:"Cory",lastname:"Dang",email:"cory.q.dang@gmail.com",gitHandle:"coryd4ng",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/4.jpg"},
    {firstname:"Seyi",lastname:"Williams",email:"none",gitHandle:"git2go",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/5.jpg"},
    {firstname:"Jeffrey",lastname:"Yang",email:"jeffycyang@gmail.com",gitHandle:"jeffycyang",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/6.jpg"},
    {firstname:"Jonathan",lastname:"Kvicky",email:"jonkvix@gmail.com",gitHandle:"jonkvix",location:"Los Angeles, CA.",imgsrc:"../assets/student-avatars/7.jpg"}
  ];

  var randomIdx = Math.floor(Math.random() * fellow.length);
  var randomFellow = fellows[randomIdx];
  var randomAuthor = randomFellow.firstname + ' ' + randomFellow.lastname;

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

  var AvailFellows = React.createClass({
    render: function() {
      var info;
      return (
        <div>{this.props.fellows}</div>
      )
    }
  })

  ReactDOM.render(
    <FellowComponent className='fellow-status'/>, document.getElementById('fellow-status')
  );
})();