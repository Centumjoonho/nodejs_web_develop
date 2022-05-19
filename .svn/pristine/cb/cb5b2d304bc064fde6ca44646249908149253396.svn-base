/**
 * mainRouter.js 메인 화면를 위한 데이타 조회 및 화면 분기 처리
 *
 * date : 20.03.20
 * author : sdkim
 */

var express     = require('express');
var router      = express.Router();
var mainDao     = require('../dao/mainDao');

// 대분류와 화면 약어 설정
const bigCatalogName    = 'main';
const mainName          = 'main';
const ejsPagePath       = 'main/main_main_view';

 /**
  * 루트 접근에 대해서 메인 페이지로 분기
  */
router.get('/', function(req, res, next) {
    console.log(`${bigCatalogName}Router - ` + ejsPagePath);

    // 전달 데이터 생성
    var tranData    = {
        tranId:ejsPagePath,
        req:req,
        res:res,
        params:{dbParamId:1},
        data:{}
    };

    // 필요 데이타 조회 및 결과 페이지 이동
    mainDao(tranData);
});

/**
 * 대분류 메인에 속한 페이지로 분기
 */
router.get(`/${mainName}/:actionName`, function(req, res, next) {

    var loadPageName    = `${bigCatalogName}_${mainName}_${req.params.actionName}`;
    var loadPagePath    = `${bigCatalogName}/${loadPageName}`;
    console.log(`${bigCatalogName}Router - ` + loadPagePath);

    // 전달 데이터 생성
    var tranData    = {
        tranId:loadPagePath,
        req:req,
        res:res,
        params:{dbParamId:1},
        data:{}
    };

    // 필요 데이타 조회 및 결과 페이지 이동
    mainDao(tranData);
});

module.exports = router;
