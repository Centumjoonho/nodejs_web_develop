/**
 * datasetRouter.js dataset 관리 화면를 위한 데이타 조회 및 화면 분기 처리
 *
 * date : 20.03.20
 * author : sdkim
 */

var express     = require('express');
var multer      = require('multer');
var router      = express.Router();

var datasetDao  = require('../dao/datasetDao');
var uploadFiles = multer({
    dest: 'data/datasets/'
});

const bigCatalogName    = 'dataset';
const managementName    = 'management';

// /management/createSave 에서 Dataset 파일 저장
router.post(`/${managementName}/createSave`, uploadFiles.array('filImgs'), function(req, res, next) {

    var loadPageName    = `${bigCatalogName}_${managementName}_createSave`;
    var loadPagePath    = `${bigCatalogName}/${loadPageName}`;
    console.log(`${bigCatalogName}Router - ` + loadPagePath);
    console.log('filImgs');

    // 전달 데이터 생성
    var tranData    = {
        tranId:loadPagePath,
        req:req,
        res:res,
        params:{},
        data:{}
    };

    // 업로드 Dataset 정보 설정
    var upFiles = req.files;
    tranData.params.imgx_up_nm      = upFiles[0].originalname;
    tranData.params.imgx_size_kb    = parseInt(upFiles[0].size / 1024, 10);
    tranData.params.imgx_save_path  = upFiles[0].path;
    tranData.params.imgx_save_nm    = upFiles[0].filename;
    tranData.params.imgx_web_url    = '/' + upFiles[0].destination + tranData.params.imgx_save_nm;

    tranData.params.imgy_up_nm      = upFiles[1].originalname;
    tranData.params.imgy_size_kb    = parseInt(upFiles[1].size / 1024, 10);
    tranData.params.imgy_save_path  = upFiles[1].path;
    tranData.params.imgy_save_nm    = upFiles[1].filename;
    tranData.params.imgy_web_url    = '/' + upFiles[1].destination + tranData.params.imgy_save_nm;

    // 필요 데이타 조회 및 결과 페이지 이동
    datasetDao(tranData);
});

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
    datasetDao(tranData);
});

module.exports = router;
