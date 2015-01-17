define([
		'modules/ads',
		'modules/utils',
		'modules/threads'
	],function(AdsModule, UtilsModule, ThreadsModule){
		function init(){
			// remove ads
			AdsModule.remove();

			// thread init
			if(UtilsModule.isThreadList()){
				var threads = new ThreadsModule();
				threads.init();
			}else{
				 
 			}
		}

		return {
			init: init
		}
	})
