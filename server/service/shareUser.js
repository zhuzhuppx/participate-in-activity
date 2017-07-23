var moment = require('moment');
var {
  ShareUserSchema
} = require('./db/schemas.js')
const CONST_DATA = require('../const.js');
module.exports = function(app) {
  app.post('/typePhone', function(req, res) {
    var id = req.query.id;
    var link = req.query.link;
    var name = req.query.name;
    var phone = req.query.phone;
    let shareUser = new ShareUserSchema({
      userName: name,
      userPhone: phone,
      receiveTime: null,
      shareTime: new Date(),
      praiseNum: 0,
      praiseId: id,
      status: '未领取',
      modifyUser: ''
    });
    ShareUserSchema.findOne({
      userPhone: phone,
      praiseId: id
    }, function(err, doc) {
      if (!!!doc) {
        shareUser.save();
        res.send({
          already: false
        });
      } else {
        if (doc.status === '已领取') {
          res.send({
            already: true
          });
        } else {
          ShareUserSchema.update({
            userPhone: phone,
            praiseId: id
          }, {
            status: '待领取'
          }, null, function(err, doc) {
            res.send({
              already: false
            });
          });
        }
      }
    });
  });
  app.get('/loadShareUsers', function(req, res) {
    var id = req.query.id;
    req.query.page = JSON.parse(req.query.page);
    var count = 0;
    var page = req.query.page.pageNumber;
    var rows = req.query.page.pageSize;
    const reg = new RegExp(req.query.userName, 'i') //不区分大小写

    var query = ShareUserSchema.find({
      praiseId: id
    });
    query.or([{ userName: reg}, { userPhone: reg }]);

    query.skip((page - 1) * rows);
    query.limit(rows);
    query.sort({
      shareTime: 'desc'
    });
    //计算分页数据
    query.exec(function(err, rs) {
      if (err) {
        res.send(err);
      } else {
        //计算数据总数
        ShareUserSchema.find({
          praiseId: id
        }, function(err, result) {
          jsonArray = {
            rows: rs,
            total: result.length,
            pageCount: Math.ceil(result.length / rows)
          };
          res.send(jsonArray);
        }).or([{ userName: reg}, { userPhone: reg }]).sort({
          shareTime: 'desc'
        });;

      }
    });

  });
  app.post('/updateShareUser', function(req, res) {
    var id = req.query._id;
    var status = req.query.status;
    var praiseNum = req.query.praiseNum;
    var phone = req.query.userPhone;
    var modifyUser = req.query.modifyUser;
    var receiveTime = new Date();
    ShareUserSchema.update({
      // userPhone: phone,
      _id: id
    }, {
      status: status,
      praiseNum: praiseNum,
      receiveTime: receiveTime,
      modifyUser: modifyUser
    }, null, function(err, doc) {
      res.send({
        status: 'ok',
        receiveTime: receiveTime
      });
    });

  });
}
