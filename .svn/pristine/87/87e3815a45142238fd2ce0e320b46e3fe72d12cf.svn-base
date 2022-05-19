/**
 * analysisRouter.js analysis 관리 화면를 위한 데이타 조회 및 화면 분기 처리
 * 
 * date : 20.03.20
 * author : sdkim  
 */

var express = require('express');
var router = express.Router();

var analysisDao = require('../dao/analysisDao');

const bigCatalogName    = 'analysis';
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
    analysisDao(tranData);
});

module.exports = router;