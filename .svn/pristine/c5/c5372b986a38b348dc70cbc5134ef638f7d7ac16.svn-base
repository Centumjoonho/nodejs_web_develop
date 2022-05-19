/**
 * learningRouter.js learning 관리 화면를 위한 데이타 조회 및 화면 분기 처리
 *
 * date : 20.03.20
 * author : sdkim
 */

var express     = require('express');
var router      = express.Router();

var learningDao = require('../dao/learningDao');
var gError      = require('../lib/error');

const bigCatalogName        = 'learning';
const managementName        = 'management';
const modelManagementName   = 'modelManagement';

// 각 페이지의 용도에 맞게 분기시킴
router.use(`/:managementName/:actionName`, function(req, res, next) {

    // 유효 화면 확인
    if (req.params.managementName != managementName &&
        req.params.managementName != modelManagementName){
            var error   = new Error(gError.userMessage.noPage);
            gError.errorPage(res, error);
            return;
        }

    // 각 화면으로 이동
    var loadPageName    = `${bigCatalogName}_${req.params.managementName}_${req.params.actionName}`;
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
    learningDao(tranData);
});

// 학습 모델 관련 용도에 맞게 분기시킴
router.use(`/:modelManagementName/:actionName`, function(req, res, next) {

    // 각 화면으로 이동
    var loadPageName    = `${bigCatalogName}_${req.params.modelManagementName}_${req.params.actionName}`;
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
    learningDao(tranData);
});

module.exports = router;
