$(function () {
		
	//tab 안의 등록버튼 클릭시 등록div보이기
	$('.tabIn2').css('display','none');//등록div 기본 닫기
	$('.btnShow').bind('click', function(){//등록버튼 클릭시
		$(this).parent().parent().css('display','none');
		$(this).parent().parent().next('.tabIn2').css('display','block');
		return false;
	});
	$('.btnHide').bind('click', function(){//목록버튼클릭시
		$(this).parent().parent().css('display','none');
		$(this).parent().parent().prev('.tabIn1').css('display','block');
		return false;
	});
	

	
	/*만족도 별선택*/
	$( ".starBox a" ).on('click', function() {
		$(this).parent().children("a").removeClass("on");
		$(this).addClass("on").prevAll("a").addClass("on");
		return false;
	});
});

//탭메뉴
function tab(e, num){
    var num = num || 0;
    var menu = $(e).children();
    var con = $(e+'_con').children();
    var select = $(menu).eq(num);
    var i = num;

    select.addClass('active');
	con.hide();
    con.eq(num).show();

    menu.click(function(){
        if(select!==null){
            select.removeClass("active");
            con.eq(i).hide();
        }
        select = $(this);	
        i = $(this).index();
        select.addClass('active');
        con.eq(i).show();
		return false;
    });
	return false;
}


function tab(e, num){
    var num = num || 0;
    var menu = $(e).children();
    var con = $(e+'_con').children();
    var select = $(menu).eq(num);
    var i = num;

    select.addClass('active');
	con.hide();
    con.eq(num).show();

    menu.click(function(){
        if(select!==null){
            select.removeClass("active");
            con.eq(i).hide();
        }

        select = $(this);	
        i = $(this).index();

        select.addClass('active');
        con.eq(i).show();
    });
}