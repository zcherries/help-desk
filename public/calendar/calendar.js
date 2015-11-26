//build current week dates
var currentWeek = [""];
for (var i = 0; i < 7; i++) {
  var date = moment().startOf('isoweek').add(i, 'days').toISOString();
  currentWeek.push(date);
  // console.log(moment(date).format("MM/DD/YYYY"));
}

var operatingHours = [
  "09:00:00", "10:00:00", '11:00:00', '12:00:00', '01:00:00', '01:00:00',
  '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00',
  '08:00:00', '09:00:00'
];

var formatDate = function(isoDate) {
  if (!isoDate) return "";
  return moment(isoDate).format("MM/DD/YYYY");
};

var Week = React.createClass({
  render: function() {
    console.log("Calendar: ", this.props.calendarEvent)
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

// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '844715614532-imoanb7n7gprtu38pedhi9crsoidammh.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

var week_events = {};

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadCalendarApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
  handleAuthResult);
  return false;
}

/**
 * Load Google Calendar client library. List upcoming events
 * once client library is loaded.
 */
function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listCalendars);
}

function listCalendars() {
  var calendarId = "";
  var request = gapi.client.calendar.calendarList.list();
  request.execute(function(resp) {
    for (var i = 0; i < resp.items.length; i++) {
      if (resp.items[i].id.indexOf("makersquare.com") > -1
        && resp.items[i].id.indexOf("@group") > -1) {
          calendarId = resp.items[i].id;
      }
    }
    listUpcomingEvents(calendarId);
  });
};

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(calendarId) {
  console.log("I'm in here")
  var request = gapi.client.calendar.events.list({
    'calendarId': calendarId,
    'timeMin': moment().startOf('isoweek').toISOString(),
    'timeMax': moment().endOf('isoweek').toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 30,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {
    var events = resp.items;
    // appendPre('Upcoming events:');

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        // if (!when) {
        //   when = event.start.date;
        // }
        //build out weekly events
        if (when) {
          var event_date = formatDate(when),
              startTime = formatDate(when, 'time'),
              endTime = formatDate(event.end.dateTime, 'time');

          if (week_events[event_date]) {
            week_events[event_date].push({summary: event.summary, start: startTime, end: endTime });
          } else {
            week_events[event_date] = [{summary: event.summary, start: startTime, end: endTime }];
          }
        }
        // appendPre(event.summary + ' (' + when + ')')
      }
      console.log(week_events);
      ReactDOM.render(<Week calendarEvent={week_events} />, document.getElementById('output'));
    } else {
      appendPre('No upcoming events found.');
    }
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

var formatDate = function(isoDate, fmtType) {
  if (!isoDate) return "";
  if (fmtType === 'time') {
    return moment(isoDate).format("hh:mm:ss");
  }
  return moment(isoDate).format("MM/DD/YYYY");
};
