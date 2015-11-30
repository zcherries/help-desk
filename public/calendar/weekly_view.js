  var operatingHours = [
    "09:00:00", "10:00:00", '11:00:00', '12:00:00', '13:00:00', '14:00:00',
    '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00',
    '21:00:00', '22:00:00'
  ];

  var minutes = [
    "00:00", "05:00", "10:00", "15:00", "20:00", "25:00", "30:00",
    "35:00", "40:00","45:00", "50:00", "55:00"
  ];

var Week = React.createClass({
  getInitialState: function() {
    return { events: {} }
  },

  componentDidMount: function() {
    var self = this;
    var i = setInterval(function () {
          if (!lookingForEvents) {
              clearInterval(i);
              // safe to execute your code here
              self.setState({ events: week_events });
              // ReactDOM.render(<Week events={week_events} />, document.getElementById('calendar'));
          }
      }, 100);
  },

  render: function() {
    var week_events = this.state.events;
    console.log("Week: ", currentWeek)
    return (
      <div>
        <div className="dates">
          {currentWeek.map(function(date, idx) {
              return <h3 className="flx" key={idx}>{formatDate(date, 'day')}</h3>
          })}
        </div>

        <div className="week">
          <div className="schedule">
            {operatingHours.map(function(hr, idx) {
              return <div key={idx}>{hr}</div>
            })}
          </div>
          {currentWeek.slice(1).map(function(date, idx) {
            if (week_events[date])
              return <Day key={idx} date={date} day_events={week_events[date]} />
            else
              return <Day key={idx} date={date} />
          })}
        </div>
      </div>
    )
  }
});

var Day = React.createClass({
  render: function() {
    var self = this;
    return (
      <div className="day">
        {operatingHours.map(function(hr, idx) {
          if (self.props.day_events) {
            var hr_events = [];
            for (var i = 0; i < self.props.day_events.length; i++) {
              var event = self.props.day_events[i];
              if (hr.slice(0,2) >= event.startTime.slice(0,2) && hr < event.endTime ) {
                // console.log("Hour: " + hr, "Event: ", event)
                hr_events.push(event);
              }
            }
            return <Hour key={idx} hour={hr} hr_events={hr_events} />
          } else {
            return <Hour key={idx} hour={hr} />
          }
        })}
      </div>
    )
  }
});

var Hour = React.createClass({
  render: function() {
    var self = this;
    // console.log("Hour: ", this.props.hour, "Events: ", this.props.hr_events)
    if (this.props.hr_events) {
      var hr = this.props.hour.slice(0,3);
      return (<div className="hour">
        {minutes.map(function(min, idx) {
          for (var i = 0; i < self.props.hr_events.length; i++) {
            var hr_event = self.props.hr_events[i];
            if (hr + min === hr_event.startTime) {
              return <Minute key={idx} hasEvent={true} event_detail={hr_event} />
            }
            if (hr + min >= hr_event.startTime && hr + min < hr_event.endTime) {
              return <Minute key={idx} hasEvent={true} />
            }
          }
          return <Minute key={idx} />
        })}
        </div>)
    }
    else {
      return <div className="hour"></div>
    }
  }
});

var Minute = React.createClass({
  render: function() {
    if (this.props.hasEvent){
      if (this.props.event_detail) {
        var startTime = formatDate(this.props.event_detail.startTime, 'time'),
            endTime = formatDate(this.props.event_detail.endTime, 'time');
        return (
          <span className="minEvent detail">{this.props.event_detail.summary}
          {" (" + this.props.event_detail.startTime +
          " - " + this.props.event_detail.endTime + ")"}
          </span>
        )
      } else {
        return <span className="minute minEvent"></span>
      }
    }
    return <span className="minute"></span>
  }
});

ReactDOM.render(<Week />, document.getElementById('calendar'));
