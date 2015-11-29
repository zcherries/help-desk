$(document).ready(function() {
   $.getJSON( "./fellowlist.json", function( data ) {
      var results = [];
      for(var key in data) {
         document.write("user with the name " + data[key].fellowName + " has a profile picture as shown here" + "<br>");
      }
   });
});


// console.log(results)

// var FellowList = React.createClass({
//    render: function() {
//       return (
//          <div>
//            <fellow></fellow>
//          </div>
//       )
//    }
// })


var FellowList = React.createClass({

   componentWillMount: function() {
      console.log('fellow list is ready');
   },
   render: function() {
      return (
         <p>hi</p>
      );
   }
});

ReactDOM.render(<FellowList />, document.getElementById("result"));
