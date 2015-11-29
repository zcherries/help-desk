// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '844715614532-imoanb7n7gprtu38pedhi9crsoidammh.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

var week_events = {},
    lookingForEvents = true,
    currentWeek = [""];

// var startDate = currentWeek[1],
// var endDate = currentWeek[];

var formatDate = function(dt, fmtType) {
  if (!dt) return "";
  switch (fmtType) {
    case 'time':
      return moment(dt).format("hh:mm:ss");
      break;
    case 'time24':
      return moment(dt).format("HH:mm:ss");
      break;
    case 'day':
      return moment(dt).format("ddd MM/DD/YYYY");
      break;
    default:
      return moment(dt).format("MM/DD/YYYY");
  }
};
var numOfDays = 6;
for (var i = 0; i < numOfDays; i++) {
  var date = formatDate(moment().startOf('isoweek').add(i - 7, 'days').toISOString());
  currentWeek.push(date);
}
// console.log("Week: ", currentWeek)
/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  // console.log('Checking auth')
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
 var _eventsRequestParameter = {
   'timeMin': moment().startOf('isoweek').add(-7, 'days').toISOString(),
   'timeMax': moment().startOf('isoweek').add(-1, 'days').toISOString(),
   'showDeleted': false,
   'singleEvents': true,
   'maxResults': 250,
   'orderBy': 'startTime'
 };

function listUpcomingEvents(calendarId) {
  //add calendar id to parameter Object
  // console.log("Calendar Id: ", calendarId)
  _eventsRequestParameter['calendarId'] = calendarId;
  var request = gapi.client.calendar.events.list(_eventsRequestParameter);

  request.execute(function(resp) {
    var events = resp.items;
    // appendPre('Upcoming events:');
    // console.log("Events: ", events)
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        // var when = event.start.dateTime;
        // if (!when) {
        //   when = event.start.date;
        // }
        //build out weekly events
        if (event.start.dateTime) {
          var event_date = formatDate(event.start.dateTime), startTime = formatDate(event.start.dateTime, 'time24'),
              endTime = formatDate(event.end.dateTime, 'time24'), recurringEvent = event['recurringEventId'] ? true: false;

          if (week_events[event_date]) {
              //handle duplicates
              // var duplicateFound = false;
              // for (var i = 0; i < week_events[event_date].length; i++) {
              //   var wEvent = week_events[event_date][i];
              //   if (event.summary === wEvent.summary
              //       && startTime === wEvent.startTime && endTime === wEvent.endTime) {
              //         duplicateFound = true;
              //         break;
              //       }
              // }
              // if (!duplicateFound) {
                week_events[event_date].push({summary: event.summary,
                startTime: startTime, endTime: endTime, recurringEvent: recurringEvent });
              // }
          } else {
              week_events[event_date] = [{summary: event.summary,
              startTime: startTime, endTime: endTime, recurringEvent: recurringEvent }];
          }
        }
        // appendPre(event.summary + ' (' + when + ')')
      }
      // console.log(week_events);
      // if (!(Object.keys(week_events).length)) {
        lookingForEvents = false;
      // }
    } else {
      lookingForEvents = false;
      appendPre('No upcoming events found.');
    }
  });
}

// function listSettings(calendarId) {
//   var request = gapi.client.calendar.settings.list({
//     'calendarId': calendarId
//   });
//
//   request.execute(function(resp) {
//     var settings = resp.items;
//     console.log(settings)
//   });
// }
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
