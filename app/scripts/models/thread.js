define(['models/user'],function(User){

    var thread = function(threadData){
        this.id = "";
        this.name = "";
        this.href = "";
        this.owner = {};
        this.sticky = false;
        this.rating = 0;
        this.lastPost = {
            text: "",
            link: ""
        }
        this.replies = {
            number: 0,
            listLink: ""
        }
        this.views = 0;
        this.status = "";
        this.living = {
            direction: "new",
            step: 0
        };
        this.preview = "";

        if(threadData){
            this.parseThreadData(threadData);
        }
    };

    thread.prototype.setLiving = function(direction, step){
        this.living.direction = direction;
        this.living.step = step;
    }

    thread.prototype.getBackgroundColor = function(){
        if(this.sticky){
            return "sticky"
        }else{
            switch(this.living.direction){
                case "down":
                    return "down"
                    break;
                case "up":
                    return "up"
                    break;
                case "same":
                    return "same"
                    break;
                default:
                    return "new"
                    break;
            }
        }
    }

    thread.prototype.renderDirection = function(){
        if(!this.sticky){
            switch(this.living.direction) {
                case "down":
                    return React.createElement("div", {"className": "thread-living" },
                                React.createElement("i", {"className": "fa fa-arrow-down" }, ""),
                                React.createElement("span", null, " "+ this.living.step));
                    break;
                case "up":
                    return React.createElement("div", {"className": "thread-living" },
                                React.createElement("i", {"className": "fa fa-arrow-up" }, ""),
                                React.createElement("span", null, " "+ this.living.step));
                    break;
                case "same":
                    return React.createElement("div", {"className": "thread-living" },
                                React.createElement("i", {"className": "fa fa-circle" }, ""));
                    break;
                default:
                    return React.createElement("div", {"className": "thread-living" },
                                React.createElement("i", {"className": "fa fa-plus" }, ""));
                    break;
            }
        }else{
            return React.createElement("div", {"className": "thread-living" },
                        React.createElement("i", {"className": "fa fa-flag" }, ""));
        }
    }

    thread.prototype.parseThreadData = function(data){
        var $data = $('td', data),
            tdStatus = $data.eq(0),
            tdThreadName = $data.eq(1),
            tdLastPost = $data.eq(2),
            tdReplies = $data.eq(3),
            tdViews = $data.eq(4);

        var threadTitle = tdThreadName.find("a[id^='thread_title_']"),
            ratingAndOwner = $("div.smallfont span", tdThreadName);


        this.id = threadTitle.attr('id').replace(/\D+/g, '');
        this.name = threadTitle.text();
        this.href = threadTitle.attr('href');
        this.owner = new User({
            username: ratingAndOwner.eq(ratingAndOwner.length - 1).text(),
            id: ratingAndOwner.eq(ratingAndOwner.length - 1).attr("onclick").replace(/\D+/g, '')
        });
        this.lastPost = {
            text: tdLastPost.text().trim(),
            link: $("a",tdLastPost).attr("href")
        }
        this.replies = {
            number: tdReplies.text(),
            link: $("a", tdReplies).attr("href")
        }
        this.views = tdViews.text();
        this.sticky = tdThreadName.text().indexOf("Sticky:") > -1;
        this.status = $("img", tdStatus).attr("src").match(new RegExp(/([^\/]+)\.gif$/))[1];
        this.rating = $("img[src^='images/rating/rating']", tdThreadName).attr('src') ?
                        $("img[src^='images/rating/rating']", tdThreadName).attr('src').replace(/\D+/g,'') : 0;
    }

    thread.prototype.loadThreadPreview = function(callback){
        if(this.preview.length == 0){
            var url = "http://vozforums.com/showthread.php?t=" + this.id;

            $.ajax({
                url: url
            }).success(function(data){
                console.log(data);
            });
        }
    }

    return thread;
})
