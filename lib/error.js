/**
 * error.js 에러 메시지를 출력
 * 
 * date : 20.03.20
 * author : sdkim  
 */

var errorProc  = {
   userMessage : {
      noPageHandler     : '요청 페이지의 처리자가 없습니다.',
      noPage            : '무효한 화면입니다.',
      inValidParameter  : '무효한 인수가 전달되었습니다.',
      noFile            : '요청한 파일이 존재하지 않습니다.'
   },
   errorPage   : function(res, error){
      res.render('error', {errMsg:error.message});
   }

};

module.exports = errorProc;