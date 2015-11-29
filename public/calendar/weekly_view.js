// var data = [
//   'Solo Week & Legacy Projects (2015-11-23T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-24T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-25T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-26T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-27T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-28T09:00:00-08:00)',
// ];
//
// moment().startOf('isoweek').toISOString()
// moment().endOf('isoweek').toISOString()
var formatDate = function(isoDate, fmtType) {
  if (!isoDate) return "";
  switch (fmtType) {
    case 'time':
      return moment(isoDate).format("hh:mm:ss");
      break;
    case 'day':
      console.log('day')
      return moment(isoDate).format("ddd MM/DD/YYYY");
      break;
    default:
      return moment(isoDate).format("MM/DD/YYYY");
  }
};

// function build_calendar_structure() {
  //build current week dates
  var currentWeek = [""];
  for (var i = 0; i < 7; i++) {
    var date = formatDate(moment().startOf('isoweek').add(i - 7, 'days').toISOString());
    currentWeek.push(date);
  }

  var operatingHours = [
    "09:00:00", "10:00:00", '11:00:00', '12:00:00', '13:00:00', '14:00:00',
    '15:00:00', '16:00:00', '17:00:00', '18:00:00', '19:00:00', '20:00:00',
    '21:00:00', '22:00:00'
  ];

  var minutes = [
    "00:00", "05:00", "10:00", "15:00", "20:00", "25:00", "30:00",
    "35:00", "40:00","45:00", "50:00", "55:00"
  ];
// };

var Week = React.createClass({
  render: function() {
    var week_events = this.props.events;
    // console.log("Calendar: ", week_events)
    return (
      <div>
        <div className="dates">
          {currentWeek.map(function(date, idx) {
            return <h3 key={idx}>{formatDate(date, 'day')}</h3>
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
            for (var i = 0, event; i < self.props.day_events.length; i++) {
              event = self.props.day_events[i];
              if (!event.recurringEvent && hr >= event.startTime && hr < event.endTime) {
                return <Hour key={idx} hour={hr} event={event}  />
              }
            }
          }
          return <Hour key={idx} hour={hr} />
        })}
      </div>
    )
  }
});

var Hour = React.createClass({
  render: function() {
    if (this.props.event)
      return <div className="hour hasEvent">{this.props.event.summary}</div>
    else
      return <div className="hour">
        <Minute />
      </div>
  }
});

var Minute = React.createClass({
  render: function() {
    return (
      <span className="minute"></span>
    )
  }
})

$(window).load(function () {
  var i = setInterval(function () {
      if (!lookingForEvents) {
          clearInterval(i);
          // safe to execute your code here
          ReactDOM.render(<Week events={week_events} />, document.getElementById('calendar'));
      }
  }, 100);
});
