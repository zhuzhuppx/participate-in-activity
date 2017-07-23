var qr = require('qr-image');
var moment = require('moment');
var shortUrl = require('./shortUrl.js');
var {
  ActivitySchema
} = require('./db/schemas.js')
const CONST_DATA = require('../const.js');
module.exports = function(app) {
  app.get('/qr', function(req, res) {
    var id = req.query.id;
    var link =(req.query.link) ;
    let url = CONST_DATA.BASE_URL + 'scanqr?' + 'id=' + id + '&link=' + link;
    try {
      var img = qr.image(url, {
        size: 50,
        type: 'svg',
        parse_url: true
      });
      img.pipe(res);
    } catch (e) {
      console.log(e);
      res.writeHead(414, {
        'Content-Type': 'text/html'
      });
      res.end('<h1>414 Request-URI Too Large</h1>');
    }
    // shortUrl(url,function(data){
    //   data = JSON.parse(data);
    //   let tmpurl= data.url;
    //
    // });
  });
  app.get('/scanqr', function(req, res) {
    var id = req.query.id;
    var link = req.query.link;
    res.redirect(CONST_DATA.TYPE_PHONE + '#/Hello?id=' + id + '&link=' + link);

  });
  app.get('/loadActivities', function(req, res) {
    req.query.page = JSON.parse(req.query.page);
    var name = req.query.activityName;
    var count = 0;
    var page = req.query.page.pageNumber;
    var rows = req.query.page.pageSize;
    const reg = new RegExp(name, 'i') //不区分大小写

    var query = ActivitySchema.find({
      activityName:reg
    });
    query.skip((page - 1) * rows);
    query.limit(rows);
    query.sort({activityStartDate:'desc'});

    //计算分页数据
    query.exec(function(err, rs) {
      if (err) {
        res.send(err);
      } else {
        //计算数据总数
        ActivitySchema.find({  activityName:reg},function(err, result) {
          jsonArray = {
            rows: rs,
            total: result.length,
            pageCount: Math.ceil(result.length / rows)
          };
          res.send(jsonArray);
        }).sort({activityStartDate:'desc'});

      }
    });

  });
  app.post('/addActivity', function(req, res) {
    shortUrl(req.query.activityLink,function(data){
      data = JSON.parse(data);
      let tmpurl= data.url;
      let obj = new ActivitySchema({
        activityName: req.query.activityName,
        activityStartDate: moment(req.query.activityStartDate,'YYYY-MM-DD HH:mm:ss').toDate(),
        activityEndDate:  moment(req.query.activityStartDate,'YYYY-MM-DD HH:mm:ss').toDate(),
        activityLink: tmpurl
      });
      obj.save();
      res.send({status:'ok'});
    });
  });
}
