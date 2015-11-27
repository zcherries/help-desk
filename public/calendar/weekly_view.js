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
console.log("Top of weekly_view");

var formatDate = function(isoDate, fmtType) {
  if (!isoDate) return "";
  if (fmtType === 'time') {
    return moment(isoDate).format("hh:mm:ss");
  }
  return moment(isoDate).format("MM/DD/YYYY");
};

// function build_calendar_structure() {
  //build current week dates
  var currentWeek = [""];
  for (var i = 0; i < 7; i++) {
    var date = formatDate(moment().startOf('isoweek').add(i, 'days').toISOString());
    currentWeek.push(date);
  }

  var operatingHours = [
    "09:00:00", "10:00:00", '11:00:00', '12:00:00', '01:00:00', '01:00:00',
    '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00',
    '08:00:00', '09:00:00'
  ];
// };

var Week = React.createClass({
  render: function() {
    console.log("Calendar: ", this.props.events)
    return (
      <div>
        <div className="dates">
          {currentWeek.map(function(date, idx) {
            return <h3 key={idx}>{formatDate(date)}</h3>
          })}
        </div>

        <div className="week">
          <div className="schedule">
            {operatingHours.map(function(hr, idx) {
              return <div key={idx}>{hr}</div>
            })}
          </div>
          {currentWeek.slice(1).map(function(date, idx) {
            return <Day key={idx} date={date} />
          })}
        </div>
      </div>
    )
  }
});

var Day = React.createClass({
  render: function() {
    return (
      <div className="day">
        {operatingHours.map(function(hr, idx) {
          return ( <Hour key={idx} hour={hr} /> )
        })}
      </div>
    )
  }
});

var Hour = React.createClass({
  render: function() {
    return (
      <div className="hour"></div>
    )
  }
});

console.log("Bottom of weekly_view");

$(window).load(function () {
  var i = setInterval(function () {
      if (!lookingForEvents) {
          clearInterval(i);
          // safe to execute your code here
          ReactDOM.render(<Week events={week_events} />, document.getElementById('output'));
      }
  }, 100);
});
