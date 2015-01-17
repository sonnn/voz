define(function(){
	var user

	user = function(dataUser){
		this.username = "";
		this.id = "";

		if(dataUser){
			this.username = dataUser.username;
			this.id = dataUser.id;
		}
	}

	user.prototype.renderInfo = function(){
		return React.createElement("a", {"href": "/member.php?u=" + this.id }, this.username );
	}

	return user;
})