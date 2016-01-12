//this file uses the formatDate function defined in calendar.js

//use operating hours and minutes are used to build calendar structure
var operatingHours = [
  "09:00:00", "10:00:00", '11:00:00', '12:00:00', '13:00:00', '14:00:00',
  '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00',
  '21:00:00', '22:00:00'
];

var minutes = [
  "00:00", "05:00", "10:00", "15:00", "20:00", "25:00", "30:00",
  "35:00", "40:00","45:00", "50:00", "55:00"
];

var Calendar = React.createClass({
  getInitialState: function() {
    return { events: {} }
  },

  componentDidMount: function() {
    var $calendars = $('.calendars');
    // console.log($calendars)
    $('body').on('change', $calendars, function(e) {
      e.preventDefault();
      console.log('Selected change')
      listUpcomingEvents($('.calendars option:selected').val())
      this.lookForEvents();
    }.bind(this));

    this.lookForEvents();
  },
  //checks for call to calendar api to finish running
  //then updates state
  lookForEvents: function() {
    var self = this;
    _lookingForEvents = true, week_events = {};
    var i = setInterval(function () {
      if (!_lookingForEvents) {
        clearInterval(i);
        // safe to execute your code here
        self.setState({ events: week_events });
      }
    }, 100);
  },

  prevWeek: function() {
    //update the timeMin and timeMax to the appropriate dates
    var timeMax = EVENT_REQUEST_CRITERIA['timeMin'];
    EVENT_REQUEST_CRITERIA['timeMin'] = moment(EVENT_REQUEST_CRITERIA.timeMin).add(-1, 'week').toISOString();
    EVENT_REQUEST_CRITERIA['timeMax'] = timeMax;

    this.lookForEvents();
    //call function (in calendar.js)
    listUpcomingEvents(EVENT_REQUEST_CRITERIA['calendarId']);
  },

  nextWeek: function() {
    //update
    var timeMin = EVENT_REQUEST_CRITERIA['timeMax'];
    EVENT_REQUEST_CRITERIA['timeMin'] = timeMin;
    EVENT_REQUEST_CRITERIA['timeMax'] = moment(EVENT_REQUEST_CRITERIA.timeMax).add(1, 'week').toISOString();
    this.lookForEvents();
    listUpcomingEvents(EVENT_REQUEST_CRITERIA['calendarId']);
  },

  render: function() {
    var currentWeek = [""];
    for (var i = 0; i < numOfDays; i++) {
      var date = moment(EVENT_REQUEST_CRITERIA['timeMin']).add(i, 'days').toISOString();
      currentWeek.push(formatDate(date));
    }
    return (
      <div>
        <div className="navButtons">
          <button onClick={this.prevWeek}>Previous</button>
          <button onClick={this.nextWeek}>Next</button>
        </div>
        <Week currentWeek={currentWeek} events={this.state.events} />
      </div>
    )
  }
})

var Week = React.createClass({
  render: function() {
    var week_events = this.props.events;
    var currentWeek = this.props.currentWeek;
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

ReactDOM.render(<Calendar />, document.getElementById('calendar'));
