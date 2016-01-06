(function() {

	var fellowList = [
	{firstname:"Thomas",lastname:"Greenhalgh",email:"thomas.greenhalgh@gmail.com",gitHandle:"tgreenhalgh",location:"Santa Monica, CA.",imgsrc:"../assets/fellow-avatars/thomas.jpeg", isFellow: true, availability: 1},
    {firstname:"Joe",lastname:"Nayigiziki",email:"joseph.nayigiziki@makersquare.com",gitHandle:"Nayigiziki",location:"Santa Monica, CA.",imgsrc:"../assets/fellow-avatars/joe_n.jpeg", isFellow: true, availability: 1},
    {firstname:"Melinda",lastname:"Bernardo",email:"melindabernardo@gmail.com",gitHandle:"melindabernardo",location:"Los Angeles, CA.",imgsrc:"../assets/fellow-avatars/melinda.jpeg", isFellow: true, availability: 2},
    {firstname:"Ricky",lastname:"Walker",email:"rickwalk45@gmail.com",gitHandle:"Unconfined",location:"Baton Rouge, LA.",imgsrc:"../assets/fellow-avatars/ricky_w.jpeg", isFellow: true, availability: 2},
    {firstname:"Irving",lastname:"Barajas",email:"irvingb232@gmail.com",gitHandle:"irvingaxelb",location:"Santa Monica, CA.",imgsrc:"../assets/fellow-avatars/irving.jpeg", isFellow: true, availability: 3}
	];

	var fellowIdx = Math.floor(Math.random() * fellowList.length);

	var fellowInfo = {
		name: fellowList[fellowIdx].firstname + ' ' + fellowList[fellowIdx].lastname
	};

	console.log(fellowInfo);

	var socket = io();
	// socket listeners are found in componentWillMount
	// of the parent-most Component

	var HelpRequestEntry = React.createClass({
		handleClick: function(e) {
			var helpRequestEntry = this.props.obj;
			_.extend(helpRequestEntry, fellowInfo);
			switch (this.props.status) {
				case 'outstanding':
					socket.emit('accept-hr', helpRequestEntry);
					break;
				case 'in-progress':
					socket.emit('close-hr', helpRequestEntry);
					break;
				case 'closed':
					break;
			}
		},
		render: function() {
			var obj = this.props.obj;
			var tags = obj.tags.map(function(tag, idx) {
				return (<span className="tag" key={ idx }>{ tag }</span>);
			});
			console.log('obj: ' + obj.accepted);
			switch (this.props.status) {
				case 'outstanding':
					return (
						<div className="db-entry" id='needs-help' onClick={ this.handleClick }>
							<p>{ obj.author } needs help with: </p>
							<p>"{ obj.content }"</p>
							<p>{ tags }</p>
							<p>{ obj.timesubmitted }</p>
						</div>
					);
				case 'in-progress':
					return (
						<div className="db-entry" id='is-helping' onClick={ this.handleClick }>
							<p>{ obj.assignedFellow } is helping { obj.author }</p>
							<p>{ tags }</p>
							<p>{ obj.timesubmitted }</p>
						</div>
					);
				case 'closed':
					return (
						<div className="db-entry" id='helped' onClick={ this.handleClick }>
							<p>{ obj.assignedFellow } helped { obj.author } with:</p>
							<p>{ tags }</p>
							<p>{ obj.timesubmitted }</p>
						</div>
					);
			}
		}
	});

	var HelpRequestManager = React.createClass({
		parentHandleClick: function(data) {
			// console.log('Fellow accepted HR');
			 this.getMongo();
		},
		getMongo: function() {
			$.get(this.props.source, function(data) {
	  		console.log('success: ' + JSON.stringify(data));
	  		if(this.isMounted()) {
	  			this.setState({
	  				helpRequests: [].concat(data)
	  			});
	  		}
	  	}.bind(this));
		},
		getInitialState: function() {
	  	return {
	  		helpRequests: []
	  	};
		},
		componentWillMount: function() {
			this.getMongo();
		},
		componentDidMount: function() {
			var socket = io();
			socket.on('fellow-closed', function(data) {
				console.log('fellow-closed: ' + JSON.stringify(data));
				this.getMongo();
			}.bind(this));
			socket.on('fellow-accepted', function(data) {
				console.log('fellow-accepted: ' + JSON.stringify(data));
				this.getMongo();
			}.bind(this));
		  socket.on('entry-deleted', function (data) {
		    console.log('entry-deleted: ' + JSON.stringify(data));
		    this.getMongo();
		  }.bind(this));
		  socket.on('entry-added', function(data) {
		  	console.log('entry-added: ' + JSON.stringify(data));
		    this.getMongo();
		  }.bind(this));
		},
		render: function() {
			var outstandingHRs = [];
			var inProgressHRs = [];
			var closedHRs = [];
			this.state.helpRequests.forEach(function(helpRequest, idx) {
				if (helpRequest.accepted && !helpRequest.closed) {
					console.log('adding entry: in-progress');
					inProgressHRs.push(<HelpRequestEntry obj={ helpRequest } key={ idx } status="in-progress" parentClickHandler={ this.parentHandleClick } />);
				} else if (!helpRequest.accepted && !helpRequest.closed) {
					console.log('adding entry: oustanding');
					outstandingHRs.push(<HelpRequestEntry obj={ helpRequest } key={ idx } status="outstanding" parentClickHandler={ this.parentHandleClick } />);
				} else {
					console.log('adding entry: closed');
					// if ()
					closedHRs.push(<HelpRequestEntry obj={ helpRequest } key={ idx } status="closed" parentClickHandler={ this.parentHandleClick } />);
				}
			}.bind(this));
			return (
				<div>
					<div id="oustanding" className="col-md-4">
						<h3 className="text-center">Outstanding</h3>
						{ outstandingHRs }
					</div>
					<div id="in-progress" className="col-md-4">
						<h3 className="text-center">In Progress</h3>
						{ inProgressHRs }
					</div>
					<div id="closed" className="col-md-4">
						<h3 className="text-center">Closed</h3>
						{ closedHRs }
					</div>
				</div>
			);
		}
	});

	ReactDOM.render(
		<HelpRequestManager source='http://localhost:8000/data' />,
		document.getElementById('help-requests')
	);
})();
