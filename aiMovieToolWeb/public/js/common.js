/*******************************************************
함 수 명 : cf_isNull
설    명 : 입력값이 null인지 체크 
인    자 : sValue    입력값 
리    턴 : true/false
*******************************************************/
function cf_isNull(sValue)
{
    if( new String(sValue).valueOf() == "undefined") 
        return true;
    if( sValue == null )
        return true;
    if( sValue.toString().trim().length == 0 )
        return true;
    return false;
}

/*******************************************************
함 수 명 : cf_checkNullAndGetFocus
설    명 : 입력값이 null인지 체크하고 포커스를 이동
인    자 : sValue    입력값 
리    턴 : true/false
*******************************************************/
function cf_checkNullAndGetFocus(jqControl, msg)
{
    if (!cf_isNull(jqControl.val()))
        return true;

    if (!cf_isNull(msg))
        alert(msg);

    jqControl.focus();
    return false;
}

/*******************************************************
함 수 명 : cf_lpad
설    명 : 문자열을 지정된 길이만큼 지정한 문자로 왼쪽을 채움 
인    자 : sValue    입력값
           nLength    출력될 문자열의 길이
           Char        채울 문자
리    턴 : 문자열
*******************************************************/
function cf_lpad(sValue, nLength, Char) {
    
    if (new String(sValue).valueOf() == "undefined")
        sValue = "";
    if (cf_isNull(sValue))
        sValue = "";

    var strRetVal = new String(sValue);
    var strChar = "";
    var nIteration = nLength - cf_getLengB(strRetVal);
    for (var i = 0; i < nIteration; i++) {
        strChar = Char + strChar;
    }
    return (strChar + strRetVal);
}


/*******************************************************
함 수 명 : cf_getLengB
설    명 : 문자열의 길이를 Byte단위로 계산하여 Return
인    자 : sValue    입력값
리    턴 : 문자길이
*******************************************************/
function cf_getLengB(sValue)
{
        var v_ChkStr = sValue.toString();
    var v_cnt = 0;

    for (var i = 0; i < v_ChkStr.length; i++) {
        if (v_ChkStr.charCodeAt(i) > 127) {
            v_cnt += 2;
        } else {
            v_cnt += 1;
        }
    }
    return v_cnt;
}


/*******************************************************
함 수 명 : cf_today
설    명 : 오늘일자세팅
인    자 : 없음
리    턴 : yyyymmdd
*******************************************************/
function cf_today()
{

    var d = new Date();

    var s = d.getFullYear() + cf_lpad((d.getMonth() + 1) + "", 2, "0")
            + cf_lpad(d.getDate(), 2, "0");

    return (s);
}

/*******************************************************
함 수 명 : cf_getHHMM
설    명 : 현재시각(시,분) 반환
인    자 : 
리    턴 : HHMM
*******************************************************/
function cf_getHHMM()
{
	var cDate = new Date();
	var cHour = cDate.getHours();
	var cMinute = cDate.getMinutes();
	if(cHour < 10) cHour = "0" + cHour;
	if(cMinute < 10) cMinute = "0" + cMinute; 
	return cHour + ":" + cMinute;
}


/*******************************************************
함 수 명 : cf_patternDay
설    명 : 일자 포맷변경
인    자 : 일자(yyyymmdd) / 구분값(-)
리    턴 : yyyy-mm-dd
*******************************************************/
function cf_patternDay(sYmd,sGbn)
{
    var sRtn = "";
    
    if(!cf_isNull(sYmd))
    {
        sRtn = sYmd.substr(0,4)    
             + sGbn
             + sYmd.substr(4,2)
             + sGbn
             + sYmd.substr(6,2);
    }

    return sRtn;
}


/*******************************************************
함 수 명 : cf_getAddDate
설    명 : 입력한 일자에 지정한 일수를 계산. 
인    자 : sDate 일자(yyyymmdd) 
          iDay 일수
리    턴 : iDay 후  일자
*******************************************************/
function cf_getAddDate(sDate,iDay) 
{
    var iTmpYy = parseInt(sDate.substr(0, 4), 10);
    var iTmpMm = parseInt(sDate.substr(4, 2), 10);
    var iTmpDd = parseInt(sDate.substr(6, 2), 10);
    var dTmpDt = new Date(iTmpYy, iTmpMm - 1, iTmpDd + iDay);

    var s = dTmpDt.getFullYear()
            + cf_lpad((dTmpDt.getMonth() + 1) + "", 2, "0")
            + cf_lpad(dTmpDt.getDate(), 2, "0");

    return (s);
}

