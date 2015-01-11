define([
		'ads',
		'utils',
		'threads',
		'thread'
	],function(AdsModule, UtilsModule, ThreadsModule, ThreadModule){
		function init(){
			// remove ads
			AdsModule.remove();
			
			// thread init
			if(UtilsModule.isThreadList()){
				var threads = new ThreadsModule();
				threads.init();
			}else{
				var thread = new ThreadsModule();
				thread.init();
			} 
		}

		return {
			init: init
		}
	})