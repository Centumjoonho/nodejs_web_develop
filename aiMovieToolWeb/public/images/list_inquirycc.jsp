<%@	page contentType="text/html; charset=utf-8"%>
<%@ include file="/WEB-INF/jsp/admin/include/common.jsp"%>
<%
	ParamMap paramMap = (ParamMap) request.getAttribute("paramMap");
	long curr_page = (Long) request.getAttribute("curr_page");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
<head>
<title></title>

<script type="text/javascript" charset="utf-8">
$(document).ready(function(){
	if("${sch_calculate_gubun}" == 'M'){
		$("#lbl_calculation_Mdate").show();
		$("#lbl_calculation_Ddate").hide();
	}else{
		$("#lbl_calculation_Mdate").hide();
		$("#lbl_calculation_Ddate").show();
	}
	
	if("${sch_fee_type}" == 'S'){
		$("#cal_client_S").show();
		$("#cal_client_E").hide();
		$("#cal_client_B").hide();
	}else if("${sch_fee_type}" == 'E'){
		$("#cal_client_S").hide();
		$("#cal_client_E").show();
		$("#cal_client_B").hide();
	}else if("${sch_fee_type}" == 'B'){
		$("#cal_client_S").hide();
		$("#cal_client_E").hide();
		$("#cal_client_B").show();
	}
	
	$("input[name='sch_calculate_gubun']").change(function(){
		if($(this).val() == "M"){
			$("#lbl_calculation_Mdate").show();
			$("#lbl_calculation_Ddate").hide();
		}else{
			$("#lbl_calculation_Mdate").hide();
			$("#lbl_calculation_Ddate").show();
		}
	});	
		
	//판매대행사명 검색
	$("#sch_button_clientName").click(function() {
		var client_name = $("#sch_value_clientName").val();

		$.ajax({
			type : "POST",
			url : "<c:out value='/common/api/searchBtobClient.json' />",
			data : {"client_name" : client_name},
			dataType : "json",
			async : "false",
			success : function(data) {
				var disp_str = "";
				$(data).each(function() {
					var tags = new StringBuffer();

					tags.append("<tr>");
					tags.append("<td><input type=\"radio\" name=\"client_id\" class=\"radio\" value=\"" +  this["client_id"] + "\"/></td>");
					tags.append("<input type=\"hidden\" name=\"" + this["client_id"] + "_client_name\" value=\"" +  this["client_name"] + "\"/>");
					tags.append("<td>" + this["client_name"] + "</td>");
					tags.append("<td>" + this["client_id"] + "</td>");
					tags.append("</tr>");

					disp_str = disp_str + tags.toString();
				});
				$("#disp_html_clientName").html(disp_str);
			},
			error : function(data, status, err) {
				alert(status + ' : <s:text name="common.msg.에러발생"/>');
			}
		});
	});
	
	//판매대행사명 선택
	$('#layer-pop_close_clientName').click(function() {
		var client_id = $("input:radio[name=client_id]:checked").val();
		var client_name = $("input:hidden[name=" + client_id+ "_client_name]").val();
		
		$("input[name='sch_client_name']").val(client_name);
	});
	
	//확정 버튼 클릭
	$("#btnConfirm").click(function() {
		if($("input[name='cal_confirm']:checked").length < 1){
			alert("확정할 정산 내역을 선택해주세요.");
			return false;
		}
		
		//파라미터 저장
		var calDtList = new Array();
		var calComIdList = new Array();
		$("input[name='cal_confirm']:checked").each(function(idx,item){
			calDtList.push($(this).closest('tr').find("td").eq(2).text());
			calComIdList.push($(this).val());
		});
		
		$.ajaxSettings.traditional = true;
		$.ajax({
			type : "post",
			url : "<c:out value='/common/api/confirmCalculation.json'/>",
			data : {"function_type" : "confirm",
				 	"calDtList" : calDtList,
					"calComIdList" : calComIdList,
					"cal_knd" : "${sch_fee_type}"},
			dataType : "json",
			async : "false",
			success : function(data) {
	        	$(data).each(function() {
	        		if (this["resultCode"] == "1") {
	        			alert('확정완료 하였습니다.');
	        			$("#list_inquiry").submit();
	        		}else{
	        			alert('<s:text name="common.msg.에러발생"/>');
	        		}
	        	});
			},
			error : function(data, status, err) {
				alert(status + ' : <s:text name="common.msg.에러발생"/>');
			}
		});
	});
	
	//확정 취소  클릭
	$("label#btnCancel").click(function() {
		//파라미터 저장
		var calDtList = new Array();
		var calComIdList = new Array();
		calDtList.push($(this).closest('tr').find("td").eq(2).text());
		calComIdList.push($(this).attr("cal_com_id"));
		
		if(confirm("확정취소 하시겠습니까?")){
			$.ajaxSettings.traditional = true;
			$.ajax({
				type : "post",
				url : "<c:out value='/common/api/confirmCalculation.json'/>",
				data : {"function_type" : "cancel",
						"calDtList" : calDtList,
						"calComIdList" : calComIdList,
						"cal_knd" : "${sch_fee_type}"},
				dataType : "json",
				async : "false",
				success : function(data) {
		        	$(data).each(function() {
		        		if (this["resultCode"] == "1") {
		        			alert('확정취소 하였습니다.');
		        			$("#list_inquiry").submit();
		        		}else{
		        			alert('<s:text name="common.msg.에러발생"/>');
		        		}
		        	});
				},
				error : function(data, status, err) {
					alert(status + ' : <s:text name="common.msg.에러발생"/>');
				}
			});
		}
	});
	
	$("#listExcel").click(function() {
		document.list_inquiry.action = "<c:out value='list_inquiryExcel.do'/>";
		document.list_inquiry.submit();
		document.list_inquiry.action = "";
	});
	
	//정산내역서
	$("button#popView").click(function() {
		//get
		var url = "<c:out value='pop_statement.do'/>";
		url += "?pop_cal_com_id=" + $(this).attr("cal_com_id") + "";
		url += "&pop_cal_dt=" + $(this).attr("cal_dt") + "";
		url += "&pop_calculate_gubun=" + "${sch_calculate_gubun}" + "";
		
		//get
		window.open(url, "popup", "width=950, height=1200, menubar=no, status=no, toolbar=no, titlebar=yes, resizable=yes");
		
		//post
		//$("#pop_cal_com_id").val($(this).attr("cal_com_id"));
		//$("#pop_cal_dt").val($(this).attr("cal_dt"));
		//$("#pop_calculate_gubun").val("${sch_calculate_gubun}");
		
		//post
		//window.open("", "popup", "width=950, height=1200, menubar=no, status=no, toolbar=no, titlebar=yes, resizable=yes");
		
		//document.pop_statement.target = "popup";
		//document.pop_statement.action = "<c:out value='pop_statement.do'/>";
		//document.pop_statement.submit();
	});
});

