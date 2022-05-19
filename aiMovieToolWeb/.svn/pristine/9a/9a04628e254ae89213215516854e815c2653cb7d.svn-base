
//select

$(function () {
	/* tab */
	$('.bbsListBox .bbsList1 > .btn').addClass('active');
	
	$('.bbsList > .btn').on('click', function(){
		$('.bbsList > .btn').removeClass('active');
		$(this).addClass('active');
		return false;
	});
	
	//select	
	var selectTarget = $('.selectboxJQ select');
	selectTarget.on('focus', function(){
		$(this).parent().addClass('focus');
	});
	selectTarget.on('blur', function(){
		$(this).parent().removeClass('focus');
	});
	selectTarget.change(function(){
		var select_name = $(this).children('option:selected').text();
		$(this).siblings('label').text(select_name);
	});	
		
	

});


$(function () {

	//FAQ		
	//if( $(this).parents('html').find('.menuListBox') ){
	if( $('html').find('.menuListBox') ){
		var H4Text = $('.menuListBox .menuListUl > li.active a').text();
		$('h4.hidden').text(H4Text)
		$('.menuListBox .menuListUl > li').find('a').append('<i>미선택</i>');
		$('.menuListBox .menuListUl > li.active').find('a').find('i').text('현재페이지');
	}
	

	
	//FAQ
	$('.viewDlBox dd').css('display','none');
	$('.viewDlBox dt > button').focusin(function(){
		$(this).parent().addClass('hover');
	}).focusout(function(){
		$(this).parent().removeClass('hover');
	});
	$('.viewDlBox dt > button').on('click', function(){
		if( $(this).hasClass('open') ){
			$(this).removeClass('open').addClass('close').parent().addClass('active_q').next('dd').addClass('active_a').slideDown(500);
			
			var dt = $(this).parent().offset();
			var plusSpace = 44;
			$('html,body').animate({scrollTop : dt.top - plusSpace}, 600);
		} else {
			$(this).removeClass('close').addClass('open').parent().removeClass('active_q').next('dd').removeClass('active_a').slideUp(500);
			
			var dt = $(this).parent().offset();
			var plusSpace = 5;
			$('html,body').animate({scrollTop : dt.top - plusSpace}, 600);
		}
	});	
	$('.viewDlBox > dd .ddClose').on('click', function(){
		$(this).parent().parent().slideUp(500).removeClass('active_a');
		$(this).parent().parent().prev('dt').removeClass('active_q').find('.close').removeClass('close').addClass('open');
		
		var dt = $(this).parent().parent().prev('dt').offset();
		var plusSpace = 5;
		$('html,body').animate({scrollTop : dt.top - plusSpace}, 600);
	});
	

	

	

})



//브라우저체크
var Browser = {
    chk : navigator.userAgent.toLowerCase()
}  
Browser = {
    ie : Browser.chk.indexOf('msie') != -1,
    ie6 : Browser.chk.indexOf('msie 6') != -1,
    ie7 : Browser.chk.indexOf('msie 7') != -1,
    ie8 : Browser.chk.indexOf('msie 8') != -1,
    ie9 : Browser.chk.indexOf('msie 9') != -1,
    ie10 : Browser.chk.indexOf('msie 10') != -1,
    opera : !!window.opera,
    safari : Browser.chk.indexOf('safari') != -1,
    safari3 : Browser.chk.indexOf('applewebkir/5') != -1,
    mac : Browser.chk.indexOf('mac') != -1,
    chrome : Browser.chk.indexOf('chrome') != -1,
    firefox : Browser.chk.indexOf('firefox') != -1
}
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
/* if (Browser.ie) {
	$("html").addClass('ieBrowser')
} */
if(Browser.ie6) {
	$("html").addClass('ieBrowser ie6');
} else if(Browser.ie7) {
	$("html").addClass('ieBrowser ie7');
} else if(Browser.ie8) {
	$("html").addClass('ieBrowser ie8');
} else if(Browser.ie9) {
	$("html").addClass('ieBrowser ie9');
} else if(Browser.ie10) {
	$("html").addClass('ieBrowser ie10');
} else if(isIE11) {
	$("html").addClass('ieBrowser ie11');
} else if(Browser.chrome) {
	$("html").addClass('crBrowser');
} else if(Browser.opera) {
	$("html").addClass('oprBrowser');
} else if(Browser.safari) {
	$("html").addClass('sfBrowser');
} else if(Browser.safari3) {
	$("html").addClass('sf3Browser');
} else if(Browser.firefox) {
	$("html").addClass('ffBrowser');
} else if(Browser.mac) {
	$("html").addClass('macBrowser');
}  else {
	$("html").addClass('etcBrowser');
}

$(window).resize(function(){// 브라우저크기가 처음열었던 크기가 달라질때
	//팝업제어
	if( $('.viewPopupUser').css('display') == 'block' ){
		var nowLP = $('.viewPopupUser').find('> div');
		var nowLPW = nowLP.width();
		var nowLPH = nowLP.height()
		var nowLPWH = nowLPW/2;
		var nowLPHH = nowLPH/2;
		$(nowLP).css({'margin-left':-nowLPWH,'margin-top':-nowLPHH});
		
		return false; 
	}	
	
	
})