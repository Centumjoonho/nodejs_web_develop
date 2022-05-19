
var gDb         = require('../lib/db');
var gError      = require('../lib/error');
var gDaoName    = 'annotationDao';

/**
 * 요청한 tranId 에 일치하는 DB 데이타를 전달
 * @param {*} tranData tranId 필수 필드
 */


 var resultDao   = function (tranData){
    console.log(`${gDaoName} - ${tranData.tranId}`)

    switch (tranData.tranId){
       case 'annotation/annotation_management_list':
         annotation_management_list(tranData);
         break;

       default:
         console.log(gError.userMessage.noPageHandler);
         var error   = new Error(gError.userMessage.noPageHandler);
         gError.errorPage(tranData.res, error);
         break;
    }
 };

/**
 * view 관련 데이타를 조회
 *
 * @param {*} tranData
 */
function annotation_management_list(tranData){

    tranData.res.render(tranData.tranId);

}

module.exports  = resultDao;
