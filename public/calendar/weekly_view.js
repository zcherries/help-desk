// var data = [
//   'Solo Week & Legacy Projects (2015-11-23T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-24T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-25T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-26T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-27T09:00:00-08:00)',
//   'Solo Week & Legacy Projects (2015-11-28T09:00:00-08:00)',
// ];

//moment().startOf('isoweek').toISOString()
//moment().endOf('isoweek').toISOString()

// //build current week dates
// var currentWeek = [""];
// for (var i = 0; i < 7; i++) {
//   var date = moment().startOf('isoweek').add(i, 'days').toISOString();
//   currentWeek.push(date);
//   // console.log(moment(date).format("MM/DD/YYYY"));
// }
//
// var operatingHours = [
//   "09:00:00", "10:00:00", '11:00:00', '12:00:00', '01:00:00', '01:00:00',
//   '02:00:00', '03:00:00', '04:00:00', '05:00:00', '06:00:00', '07:00:00',
//   '08:00:00', '09:00:00'
// ];
//
// var formatDate = function(isoDate) {
//   if (!isoDate) return "";
//   return moment(isoDate).format("MM/DD/YYYY");
// };
//
// var Week = React.createClass({
//   render: function() {
//     console.log("Calendar: ", this.props.calendarEvent)
//     return (
//       <div>
//         <div className="dates">
//           {currentWeek.map(function(date, idx) {
//             return <h3 key={idx}>{formatDate(date)}</h3>
//           })}
//         </div>
//
//         <div className="week">
//           <div className="schedule">
//             {operatingHours.map(function(hr, idx) {
//               return <div key={idx}>{hr}</div>
//             })}
//           </div>
//           {currentWeek.slice(1).map(function(date, idx) {
//             return <Day key={idx} date={date} />
//           })}
//         </div>
//       </div>
//     )
//   }
// });
//
// var Day = React.createClass({
//   render: function() {
//     return (
//       <div className="day">
//         {operatingHours.map(function(hr, idx) {
//           return ( <Hour key={idx} hour={hr} /> )
//         })}
//       </div>
//     )
//   }
// });
//
// var Hour = React.createClass({
//   render: function() {
//     return (
//       <div className="hour"></div>
//     )
//   }
// });

// ReactDOM.render(<Week calendarEvent={week_events} />, document.getElementById('output'));
