define(function () {
	function parseNum(str){
	  	return parseInt(str.replace(/,/g, ""));
	}

	function isThreadList(){
		return $('#threadslist').length > 0;
	}

	return {
		parseNum : parseNum,
		isThreadList : isThreadList
	};
});