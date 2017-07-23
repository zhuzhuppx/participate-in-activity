var activity = require('./service/activity.js');
var shareUser = require('./service/shareUser.js');

module.exports= function(app){
  activity(app);
  shareUser(app);
}
