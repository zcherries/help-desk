var BugView = React.createClass({
	closeTag: function (e) {
          // console.log(e)
          $(e.target).closest('div').remove();
          // console.log('current state : ' + JSON.stringify(this.state));
          //remove from the database as well
        },
        render: function () {
          var bugNodes = this.props.data.map(function(bug, idx) {
            return (
              <div key={idx}>{bug.text}</div>
              );
          }.bind(this))
          return (
            <div className="buglist">{bugNodes}</div>
          );
        }
    });



var BugSubmit = React.createClass({
        handleSubmit: function (event) {
          	event.preventDefault();

        	var date = new Date();

        	var bugObject = {

        		author: this.refs.bugFellow.value.trim(),
        		timestamp: date,
        		bugText: this.refs.bug.value.trim()

        	};

          console.log(this.state.inputData)
          this.refs.bugFellow.value = '';
          this.refs.bug.value = '';

          $.ajax({
            type: 'POST',
            url: server,
            data: bugObject,
            success:function(){
            	console.log("Bug sent to database");
            },
            dataType:
          })
        },
        render: function () {
          return (
          <div className='submit-tags'>
          <form className="submit-tag" onSubmit={this.handleSubmit} >
            <input type="text" id='input' autoComplete="on" placeholder="Which fellow are you" ref="bugFellow"/>
            <input type="text" id='input' autoComplete="on" placeholder="Whats the bug?" ref="bug"/>
            <input type="submit" value="Add Tags" />
          </form> 
          <RenderTags data={this.state.inputData} />
          </div>
          );
        }
      });

});
var Buglog = React.createClass({

	getInitialState: function(){
		return{
			data: []
		}
	}

	loadBugsFromServer: function(){
		$.ajax({
            type: 'GET',
            url: server,
            data: bugObject,
            success:function(){
            	this.setState({data: this.state.data.concat(data)});
            	console.log("Bug sent to database");
            },
            dataType:
          })

	},

	componentDidMount: function() {
          this.loadBugsFromServer();
          setInterval(this.loadBugsFromServer, this.props.bugInterval);
    },


	render:function(){

		return (
			<div>
				<BugSubmit />
				<BugView data={ this.state.data } />
			</div>

			);
	}
});