function fnDetail(cal_mst_id){
	$("#cal_mst_id").val(cal_mst_id);
	$("#sch_selRecordCount").val($("#selRecordCount").val());
	
	var objForm = document.list_inquiry;
	objForm.action = "<c:out value='view_detail.do'/>";
	objForm.submit();
}

function enterKeyEvent(e,target){
	 if(e.keyCode == 13) {
  	  $("#"+target).trigger("click");
	}
}
</script>

</head>
<body>
	<!-- Contents 시작 -->
	<div id="contents">
	    <h2>판매대행사 정산<span>Home > 정산 > 판매대행사 정산 </span></h2>
	    <div class="cboth"></div>

		<div class="search">
			<s:form name="list_inquiry" method="post" action="list_inquiry" validate="false">
			<s:hidden id="selRecordCount" name="selRecordCount"/>
			
			<input type="hidden" id="sch_selRecordCount" name="sch_selRecordCount"/>
			<input type="hidden" id="sch_curr_page" name="sch_curr_page" value='<%=curr_page %>'/>
			<s:hidden id="cal_mst_id" name="cal_mst_id"/>
				<legend class="invisible"><s:text name="검색폼"/></legend>
				<table>
					<colgroup>
						<col style="width: 9%;" />
                        <col style="width: 41%;" />
                        <col style="width: 9%;" />
                        <col style="width: 41;" />
					</colgroup>
					<tr>
						<th scope="row"><s:text name="common.lbl.판매대행사명"/></th>
						<td>
							<s:textfield name="sch_client_name" title="%{getText('common.lbl.판매대행사명')}" cssClass="text sizePer2" maxlength="128" maxbyte="128" />
							<a href="#clientName" class="btn-layer"><img src="<%=request.getContextPath() %>/resource/images/btn/btn_search.gif" alt="%{getText('common.btn.검색')}" /></a>
						</td>
						<th scope="row"><s:text name="common.lbl.정산방식"/></th>
						<td>
							<cf:radio_button code_group_id="CAL_FEE_TYPE" name="sch_fee_type" cssClass="radio" code_group_except="R"/>
						</td>
					</tr>
					<tr>
						<th scope="row"><s:text name="common.lbl.정산구분"/></th>
						<td colspan="3">
							<cf:radio_button code_group_id="IS_CALCULATE_GUBUN" name="sch_calculate_gubun" cssClass="radio"/>
						</td>
					</tr>
					<tr>
						<th scope="row"><s:text name="common.lbl.조회기간"/></th>
						<td colspan="3">
							<label id="lbl_calculation_Ddate" style="display: none;">
								<span class="date"><s:textfield name="sch_start_date" cssClass="text datepicker sizePer1" /> </span> ~ <span class="date"><s:textfield name="sch_end_date" cssClass="text datepicker sizePer1" /></span>
								<button id="today_button" class="btnType01s" type="button">당일</button>
								<button id="week_button" class="btnType01s" type="button">일주일</button>
								<button id="month_button" class="btnType01s" type="button">월별</button>
							</label>
							<label id="lbl_calculation_Mdate" style="display: none;">
								<span class="date"><s:textfield name="sch_start_month" cssClass="text monthpicker numberOnly" cssStyle="width:100px;" maxlength="6"  /></span>
							</label>						
						</td>
					</tr>
				</table>
	            <div class="txetc mt20 mb30">
					<cf:submit_button admin_level_id="<%=loginInfo.getAdmin_level_id()%>" admin_menu_id="<%=loginInfo.getAdmin_menu_id()%>" cmd_type="R" cssClass="btn-inquiry" value="%{getText('common.btn.조회')}" />
	            </div>
			</s:form>
		</div>
		
		<!-- List 시작 -->
		<div class="listcasetit">
			<h3>* <s:text name="common.lbl.총건수"/><span> ${pageHelper.totalRows}</span></h3>
			
			<div class="listcasebtn">
		    	<button id="listExcel" class="btnType06 btnImg01">Excel 다운로드</button>
		    	<c:if test="${approvalChk == true}">
		    		<button id="btnConfirm" class="btnImg10 btnType08" type="button">확정</button>
		    	</c:if>
		    	<div class="selectboxJQ">
		    		<label for="recordCount">${pageHelper.pageSize}</label>
					<cf:select_box name="selRecordCount" id="selRecordCount" code_group_id="LIST_RECORD_COUNT" cssStyle="width:80px;"  />
	             </div>
			</div>
			
			<!-- 판매대행사 발행당 정산 -->
			<table id="cal_client_S" class="board-list nohover" summary=".">
				<caption></caption>
				<colgroup>
					<c:if test="${approvalChk == false}">
						<col style="width: 6%;" />
					</c:if>
					<c:if test="${approvalChk == true}">
						<col style="width: 3%;" />
						<col style="width: 3%;" />
					</c:if>
					<col style="width: 7%;" />
					<col style="width: 8%;" />
					<col style="width: 6%;" />
					<col style="width: 8%;" />
					<col style="width: 5%;" />
					<col style="width: 8%;" />
					<col style="width: 5%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 7%;" />
				</colgroup>
				<thead>
					<tr>
						<c:if test="${approvalChk == true}">
							<th><s:text name="common.lbl.선택"/></th>
						</c:if>
						<th><s:text name="common.lbl.NO"/></th>
						<th><s:text name="common.lbl.기간"/></th>
						<th><s:text name="common.lbl.판매대행사명"/></th>
						<th><s:text name="common.lbl.수수료방식"/></th>
						<th><s:text name="common.lbl.발행금액"/></th>
						<th><s:text name="common.lbl.발행건수"/></th>
						<th><s:text name="common.lbl.발행취소금액"/></th>
						<th><s:text name="common.lbl.발행취소건수"/></th>
						<th><s:text name="common.lbl.실발행금액"/></th>
						<th><s:text name="common.lbl.수수료금액"/></th>
						<th><s:text name="common.lbl.부가세"/></th>
						<th><s:text name="common.lbl.정산액"/></th>
						<th><s:text name="common.lbl.총정산액"/></th>
						<th><s:text name="common.lbl.내역서"/></th>
					</tr>
				</thead>
				<tbody>
					<c:forEach items="${pageHelper.list}" var="list">
						<tr>
							<c:if test="${approvalChk == true}">
							<td rowspan="3">
								<c:if test="${list.CAL_STT != 'CONF_DONE' }">
									<input type="checkbox" name="cal_confirm" value='${list.CAL_COM_ID}' />
								</c:if>
							</td>
							</c:if>
							<td rowspan="3" class="num">${list.RNUM}</td>
							<td rowspan="3">${list.CAL_DT}</td>
							<td rowspan="3"><a href="#" onclick="fnDetail('${list.CAL_MST_ID}')">${list.CLIENT_NAME}</a></td>
							<td>${list.DC_FEE_KND_NAME}</td>
							<td><f:formatNumber value="${list.DC_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_FEE_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_FEE_VAT_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_CAL_AMT}" type="number" /></td>
							<td rowspan="3"><f:formatNumber value="${list.SUM_CAL_AMT}" type="number" /></td>
							<td rowspan="3">
								<c:if test="${list.CAL_STT == 'CONF_DONE' }">
									<button id="popView" class="btnType04s" type="button" style="margin-bottom: 10px;" cal_dt='${list.CAL_DT }' cal_com_id='${list.CAL_COM_ID }'>정산서</button>
									<c:if test="${approvalChk == true}">
										<br />
										<label id="btnCancel" class="labelType" cal_com_id='${list.CAL_COM_ID}'>확정취소</label>
									</c:if>
								</c:if>
							</td>
						</tr>
						<tr>
							<td class="borderL">${list.CM_FEE_KND_NAME}</td>
							<td><f:formatNumber value="${list.CM_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_FEE_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_FEE_VAT_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_CAL_AMT}" type="number" /></td>
						</tr>
						<tr>
							<td class="borderL">${list.CP_FEE_KND_NAME}</td>
							<td><f:formatNumber value="${list.CP_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_FEE_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_FEE_VAT_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_CAL_AMT}" type="number" /></td>
						</tr>
					</c:forEach>
				</tbody>
			</table>
			

			<!-- 판매대행사 사용당 정산 -->
			<table id="cal_client_E" class="board-list nohover" summary="." style="display: none;">
				<caption></caption>
				<colgroup>
					<c:if test="${approvalChk == false}">
						<col style="width: 6%;" />
					</c:if>
					<c:if test="${approvalChk == true}">
						<col style="width: 3%;" />
						<col style="width: 3%;" />
					</c:if>
					<col style="width: 7%;" />
					<col style="width: 8%;" />
					<col style="width: 6%;" />
					<col style="width: 8%;" />
					<col style="width: 5%;" />
					<col style="width: 8%;" />
					<col style="width: 5%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 8%;" />
					<col style="width: 7%;" />
				</colgroup>
				<thead>
					<tr>
						<c:if test="${approvalChk == true}">
							<th><s:text name="common.lbl.선택"/></th>
						</c:if>
						<th><s:text name="common.lbl.NO"/></th>
						<th><s:text name="common.lbl.기간"/></th>
						<th><s:text name="common.lbl.판매대행사명"/></th>
						<th><s:text name="common.lbl.수수료방식"/></th>
						<th><s:text name="common.lbl.사용금액"/></th>
						<th><s:text name="common.lbl.사용건수"/></th>
						<th><s:text name="common.lbl.사용취소금액"/></th>
						<th><s:text name="common.lbl.사용취소건수"/></th>
						<th><s:text name="common.lbl.실사용금액"/></th>
						<th><s:text name="common.lbl.수수료금액"/></th>
						<th><s:text name="common.lbl.부가세"/></th>
						<th><s:text name="common.lbl.정산액"/></th>
						<th><s:text name="common.lbl.총정산액"/></th>
						<th><s:text name="common.lbl.내역서"/></th>
					</tr>
				</thead>
				<tbody>
					<c:forEach items="${pageHelper.list}" var="list">
						<tr>
							<c:if test="${approvalChk == true}">
							<td rowspan="3">
								<c:if test="${list.CAL_STT != 'CONF_DONE' }">
									<input type="checkbox" name="cal_confirm" value='${list.CAL_COM_ID}' />
								</c:if>
							</td>
							</c:if>
							<td rowspan="3" class="num">${list.RNUM}</td>
							<td rowspan="3">${list.CAL_DT}</td>
							<td rowspan="3"><a href="#" onclick="fnDetail('${list.CAL_MST_ID}')">${list.CLIENT_NAME}</a></td>
							<td>${list.DC_FEE_KND_NAME}</td>
							<td><f:formatNumber value="${list.DC_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_FEE_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_FEE_VAT_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.DC_CAL_AMT}" type="number" /></td>
							<td rowspan="3"><f:formatNumber value="${list.SUM_CAL_AMT}" type="number" /></td>
							<td rowspan="3">
								<c:if test="${list.CAL_STT == 'CONF_DONE' }">
									<button id="popView" class="btnType04s" type="button" style="margin-bottom: 10px;" cal_dt='${list.CAL_DT }' cal_com_id='${list.CAL_COM_ID }'>정산서</button>
									<c:if test="${approvalChk == true}">
										<br />
										<label id="btnCancel" class="labelType" cal_com_id='${list.CAL_COM_ID}'>확정취소</label>
									</c:if>
								</c:if>
							</td>
						</tr>
						<tr>
							<td class="borderL">${list.CM_FEE_KND_NAME}</td>
							<td><f:formatNumber value="${list.CM_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_FEE_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_FEE_VAT_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CM_CAL_AMT}" type="number" /></td>
						</tr>
						<tr>
							<td class="borderL">${list.CP_FEE_KND_NAME}</td>
							<td><f:formatNumber value="${list.CP_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_FEE_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_FEE_VAT_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.CP_CAL_AMT}" type="number" /></td>
						</tr>
					</c:forEach>
				</tbody>
			</table>
			
			
			<!-- 판매대행사 퇴장 정산 -->
			<table id="cal_client_B" class="board-list nohover" summary="." style="display: none;">
				<caption></caption>
				<colgroup>
					<c:if test="${approvalChk == false}">
						<col style="width: 6%;" />
					</c:if>
					<c:if test="${approvalChk == true}">
						<col style="width: 3%;" />
						<col style="width: 3%;" />
					</c:if>
					<col style="width: 9%;" />
					<col style="width: 12%;" />
					<col style="width: 12%;" />
					<col style="width: 9%;" />
					<col style="width: 12%;" />
					<col style="width: 9%;" />
					<col style="width: 12%;" />
					<col style="width: 12%;" />
					<col style="width: 7%;" />
				</colgroup>
				<thead>
					<tr>
						<c:if test="${approvalChk == true}">
							<th><s:text name="common.lbl.선택"/></th>
						</c:if>
						<th><s:text name="common.lbl.NO"/></th>
						<th><s:text name="common.lbl.기간"/></th>
						<th><s:text name="common.lbl.판매대행사명"/></th>
						<th><s:text name="common.lbl.퇴장금액"/></th>
						<th><s:text name="common.lbl.퇴장건수"/></th>
						<th><s:text name="common.lbl.퇴장취소금액"/></th>
						<th><s:text name="common.lbl.퇴장취소건수"/></th>
						<th><s:text name="common.lbl.실퇴장금액"/></th>
						<th><s:text name="common.lbl.정산액"/></th>
						<th><s:text name="common.lbl.내역서"/></th>
					</tr>
				</thead>
				<tbody>
					<c:forEach items="${pageHelper.list}" var="list">
						<tr>
							<c:if test="${approvalChk == true}">
							<td>
								<c:if test="${list.CAL_STT != 'CONF_DONE' }">
									<input type="checkbox" name="cal_confirm" value='${list.CAL_COM_ID}' />
								</c:if>
							</td>
							</c:if>
							<td class="num">${list.RNUM}</td>
							<td>${list.CAL_DT}</td>
							<td><a href="#" onclick="fnDetail('${list.CAL_MST_ID}')">${list.CLIENT_NAME}</a></td>
							<td><f:formatNumber value="${list.OUT_NORM_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.OUT_NORM_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.OUT_CNCL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.OUT_CNCL_CNT}" type="number" /></td>
							<td><f:formatNumber value="${list.OUT_REAL_AMT}" type="number" /></td>
							<td><f:formatNumber value="${list.OUT_CAL_AMT}" type="number" /></td>
							<td>
								<c:if test="${list.CAL_STT == 'CONF_DONE' }">
									<button id="popView" class="btnType04s" type="button" style="margin-bottom: 10px;" cal_dt='${list.CAL_DT }' cal_com_id='${list.CAL_COM_ID }'>정산서</button>
									<c:if test="${approvalChk == true}">
										<br />
										<label id="btnCancel" class="labelType" cal_com_id='${list.CAL_COM_ID}'>확정취소</label>
									</c:if>
								</c:if>
							</td>
						</tr>
					</c:forEach>
				</tbody>
			</table>			
			<!-- List 끝 -->
		
			<div class="paging">
				<c:import url="/WEB-INF/jsp/admin/include/paging.jsp">
					<c:param name="pageLink" value="list_inquiry.do"></c:param>
					<c:param name="pageName" value="curr_page"></c:param>
					<c:param name="pageValue" value="<%=paramMap.remParam(\"curr_page\").getQueryStringBase64()%>"></c:param>
				</c:import>
			</div>
		</div>
	</div>
	<!-- //content -->
	
	<s:form name="pop_statement" method="post" action="pop_statement" validate="false">
		<input type="hidden" id="pop_cal_com_id" name="pop_cal_com_id" value="" />
		<input type="hidden" id="pop_cal_dt" name="pop_cal_dt" value="" />
		<input type="hidden" id="pop_calculate_gubun" name="pop_calculate_gubun" value="" />
	</s:form>
	
	<!-- 판매대행사 조회 팝업 -->
	<div id="clientName" class="layer-pop">
		<p class="layer-tit"><img src="<%=request.getContextPath() %>/resource/images/common/popup_title.gif" /><s:text name="common.lbl.판매대행사조회"/></p>
		<div class="layer-cont">
			<div class="pop-search txetR">
				<s:textfield id="sch_value_clientName" type="text" class="text" title="%{getText('common.lbl.판매대행사입력')}" style="width: 385px;" onkeypress="enterKeyEvent(event,'sch_button_clientName');" />
				<button id="sch_button_clientName" class="btn-inquiryP" type="submit"><s:text name="common.btn.조회"/></button>
			</div>
			<div class="scroll-tbl" style="width: 450px; height: 135px;">
				<table class="board-list">
					<caption><s:text name="common.lbl.판매대행사명조회"/></caption>
					<colgroup>
						<col style="width: 5%" />
						<col />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th scope="col"><s:text name="common.lbl.선택"/></th>
							<th scope="col"><s:text name="common.lbl.판매대행사명"/></th>
							<th scope="col"><s:text name="common.lbl.판매대행사ID"/></th>
						</tr>
					</thead>
					<tbody id="disp_html_clientName">
					</tbody>
				</table>
			</div>
			<div class="btn-center">
                <button id="layer-pop_close_clientName" class="btnType01 _pop_close"><s:text name="common.btn.확인"/></button>
			</div>
		</div>
		<div class="btn-close">
			<button class="_pop_close">
				<img src="<%=request.getContextPath() %>/resource/images/btn/btn_close.gif" alt='<s:text name="common.btn.닫기"/>' />
			</button>
		</div>
	</div>
	<!-- //layer popup -->
</body>
</html>