var mongoose = require("../db.js"); //	顶会议用户组件
var Schema = mongoose.Schema;
var ShareUserSchema = new Schema({
  userName: String,
  userPhone:String,
  shareTime:Date,
  receiveTime:Date,
  praiseNum: Number,
  praiseId: String,
  status:String,
  modifyUser:String

});
// ActivitySchema.statics.getToken = function(openid, cb) {
//   this.findOne({
//     openid: openid
//   }, function(err, result) {
//     if (err) throw err;
//     return cb(null, result);
//   });
// };
// ActivitySchema.statics.saveOrUpdate = function(openid, token, cb) {
//   // 有则更新，无则添加
//   var query = {
//     id: openid
//   };
//   var options = {
//     upsert: true
//   };
//   this.update(query, token, options, function(err, result) {
//     if (err) throw err;
//     return cb(null);
//   });
// };
module.exports = mongoose.model('ShareUser', ShareUserSchema)
