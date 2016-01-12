// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '844715614532-imoanb7n7gprtu38pedhi9crsoidammh.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
//object used to make request to the calendar api
var EVENT_REQUEST_CRITERIA = {
  'timeMin': moment().startOf('isoweek').toISOString(),
  'timeMax': moment().endOf('isoweek').toISOString(),
  'showDeleted': false,
  'singleEvents': true,
  'maxResults': 250,
  'orderBy': 'startTime'
};

var week_events = {}, _lookingForEvents = true, numOfDays = 6;

//format date
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
  var calendars = $('<select />', {class: 'calendars'});
  // var calendars = $('select#calendars');
  var request = gapi.client.calendar.calendarList.list();
  request.execute(function(resp) {
    // console.log('Calendars: ', resp.items);
    for (var i = 0; i < resp.items.length; i++) {
      // console.log('Calendar Id: ', resp.items[i].id);
      $('<option />', {value: resp.items[i].id,
        text: resp.items[i].summary
      }).appendTo(calendars);

      $('#calendar').prepend(calendars);
      // calendars.push(resp.items[i].id);
      // if (resp.items[i].id.indexOf("makersquare.com") > -1
      //   && resp.items[i].id.indexOf("@group") > -1) {
      //     calendarId = resp.items[i].id;
      // }
    }
    // listUpcomingEvents(calendarId);
    listUpcomingEvents($('.calendars option:selected').val())
  });
};

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents(calendarId) {
  if (!calendarId) {
    _lookingForEvents = false;
    appendPre('No events found.');
    return;
  }
  //add calendar id property before making request to calendar api
  EVENT_REQUEST_CRITERIA['calendarId'] = calendarId;
  var request = gapi.client.calendar.events.list(EVENT_REQUEST_CRITERIA);
  request.execute(function(resp) {
    var events = resp.items;
    if (events && events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.start.dateTime) { //only grab events for which there is a start.dateTime property
          var event_date = formatDate(event.start.dateTime), startTime = formatDate(event.start.dateTime, 'time24'),
              endTime = formatDate(event.end.dateTime, 'time24'), recurringEvent = event['recurringEventId'] ? true: false;

          if (week_events[event_date]) {
                week_events[event_date].push({summary: event.summary,
                startTime: startTime, endTime: endTime, recurringEvent: recurringEvent });
          } else {
              week_events[event_date] = [{summary: event.summary,
              startTime: startTime, endTime: endTime, recurringEvent: recurringEvent }];
          }
        }
      }
      _lookingForEvents = false;
      appendPre('');
    } else {
      _lookingForEvents = false;
      appendPre('No events found.');
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
  pre.innerHTML = ""; //clear out element
  pre.appendChild(textContent);
}
