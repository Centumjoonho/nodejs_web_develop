/**
 * mainDao.js mysql db 연결 객체를 생성하여 전달
 *
 * date : 20.03.20
 * author : sdkim
 */

var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gConfig     = require('../config');
var gDaoName    = 'datasetDao';

/**
 * 요청한 tranId 에 일치하는 DB 데이타를 전달
 * @param {*} tranData tranId 필수 필드
 */

/*
// tranData 정의
var tranData    = {
    tranId:pagePath,        // 이동할 경로
    req:req,                // 요청객체
    res:res,                // 응답객체
    params:{},              // 전달할 파라미터
    data:{}                 // 전달할 데이타
};
*/
var resultDao   = function (tranData){
   console.log(`${gDaoName} - ${tranData.tranId}`)

   switch (tranData.tranId){
        case 'dataset/dataset_management_create':
            dataset_management_create(tranData);
            break;

        case 'dataset/dataset_management_createSave':
            dataset_management_createSave(tranData);
            break;

        case 'dataset/dataset_management_list':
            dataset_management_list(tranData);
            break;

        case 'dataset/dataset_management_delete':
            dataset_management_delete(tranData);
            break;

        case 'dataset/dataset_management_update':
            dataset_management_update(tranData);
            break;

        case 'dataset/dataset_management_updateSave':
            dataset_management_updateSave(tranData);
            break;

        default:
            console.log(gError.userMessage.noPageHandler);
            var error   = new Error(gError.userMessage.noPageHandler);
            gError.errorPage(tranData.res, error);
            break;
   }
};

/**
 * Dataset 생성 페이지로 이동
 *
 * @param {*} tranData
 */
function dataset_management_create(tranData){
    tranData.res.render(tranData.tranId, {tranData:tranData});
}

/**
 * 새로운 Dataset 을 저장하고 리스트 페이지로 이동
 *
 * @param {*} tranData
 */
