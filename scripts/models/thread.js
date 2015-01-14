define(['models/user'],function(User){

    var thread = function(threadData){
        this.id = "";
        this.name = "";
        this.href = "";
        this.owner = {};
        this.sticky = false;
        this.rating = 0; // not implement yet
        this.lastPost = {
            text: "",
            link: ""
        }
        this.replies = {
            number: 0,
            listLink: ""
        }
        this.views = 0;
        this.status = ""; // not implement yet
        this.living = {
            direction: "new",
            step: 0
        };

        if(threadData){
            this.parseThreadData(threadData);
        }
    };

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
                case "new":
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

    thread.prototype.setLiving = function(direction, step){
        this.living.direction = direction;
        this.living.step = step;
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
    }

    return thread;
})
