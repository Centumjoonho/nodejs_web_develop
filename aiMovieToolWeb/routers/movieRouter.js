/**
 * movieRouter.js movie 관리 화면를 위한 데이타 조회 및 화면 분기 처리
 *
 * date : 20.04.02
 * author : sdkim
 */

var express     = require('express');
var multer      = require('multer');
var router      = express.Router();

var movieDao  = require('../dao/movieDao');
var uploadFiles = multer({
    dest: 'data/movie/'
});

const bigCatalogName    = 'movie';
const managementName    = 'management';
const ejsPagePath       = 'movie/movie_management_list';

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
    movieDao(tranData);
});

// /management/createSave 에서 Dataset 파일 저장
router.post(`/${managementName}/createSave`, uploadFiles.single('inMovie'), function(req, res, next) {

    var loadPageName    = `${bigCatalogName}_${managementName}_createSave`;
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

    // 업로드 영상 정보 설정
    var upFile = req.file;
    tranData.params.in_movie_nm         = upFile.originalname;
    tranData.params.in_movie_size_kb    = parseInt(upFile.size / 1024, 10);
    tranData.params.in_movie_save_path  = upFile.path;
    tranData.params.in_movie_save_nm    = upFile.filename;
    tranData.params.in_movie_web_url    = '/' + upFile.destination + tranData.params.in_movie_save_nm;

    console.log(tranData.params);

    // 필요 데이타 조회 및 결과 페이지 이동
    movieDao(tranData);
});

// /management/createSave2 에서 Dataset 파일 저장
router.post(`/${managementName}/createSave2`, uploadFiles.single('inMovie'), function(req, res, next) {

    var loadPageName    = `${bigCatalogName}_${managementName}_createSave2`;
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

    // 업로드 영상 정보 설정
    var upFile = req.file;
    tranData.params.in_movie_nm         = upFile.originalname;
    tranData.params.in_movie_size_kb    = parseInt(upFile.size / 1024, 10);
    tranData.params.in_movie_save_path  = upFile.path;
    tranData.params.in_movie_save_nm    = upFile.filename;
    tranData.params.in_movie_web_url    = '/' + upFile.destination + tranData.params.in_movie_save_nm;

    console.log(tranData.params);

    // 필요 데이타 조회 및 결과 페이지 이동
    movieDao(tranData);
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
    movieDao(tranData);
});

module.exports = router;
