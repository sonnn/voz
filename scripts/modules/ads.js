define(function(){
	var remove = function(){
		$(".middleads+table > tbody > tr > td:eq(1)").remove();
		$(".middleads+div > table > tbody > tr > td:eq(1)").remove();
		$("#threadslist").prev("div").hide();
		if($(".middleads+table > tbody > tr > td:eq(1) [id^=div-gpt-ad]").length > 0){
			$("[id^=div-gpt-ad]").hide();
			$("[id^=google_ads_div],.middleads").hide();
		}
	}

	return {
		remove: remove
	};
})