/*******************************************************
함 수 명 : cf_checkMon
설    명 : 시작월 종료월 비교하여 특정 개월이 넘는지 체크.
인    자 : sMon 시작월(yyyymm) 
          eMon 종료월(yyyymm)
          lmtMon 유효개월수
리    턴 : true, false
*******************************************************/
function cf_checkMon(sMon,eMon,lmtMon) 
{
	if (sMon.length < 6 || sMon.length < 6)
		return false;
	
	if (sMon.length == 6){
		sMon	= sMon.substring(0, 4) + "-" + sMon.substring(4, 6);  
	}
	if (eMon.length == 6){
		eMon	= eMon.substring(0, 4) + "-" + eMon.substring(4, 6);  
	}
	
	var startDate = new Date(sMon + "-01");
	var endDate = new Date(eMon + "-01");
	
	var years	= endDate.getFullYear() - startDate.getFullYear();
	var mons	= endDate.getMonth() - startDate.getMonth();

	var diffMon	= years*12 + mons;
	if (diffMon < lmtMon){
		return true;
	}
	else {
		return false;
	}
}

/*******************************************************
함 수 명 : cf_checkDate
설    명 : 시작일 종료일 비교하여 93일 넘는지 체크.
인    자 : sDate 시작일자(yyyy-mm-dd) 
          eDate 종료일자(yyyy-mm-dd)
리    턴 : iDay 후  일자
*******************************************************/
function cf_checkDate(sDate,eDate) 
{
	var startDate = new Date(sDate);
	var endDate = new Date(eDate);
	var diff = endDate - startDate;
	var currDay = 24 * 60 * 60 * 1000;
    var diffDay = parseInt(diff/currDay);

    if(diffDay <= 93){
    	return true;
    }else{
    	alert("조회기간은 93일 이하로 가능합니다.");
    	return false;
    }
}

/*******************************************************
함 수 명 : cf_checkToday
설    명 : 입력된 날짜와 오늘날짜 비교해서 리턴
인    자 : sDate 시작일자(yyyy-mm-dd) 
리    턴 : true / false
*******************************************************/
function cf_checkToday(sDate) 
{
	var startDate = new Date(sDate);
	var endDate = new Date();
	var diff = endDate - startDate;
	var currDay = 24 * 60 * 60 * 1000;
    var diffDay = parseInt(diff/currDay);
    
    if(diffDay <= 0){
    	return true;
    }else{
    	alert("과거날짜는 입력이 불가능합니다.");
    	return false;
    }
}

/*******************************************************
함 수 명 : cf_isNumberChk
설    명 : 숫자만 입력되도록 제한
인    자 : 입력값
리    턴 : boolean
*******************************************************/
function cf_isNumberChk(sValue) {
    
    var val = sValue;
    var Num = "1234567890";

    for (var i=0; i<val.length; i++) {
        if(Num.indexOf(val.substring(i,i+1))<0) {
            return false;
        }
    }
    return true;
}

/*******************************************************
함 수 명 : cf_checkNumberAndGetFocus
설    명 : 숫자만 입력되도록 제한
인    자 : 입력값
리    턴 : boolean
*******************************************************/
function cf_checkNumberAndGetFocus(jqControl, msg) {

    if (cf_isNumberChk(jqControl.val()))
        return true;

    if (!cf_isNull(msg))
        alert(msg);

    jqControl.focus();
    return false;
}

