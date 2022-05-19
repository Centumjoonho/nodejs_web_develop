/**
 * downloadRouter.js 파일을 다운로드
 *
 * date : 20.04.02
 * author : sdkim
 */

var express = require('express');
var router  = express.Router();

var downloadDao = require('../dao/downloadDao');

// Dataset 파일을 다운로드. trainType은 X or Y
router.get(`/file/datasets/:datasetCd/:trainType`, function(req, res, next) {

    var loadPagePath    = "file/download_file_dataset";
    console.log(loadPagePath);

    // 전달 데이터 생성
    var tranData    = {
        tranId:loadPagePath,
        req:req,
        res:res,
        params:{},
        data:{}
    };

    tranData.params.datasetCd   = req.params.datasetCd;
    tranData.params.trainType   = req.params.trainType;

    // 필요 데이타 조회 및 결과 페이지 이동
    downloadDao(tranData);
});

// Movie 파일을 다운로드. creationType은 IN or OUT
router.get(`/file/movie/:movieCd/:creationType`, function(req, res, next) {

    var loadPagePath    = "file/download_file_movie";
    console.log(loadPagePath);

    // 전달 데이터 생성
    var tranData    = {
        tranId:loadPagePath,
        req:req,
        res:res,
        params:{},
        data:{}
    };

    tranData.params.movieCd   = req.params.movieCd;
    tranData.params.creationType   = req.params.creationType;

    // 필요 데이타 조회 및 결과 페이지 이동
    downloadDao(tranData);
});

module.exports = router;