function dataset_management_createSave(tranData){

    gDb.query(`
    SELECT   CONCAT('D', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '-', LPAD(CAST(CAST(IFNULL(RIGHT(MAX(ds.dataset_cd),4),'0000') AS SIGNED) + 1 AS CHAR(4)), 4, '0')) AS next_cd
    FROM     dataset ds
    WHERE    ds.dataset_cd LIKE CONCAT('D', LEFT(CAST(YEAR(NOW()) AS CHAR(4)), 2), '%')
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }
        tranData.params.next_cd = result[0].next_cd;

        //압축해제

        var fs = require('fs');
        var dir = './data/datasets/' + tranData.params.next_cd;
        var dirA = dir + '/' + 'trainA';
        var dirB = dir + '/' + 'trainB';

        var pirA = dir + '/' + 'A';
        var pirB = dir + '/' + 'B';
        var tirA = pirA + '/' + 'train';
        var tirB = pirB + '/' + 'train';

        var rimraf = require("rimraf");
        if (fs.existsSync(dir)) {
          rimraf.sync(dir);
        }
        fs.mkdirSync(dir);
        if (fs.existsSync(dirA)) {
          rimraf.sync(dirA);
        }
        fs.mkdirSync(dirA);
        if (fs.existsSync(dirB)) {
          rimraf.sync(dirB);
        }
        fs.mkdirSync(dirB);

        if (fs.existsSync(pirA)) {
          rimraf.sync(pirA);
        }
        fs.mkdirSync(pirA);
        if (fs.existsSync(pirB)) {
          rimraf.sync(pirB);
        }
        fs.mkdirSync(pirB);
        if (fs.existsSync(tirA)) {
          rimraf.sync(tirA);
        }
        fs.mkdirSync(tirA);
        if (fs.existsSync(tirB)) {
          rimraf.sync(tirB);
        }
        fs.mkdirSync(tirB);

        //console.log(tranData.params.imgx_web_url);

        var AdmZip = require('adm-zip');
        var filename = "." + tranData.params.imgx_web_url;
        var filename2 = "." + tranData.params.imgy_web_url;


        try{
          var zipA = new AdmZip(filename);
          var zipB = new AdmZip(filename2);
          zipA.extractAllTo(dirA, true);
          zipB.extractAllTo(dirB, true);
          zipA.extractAllTo(tirA, true);
          zipB.extractAllTo(tirB, true);
        }
        catch ( e ) {
          console.log( 'Caught exception: ', e );
          gError.errorPage(tranData.res, {message:"zip 파일로 업로드 해주세요"});
          rimraf.sync(filename);
          rimraf.sync(filename2);
          return;
        }



        var pyshell = require('python-shell');
        console.log("python-shell");

        var options = {
          mode: 'text',
          pythonPath: 'python3',
          pytonOptions: ['-u'],
          scriptPath: './',
          args: [pirA,pirB,dir]
          //args:dbParams3,
        }; //--gpu_ids 0 --input_nc 3 --n_epochs 100 --n_epochs_decay 100 --lr 0.0002
        console.log("ok");
        let py = pyshell.PythonShell.run('combine.py', options, function (err, results) {
          if (err) throw err;
          console.log('results: %j', results);
            rimraf.sync(pirA);
            rimraf.sync(pirB);
          });
        /*
        try {
          extract(tranData.params.imgx_web_url, { dir: dirA });
          extract(tranData.params.imgy_web_url, { dir: dirA });
          console.log('Extraction complete')
        } catch (err) {
        // handle any errors
      }*/

        // 저장시 transaction 처리
        gDb.beginTransaction(function(error){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();

                return;
            }

            // dataset insert
            var dbParams    = [
                tranData.params.next_cd,
                tranData.req.body.txtDatasetNm,
                tranData.req.body.slcScenarioCd,
                tranData.req.body.txtRemark,
                tranData.req.body.txtImgHorPx,
                tranData.req.body.txtImgVerPx,
                tranData.req.body.slcImgTypeCd,
                tranData.params.imgx_up_nm,
                tranData.params.imgx_size_kb,
                tranData.params.imgx_save_path,
                tranData.params.imgx_save_nm,
                tranData.params.imgx_web_url,
                tranData.params.imgy_up_nm,
                tranData.params.imgy_size_kb,
                tranData.params.imgy_save_path,
                tranData.params.imgy_save_nm,
                tranData.params.imgy_web_url,
                tranData.req.body.txtUseLearningRate,
                tranData.req.body.txtUseVerifyRate,
                tranData.req.body.txtUseTestRate
            ];

            gDb.query(`
            INSERT INTO dataset(
                dataset_cd,
                create_tm,
                dataset_nm,
                scenario_cd,
                remark,
                img_hor_px,
                img_ver_px,
                img_type_cd,
                imgx_up_nm,
                imgx_size_kb,
                imgx_save_path,
                imgx_save_nm,
                imgx_web_url,
                imgy_up_nm,
                imgy_size_kb,
                imgy_save_path,
                imgy_save_nm,
                imgy_web_url,
                use_learning_rate,
                use_verify_rate,
                use_test_rate,
                use_yn
            ) VALUES (
                ?,
                NOW(),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                'Y'
            )
            `,
            dbParams,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    gDb.rollback();
                    return;
                }
                gDb.commit();

                tranData.tranId  = 'dataset/dataset_management_list';
                dataset_management_list(tranData);
            }); // dataset insert 종료

        }); // transaction 종료

    }); // dataset_id 조회 종료
}

/**
 * Dataset 리스트를 조회
 *
 * @param {*} tranData
 */
function dataset_management_list(tranData){

    // 전체 건수 조회
    gDb.query(`
    SELECT COUNT(ds.dataset_cd) total_cnt FROM dataset ds WHERE ds.use_yn = 'Y'
    `,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }

        // 조회 변수 설정
        /*if (typeof tranData.req.body.txtPageNo == 'undefined')  tranData.req.body.txtPageNo = 1;
        if (typeof tranData.req.body.slcListPerPage == 'undefined')  tranData.req.body.slcListPerPage = gConfig.apps[0].pageing.LIST_PER_PAGE;

        tranData.data.pageNo        = parseInt(tranData.req.body.txtPageNo, 10);
        tranData.data.listPerPage   = parseInt(tranData.req.body.slcListPerPage, 10);
        tranData.data.pagePerPaging = parseInt(gConfig.apps[0].pageing.PAGE_PER_PAGING, 10);

        tranData.data.totalCnt      = parseInt(result[0].total_cnt, 10);

        // 리스트 조회
        var dbParams    = [
            (tranData.data.pageNo-1)*tranData.data.listPerPage,
            tranData.data.listPerPage
        ];*/
        gDb.query(`
        SELECT
                ls.*
        FROM    (
                    SELECT
                            ds.dataset_cd,
                            ds.create_tm,
                            date_format(ds.create_tm,'%Y.%m.%d') create_tm_desc,
                            ds.update_tm,
                            ds.dataset_nm,
                            ds.scenario_cd,
                            (SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = ds.scenario_cd) scenario_nm,
                            ds.remark,
                            ds.img_hor_px,
                            ds.img_ver_px,
                            ds.img_type_cd,
                            (SELECT common_nm FROM common_cd WHERE group_cd = 'IMG_TYPE' AND common_cd = ds.img_type_cd) img_type_nm,
                            ds.imgx_up_nm,
                            ds.imgx_size_kb,
                            ds.imgx_save_path,
                            ds.imgx_save_nm,
                            ds.imgx_web_url,
                            ds.imgy_up_nm,
                            ds.imgy_size_kb,
                            ds.imgy_save_path,
                            ds.imgy_save_nm,
                            ds.imgy_web_url,
                            ds.use_learning_rate,
                            ds.use_verify_rate,
                            ds.use_test_rate,
                            ds.use_yn
                    FROM    dataset ds
                    WHERE   ds.use_yn    = 'Y'
                    ORDER BY ds.create_tm DESC
                ) ls

        `,
        //dbParams, //  LIMIT ?, ?
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                return;
            }
            tranData.data.listData  = result;

            // 페이지 전달
            tranData.res.render(tranData.tranId, {tranData:tranData});
        }); // 리스트 조회 종료

    }); // 전체 건수 조회 종료
}

/**
 * Dataset 을 삭제
 *
 * @param {*} tranData
 */
function dataset_management_delete(tranData){

    // 저장시 transaction 처리
    gDb.beginTransaction(function(error){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();

            return;
        }

        // dataset update
        var dbParams    = [
            tranData.req.body.txtDatasetCd
        ];


        gDb.query(`
          SELECT * from  dataset
          WHERE   dataset_cd        = ?
          `,
        dbParams,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();
                return;
            }


            var air = './data/datasets/' + result[0].imgx_save_nm;
            var bir = './data/datasets/' + result[0].imgy_save_nm;


            console.log(air);
            var fs = require("fs");
            var rimraf = require("rimraf");

            if (fs.existsSync(air)) {
              rimraf.sync(air);
            }
            if (fs.existsSync(bir)) {
              rimraf.sync(bir);
            }

            gDb.query(`
              DELETE from  dataset
              WHERE   dataset_cd        = ?
              `,
            dbParams,
            function(error, result, fields){
                if (error){
                    console.log(error);
                    gError.errorPage(tranData.res, error);
                    gDb.rollback();
                    return;
                }
                gDb.commit();

                var dir = './data/datasets/' + tranData.req.body.txtDatasetCd;

                console.log(dir);

                //var rimraf = require("rimraf");

                if (fs.existsSync(dir)) {
                  rimraf.sync(dir);
                }

                // 리스트 화면으로 이동
                tranData.tranId  = 'dataset/dataset_management_list';
                tranData.req.body.txtPageNo = 1
                dataset_management_list(tranData);
            }); // dataset insert 종료

        }); // dataset insert 종료

      /*  gDb.query(`
        UPDATE  dataset
        SET     use_yn            = 'N',
                update_tm         = NOW()
        WHERE   dataset_cd        = ?
        `,*/


    }); // transaction 종료
}

/**
 * Dataset 내용을 조회하고 수정 페이지로 이동
 *
 * @param {*} tranData
 */
function dataset_management_update(tranData){

    // Dataset 조회
    if (typeof tranData.req.body.txtDatasetCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    var dbParams    = [
        tranData.req.body.txtDatasetCd
    ];
    gDb.query(`
    SELECT
        ds.dataset_cd,
        ds.create_tm,
        DATE_FORMAT(ds.create_tm,'%Y.%m.%d') create_tm_desc,
        ds.update_tm,
        DATE_FORMAT(ds.update_tm,'%Y.%m.%d') update_tm_desc,
        ds.dataset_nm,
        ds.scenario_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = ds.scenario_cd) scenario_nm,
        ds.remark,
        ds.img_hor_px,
        ds.img_ver_px,
        ds.img_type_cd,
        (SELECT common_nm FROM common_cd WHERE group_cd = 'IMG_TYPE' AND common_cd = ds.img_type_cd) img_type_nm,
        ds.imgx_up_nm,
        ds.imgx_size_kb,
        ds.imgx_save_path,
        ds.imgx_save_nm,
        ds.imgx_web_url,
        ds.imgy_up_nm,
        ds.imgy_size_kb,
        ds.imgy_save_path,
        ds.imgy_save_nm,
        ds.imgy_web_url,
        ds.use_learning_rate,
        ds.use_verify_rate,
        ds.use_test_rate,
        ds.use_yn
    FROM    dataset ds
    WHERE   ds.dataset_cd = ?
    `,
    dbParams,
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }

        // 전달 변수 설정
        if (typeof tranData.req.body.txtPageNo == 'undefined')  tranData.req.body.txtPageNo = 1;
        if (typeof tranData.req.body.slcListPerPage == 'undefined')  tranData.req.body.slcListPerPage = gConfig.apps[0].pageing.LIST_PER_PAGE;

        tranData.data.pageNo        = parseInt(tranData.req.body.txtPageNo, 10);
        tranData.data.listPerPage   = parseInt(tranData.req.body.slcListPerPage, 10);
        tranData.data.pagePerPaging = parseInt(gConfig.apps[0].pageing.PAGE_PER_PAGING, 10);

        tranData.data.datasetCd     = tranData.req.body.txtDatasetCd;
        tranData.data.downloadUrl   = gConfig.apps[0].download.FILE_DATASET;
        tranData.data.detailData    = result;

        var fs = require('fs');

        try {
          var filesP = "./data/datasets/" + tranData.req.body.txtDatasetCd;
          /*
          var filesX = fs.readdirSync(filesP + "/trainA");
          var filesY = fs.readdirSync(filesP + "/trainB");

          var filesX = fs.readdirSync(filesP + "/trainA/")
              .map(function(v) {
                  return { name:v,
                           time:fs.statSync(filesP + "/trainA/" + v).mtime.getTime()
                         };
               })
               .sort(function(a, b) { return a.time - b.time; })
               .map(function(v) { return v.name; });

           var filesY = fs.readdirSync(filesP + "/trainB/")
               .map(function(v) {
                   return { name:v,
                            time:fs.statSync(filesP + "/trainB/" + v).mtime.getTime()
                          };
                })
                .sort(function(a, b) { return a.time - b.time; })
                .map(function(v) { return v.name; });
          */

          var filesX = fs.readdirSync(filesP + "/trainA/").sort();
          var filesY = fs.readdirSync(filesP + "/trainB/").sort();

          tranData.data.imageCheck = "good";
          //console.error(filesX);
          //console.error(filesY);
          //tranData.data.imagePath = filesP;
          tranData.data.imageFilesX = filesX;
          tranData.data.imageFilesY = filesY;

          //console.log(tranData.data);

          tranData.res.render(tranData.tranId, {tranData:tranData});
        } catch(err) {
          // An error occurred
          console.error(err);
          tranData.data.imageCheck = "none";
          tranData.res.render(tranData.tranId, {tranData:tranData});
        }


    }); // Dataset 조회 종료
}

/**
 * 수정된 Dataset 을 저장하고 리스트 페이지로 이동
 *
 * @param {*} tranData
 */
function dataset_management_updateSave(tranData){

    // 저장시 transaction 처리
    gDb.beginTransaction(function(error){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            gDb.rollback();

            return;
        }

        // dataset update
        var dbParams    = [
            tranData.req.body.txtDatasetNm,
            tranData.req.body.slcScenarioCd,
            tranData.req.body.txtRemark,
            tranData.req.body.txtImgHorPx,
            tranData.req.body.txtImgVerPx,
            tranData.req.body.slcImgTypeCd,
            tranData.req.body.txtUseLearningRate,
            tranData.req.body.txtUseVerifyRate,
            tranData.req.body.txtUseTestRate,
            tranData.req.body.txtDatasetCd,
        ];

        gDb.query(`
        UPDATE  dataset
        SET
                update_tm         = NOW(),
                dataset_nm        = ?,
                scenario_cd       = ?,
                remark            = ?,
                img_hor_px        = ?,
                img_ver_px        = ?,
                img_type_cd       = ?,
               -- imgx_up_nm        = ,
               -- imgx_size_kb      = ,
               -- imgx_save_path    = ,
               -- imgx_save_nm      = ,
               -- imgx_web_url      = ,
               -- imgy_up_nm        = ,
               -- imgy_size_kb      = ,
               -- imgy_save_path    = ,
               -- imgy_save_nm      = ,
               -- imgy_web_url      = ,
                use_learning_rate = ?,
                use_verify_rate   = ?,
                use_test_rate     = ?
        WHERE   dataset_cd        = ?
        `,
        dbParams,
        function(error, result, fields){
            if (error){
                console.log(error);
                gError.errorPage(tranData.res, error);
                gDb.rollback();
                return;
            }
            gDb.commit();

            // 리스트 화면으로 이동
            tranData.tranId  = 'dataset/dataset_management_list';
            dataset_management_list(tranData);
        }); // dataset update 종료

    }); // transaction 종료
}

module.exports  = resultDao;