/*******************************************************
함 수 명 : cf_chkNumOnly
설    명 : 입력창 입력제한(숫자만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkNumOnly(obj){
    var lkeycode;
    e = window.event;
    if(window.event){ 
        
        lkeycode = e.keyCode; 
    } 
    else{ 
        lkeycode = e.charCode; 
    } 
    
    if(lkeycode != 0){
        if(!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val( $(obj).val().replace(/[^0-9]/g, ''));
        }
    }
    
}

/*******************************************************
함 수 명 : cf_chkNumDotOnly
설    명 : 입력창 입력제한(숫자, 점(.)만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkNumDotOnly(obj){
    var lkeycode;
    e = window.event;
    if(window.event){ 
        
        lkeycode = e.keyCode; 
    } 
    else{ 
        lkeycode = e.charCode; 
    } 
    
    if(lkeycode != 0){
        if(!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val( $(obj).val().replace(/[^0-9.]/g, ''));
        }
    }
    
}

/*******************************************************
함 수 명 : cf_chkEngLowNum
설    명 : 입력창 입력제한(영소문자, 숫자만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkEngLowNum(obj){
    var lkeycode;
    e = window.event;
    if(window.event){ 
        
        lkeycode = e.keyCode; 
    } 
    else{ 
        lkeycode = e.charCode; 
    } 
    
    if(lkeycode != 0){
        if(!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val( $(obj).val().replace(/[^a-z0-9]/g, ''));
        }
    }
    
}

/*******************************************************
함 수 명 : cf_chkEngLowNum2
설    명 : 입력창 입력제한(영소문자,영대문자, 숫자만 입력가능) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkEngLowNum2(obj){
    var lkeycode;
    e = window.event;
    if(window.event){ 
        
        lkeycode = e.keyCode; 
    } 
    else{ 
        lkeycode = e.charCode; 
    } 
    
    if(lkeycode != 0){
        if(!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val( $(obj).val().replace(/[^a-zA-Z0-9]/g, ''));
        }
    }
    
}

/*******************************************************
함 수 명 : cf_chkPwd
설    명 : 입력창 입력제한(비밀번호필드) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkPwd(obj){
    var lkeycode;
    e = window.event;
    if(window.event){ 
        
        lkeycode = e.keyCode; 
    } 
    else{ 
        lkeycode = e.charCode; 
    } 
    
    if(lkeycode != 0){
        if(!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val( $(obj).val().replace(/[^a-zA-Z0-9~`!@#$%&^*()\-_=+\\\|\[\]{};:\'",.<>\/?]/gi, ''));
        }
    }
}


/*******************************************************
함 수 명 : cf_chkKo
설    명 : 입력창 입력제한(한글만입력) 
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkKo(obj){
    var lkeycode;
    e = window.event;
    if(window.event){ 
        
        lkeycode = e.keyCode; 
    } 
    else{ 
        lkeycode = e.charCode; 
    } 
    
    if(lkeycode != 0){
        if(!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val( $(obj).val().replace(/[a-z0-9\s~`!@#$%&^*()\-_=+\\\|\[\]{};:\'",.<>\/?]/gi, ''));
        }
    }
}


/*******************************************************
함 수 명 : cf_chkEmail
설    명 : 입력창 입력제한(이메일)
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkEmail(obj) {
    var lkeycode;
    e = window.event;
    if (window.event) {

        lkeycode = e.keyCode;
    } else {
        lkeycode = e.charCode;
    }

    if (lkeycode != 0) {
        if (!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val($(obj).val().replace(/[^a-zA-Z0-9._-]/g, ''));
        }
    }
}

/*******************************************************
함 수 명 : cf_chkEmailId
설    명 : 입력창 입력제한(이메일@포함)
인    자 :  obj - input id
리    턴 : 변환 문자
*******************************************************/
function cf_chkEmailId(obj) {
    var lkeycode;
    e = window.event;
    if (window.event) {

        lkeycode = e.keyCode;
    } else {
        lkeycode = e.charCode;
    }

    if (lkeycode != 0) {
        if (!(lkeycode >= 37 && lkeycode <= 40)) {
            $(obj).val($(obj).val().replace(/[^a-zA-Z0-9@._-]/g, ''));
        }
    }
}

/*******************************************************
함 수 명 : cf_formatNumber
설    명 : 숫자에 , 처리 
인    자 : 숫자
리    턴 : 콤마 숫자
*******************************************************/
function cf_formatNumber(val)
{
   
    var returnVal = val;
    
    returnVal = returnVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
   return returnVal;
}

/*******************************************************
함 수 명 : cf_getNumberOnly
설    명 : 숫자만 리턴
인    자 : string
리    턴 : number string
*******************************************************/
function cf_getNumberOnly (str) {
    var len      = str.length;
    var sReturn  = "";

    for (var i=0; i<len; i++) 
    {
        if ( (str.charAt(i) >= "0") && (str.charAt(i) <= "9") ) 
        {
            sReturn += str.charAt(i);
        }
    }
    return sReturn;
}

/*******************************************************
함 수 명 : cf_formatCard
설    명 : - 처리 
인    자 : 숫자
리    턴 : 콤마 숫자
*******************************************************/
function cf_getCardFormat(val){
	var returnVal = val;
    
    returnVal = returnVal.toString().replace(/\B(?=(\d{4})+(?!\d))/g, '-');
    
   return returnVal;
}

//목록화면에 리스트 개수 선택하는 함수
$(document).ready(function(){
	$("select[name='selRecordCount']").on('change',function() {
		$("input[name=pageIndex]").val(1);
		$("form[name='listForm']").submit();
	});
});

//계좌인증 공통
function goCertiAcc(ptnrNo, bankCode, accountNo, accountHolder){
	var result = "";

	$.ajax({
		url : "/com/common/accAuth.do"
        ,type: "POST"
        ,data: {"partner_no":ptnrNo, "bank_code":bankCode, "account_no":accountNo, "account_holder": accountHolder}
        ,success : function(data){
        	$("#aaaa").hide();
        	//resultCode, result 리턴받음
        	//alert(data.resultCode);
        	//alert(data.result);
        	//alert(data.authStatus);
        	certiResult(data);
        }
        ,beforeSend:function(){
        	$("#aaaa").show();
        }
	    ,error: function(){
	    	alert("장애가 발생했습니다. 관리자에게 문의 하세요.");
	    }
	});
}