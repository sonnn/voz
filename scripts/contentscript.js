'use strict';


require.load = function(ctx, module, url){
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open("GET", chrome.extension.getURL(url) + "?=" + (new Date()).getTime(), true);
  xhr.onreadystatechange = function(e){
    if(xhr.readyState === 4 && xhr.status === 200){
      eval(xhr.responseText);
      ctx.completeLoad(module);
    }
  }
  xhr.send(null);
}

requirejs.config({
    "baseUrl": "../scripts/"
});

requirejs(["app"],function(app){
  app.init();
});
