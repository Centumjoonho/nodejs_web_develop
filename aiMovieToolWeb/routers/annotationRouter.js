

var express     = require('express');
var router      = express.Router();

var annotationDao  = require('../dao/annotationDao');

const bigCatalogName    = 'annotation';
const managementName    = 'management';


// 각 페이지의 용도에 맞게 분기시킴
router.use(`/${managementName}/:actionName`, function(req, res, next) {

    var loadPageName    = `${bigCatalogName}_${managementName}_${req.params.actionName}`;
    var loadPagePath    = `${bigCatalogName}/${loadPageName}`;
    console.log(`${bigCatalogName}Router - ` + loadPagePath);

    // 전달 데이터 생성
    var tranData    = {
        tranId:loadPagePath,
        req:req,
        res:res,
        params:{},
        data:{}
    };

    // 필요 데이타 조회 및 결과 페이지 이동
    annotationDao(tranData);
});

module.exports = router;
