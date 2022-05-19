/**
 * mainDao.js mysql db 연결 객체를 생성하여 전달
 * 
 * date : 20.04.07
 * author : sdkim  
 */

var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gConfig     = require('../config');
var gDaoName    = 'analysisDao';

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
      case 'analysis/analysis_management_list':
        analysis_management_list(tranData);
         break;

    case 'analysis/analysis_management_view':
        analysis_management_view(tranData);
        break;

      default:
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.noPageHandler);
        gError.errorPage(tranData.res, error);
        break;
   }
};

/**
 * 결과 분석 리스트를 조회
 * 
 * @param {*} tranData
 */
function analysis_management_list(tranData){

    // 전체 건수 조회
    gDb.query(`
    SELECT COUNT(mv.movie_cd) total_cnt FROM movie mv WHERE mv.movie_state_cd = 'DONE'
    `, 
    function(error, result, fields){
        if (error){
            console.log(error);
            gError.errorPage(tranData.res, error);
            return;
        }

        // 조회 변수 설정
        if (typeof tranData.req.body.txtPageNo == 'undefined')  tranData.req.body.txtPageNo = 1;
        if (typeof tranData.req.body.slcListPerPage == 'undefined')  tranData.req.body.slcListPerPage = gConfig.apps[0].pageing.LIST_PER_PAGE;

        tranData.data.pageNo        = parseInt(tranData.req.body.txtPageNo, 10);
        tranData.data.listPerPage   = parseInt(tranData.req.body.slcListPerPage, 10);
        tranData.data.pagePerPaging = parseInt(gConfig.apps[0].pageing.PAGE_PER_PAGING, 10);

        tranData.data.totalCnt      = parseInt(result[0].total_cnt, 10);

        // 리스트 조회
        var dbParams    = [
            (tranData.data.pageNo-1)*tranData.data.listPerPage,
            tranData.data.listPerPage
        ];
        gDb.query(`
        SELECT
                ls.*
        FROM    (
                    SELECT
                            mv.movie_cd, 
                            mv.create_tm, 
                            mv.update_tm, 
                            mv.movie_nm, 
                            mv.remark, 
                            mv.scenario_cd, 
                            (SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = mv.scenario_cd) scenario_nm,
                            mv.learning_cd, 
                            (SELECT learning_nm FROM learning WHERE learning_cd = mv.learning_cd) learning_nm,
                            mv.in_movie_type_cd, 
                            (SELECT common_nm FROM common_cd WHERE group_cd = 'MOVIE_TYPE' AND common_cd = mv.in_movie_type_cd) in_movie_type_nm,
                            mv.in_movie_frame_rate, 
                            mv.in_movie_nm, 
                            mv.in_movie_size_kb, 
                            mv.in_movie_save_path, 
                            mv.in_movie_save_nm, 
                            mv.in_movie_web_url, 
                            mv.out_movie_nm, 
                            mv.out_movie_size_kb, 
                            mv.out_movie_save_path, 
                            mv.out_movie_save_nm, 
                            mv.out_movie_web_url, 
                            mv.movie_state_cd,
                            (SELECT common_nm FROM common_cd WHERE group_cd = 'MOVIE_STAT' AND common_cd = mv.movie_state_cd) movie_state_nm,
                            mv.start_tm,
                            DATE_FORMAT(mv.start_tm,'%Y.%m.%d %T') start_tm_desc,
                            mv.end_tm,
                            DATE_FORMAT(mv.end_tm,'%Y.%m.%d %T') end_tm_desc,
                            lg.learning_model_cd,
                            (SELECT lm.learning_model_nm FROM learning_model lm WHERE lm.learning_model_cd = lg.learning_model_cd) learning_model_nm
                    FROM    movie mv LEFT OUTER JOIN learning lg ON mv.learning_cd = lg.learning_cd
                    WHERE   mv.movie_state_cd = 'DONE'
                    ORDER BY mv.create_tm DESC
                ) ls
        LIMIT ?, ?
        `,
        dbParams, 
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
 * 생성 영상 내용을 조회하고 상세 페이지로 이동
 * 
 * @param {*} tranData
 */
function analysis_management_view(tranData){

    // 생성 영상 조회
    if (typeof tranData.req.body.txtMovieCd == 'undefined'){
        console.log(gError.userMessage.noPageHandler);
        var error   = new Error(gError.userMessage.inValidParameter);
        gError.errorPage(tranData.res, error);
        return;
    }

    var dbParams    = [
        tranData.req.body.txtMovieCd
    ];
    gDb.query(`
    SELECT
            mv.movie_cd, 
            mv.create_tm, 
            mv.update_tm, 
            mv.movie_nm, 
            mv.remark, 
            mv.scenario_cd, 
            (SELECT common_nm FROM common_cd WHERE group_cd = 'SCENARIO' AND common_cd = mv.scenario_cd) scenario_nm,
            mv.learning_cd, 
            (SELECT learning_nm FROM learning WHERE learning_cd = mv.learning_cd) learning_nm,
            mv.in_movie_type_cd, 
            (SELECT common_nm FROM common_cd WHERE group_cd = 'MOVIE_TYPE' AND common_cd = mv.in_movie_type_cd) in_movie_type_nm,
            mv.in_movie_frame_rate, 
            mv.in_movie_nm, 
            mv.in_movie_size_kb, 
            mv.in_movie_save_path, 
            mv.in_movie_save_nm, 
            mv.in_movie_web_url, 
            mv.out_movie_nm, 
            mv.out_movie_size_kb, 
            mv.out_movie_save_path, 
            mv.out_movie_save_nm, 
            mv.out_movie_web_url, 
            mv.movie_state_cd,
            (SELECT common_nm FROM common_cd WHERE group_cd = 'MOVIE_STAT' AND common_cd = mv.movie_state_cd) movie_state_nm,
            mv.start_tm,
            date_format(mv.start_tm,'%Y.%m.%d %T') start_tm_desc,
            mv.end_tm,
            date_format(mv.end_tm,'%Y.%m.%d %T') end_tm_desc,
            lg.learning_model_cd,
            (SELECT lm.learning_model_nm FROM learning_model lm WHERE lm.learning_model_cd = lg.learning_model_cd) learning_model_nm
    FROM    movie mv LEFT OUTER JOIN learning lg ON mv.learning_cd = lg.learning_cd
    WHERE   mv.movie_cd = ?
    AND     mv.movie_state_cd = 'DONE'
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

        tranData.data.movieCd     = tranData.req.body.txtMovieCd;
        tranData.data.downloadUrl   = gConfig.apps[0].download.FILE_MOVIE;
        tranData.data.detailData    = result;

        tranData.res.render(tranData.tranId, {tranData:tranData});
    }); // 생성 영상 조회 종료
}

module.exports  = resultDao;