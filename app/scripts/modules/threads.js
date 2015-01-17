define(['models/thread'],function(Thread){
	var threadsModule;

	threadsModule = function(){
		this.threads = [];
		this.refreshDelay = 10000;
	}

	threadsModule.prototype.getThreads = function(respone){
		var threads = [];
		if(!respone){
			$("#threadslist tbody tr").each(function(i, el){
				if($(el).find("td[id^='td_threadtitle_']").length > 0) threads.push(new Thread(el));
			});
		}else{
			$("#threadslist tbody tr", respone).each(function(i, el){
				if($(el).find("td[id^='td_threadtitle_']").length > 0) threads.push(new Thread(el));
			});
		}
		return threads;
	}

	threadsModule.prototype.hideOldView = function(){
		$("#threadslist").hide(); // hide old threadslist
		if($("#newthreadslist").length === 0) $("#threadslist").after("<div id='newthreadslist'></div>");
	}

	threadsModule.prototype.renderNewThreadsView = function(){
		if(this.threads.length === 0){
			this.getThreads();
		}
		this.hideOldView();

		var self = this;

		var ThreadsList = React.createClass({displayName: "ThreadsList",
			render: function() {
				var self = this,
				rowTemplate = function(thread) {
			      	return React.createElement("tr", {"className": thread.getBackgroundColor(), "onClick": self.props.setThreadPreview.bind(null, thread)},
			      		React.createElement("td", null,
			      			React.createElement("a", {"href": thread.href }, thread.name ),
			      			React.createElement("div", {"className": "thread-owner" }, thread.owner.renderInfo()),
			      			thread.renderDirection()
		      			),
			      		React.createElement("td", null,
							React.createElement("a", { href: thread.lastPost.link }, thread.lastPost.text)
						),
			      		React.createElement("td", null,
							React.createElement("a", { href: thread.replies.link }, thread.replies.number)
						),
			      		React.createElement("td", null, thread.views )
		      		);
			    };
			    return React.createElement("tbody", null, this.props.rows.map(rowTemplate));
			}
		});

		var ThreadPreviewModal = React.createClass({ displayName: "ThreadPreview",
			render: function(){
				var modalTemplate = function(thread){
					return React.createElement("div", null,
						React.createElement("div", {className: "thread-title"}, thread.name),
						React.createElement("div", {className: "thread-content"}, self.state.threadContent)
					)
				};
				return React.createElement("div", null, modalTemplate(this.props.thread))
			}
		});

		var Threads = React.createClass({displayName: "Threads",
			reloadThread: function(){
				$.ajax({
					url: location.href,
					success: function(data) {
						var newThreads = self.getThreads(data);
						for(var i = 0; i < newThreads.length; i++){
							var oldIndex = this.findInOldThread(newThreads[i].id)
							if(oldIndex != null){
								if(i > oldIndex){
									newThreads[i].setLiving("down", i - oldIndex);
								}else if(i == oldIndex){
									newThreads[i].setLiving("same", 0);
								}else{
									newThreads[i].setLiving("up", oldIndex - i);
								}
							}else{
								newThreads[i].setLiving("new", 0);
							}
						}
				        this.setState({
				        	threads: newThreads
				        });
				        setTimeout(this.reloadThread, 15000);
			      	}.bind(this),
			      	error: function(){
			      		this.reloadThread();
			      	}.bind(this),
			      	timeout: 15000
				});
			},
			findInOldThread: function(threadId){
				for(var i = 0; i < this.state.threads.length; i++){
					if(threadId === this.state.threads[i].id){
						return i;
					}
				}
				return null;
			},
			getInitialState: function() {
			    return {
					threads: self.getThreads()
				}
		  	},
		  	componentDidMount: function(){
		  		this.reloadThread();
		  	},
			setThreadPreview: function(thread){
				this.setState({
					threadPreview: thread
				});
			},
		  	render: function() {
			    return React.createElement("div", { className: "threads-list" },
					React.createElement("table", {className: "table table-hover table-striped table-condensed"},
				    	React.createElement("thead", null,
				    		React.createElement("tr", null,
				    			React.createElement("th", null, "Thread"),
				    			React.createElement("th", null, "Last Post"),
				    			React.createElement("th", null, "Replies"),
				    			React.createElement("th", null, "Views")
			    			)
			    		),
			        	React.createElement(ThreadsList, {rows: this.state.threads, setThreadPreview: this.setThreadPreview})
					),
					React.createElement(ThreadPreviewModal, { thread: this.state.threadPreview })
				)
		  	}
		});

		React.render(React.createElement(Threads, null), document.getElementById("newthreadslist"));
	}

	threadsModule.prototype.init = function(){
		this.renderNewThreadsView();
	}

	return threadsModule;
})
