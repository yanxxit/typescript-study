///<reference path="./express.namespace.d.ts"/>
var express = require('express');
var router = express.Router();


//activity/copySongShow
//针对时间进行限制，减少误操作的影响
router.post('/', async function (req, res, next) {
  let test = await searchPlayBills(req, res);
  let shopid = req.body.shopId;
  let manager_id = req.headers["administrator"]
  
  express.response.
});