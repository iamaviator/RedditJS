define(['underscore', 'backbone', 'jquery', 'moment'], function(_, Backbone, $) {
	var Sidebar = Backbone.Model.extend({
		initialize: function(data) {
			if (data === null) {
				this.subName = 'front'
			} else {
				this.subName = data
			}
		},

		url: function() {
			var username = $.cookie('username')
			if (typeof username !== "undefined") {
				if (this.subName == "front") {

					return 'http://api.reddit.com/.json?jsonp=?';
				} else {
					return "/api/?url=r/" + this.subName + "/about.json&cookie=" + $.cookie('reddit_session');
				}
			} else {

				if (this.subName == "front") {
					return 'http://api.reddit.com/.json?jsonp=?';
				} else {
					return "http://api.reddit.com/r/" + this.subName + "/about.json?jsonp=?"
				}
			}
		},

		// Default attributes 
		defaults: {
			display_name: '',
			description_html: '',
			header_img: "img/logo.png",
			rname: '',
			public_description: ''
		},
		//so we have the attributes in the root of the model
		parse: function(response) {
			data = response.data
			var timeAgo = moment.unix(data.created).fromNow(true) //"true" removes the "ago"
			timeAgo = timeAgo.replace("in ", ''); //why would it add the word "in"
			data.timeAgo = timeAgo
			data.timeUgly = moment.unix(data.created).format()
			data.timePretty = moment.unix(data.created).format("ddd MMM DD HH:mm:ss YYYY") + " UTC" //format Sun Aug 18 12:51:06 2013 UTC
			data.rname = "/r/" + data.display_name
			data.accounts_active = this.numberWithCommas(data.accounts_active)
			data.subscribers = this.numberWithCommas(data.subscribers)
			//data.description = markdown.toHTML(data.description)
			data.description_html = (typeof data.description_html === 'undefined') ? '' : $('<div/>').html(data.description_html).text();
			//data.description_html = data.description_html.replace("reddit.com","redditjs.com")
			//localStorage[this.subName] = JSON.stringify(data)
			return data;

		},

		numberWithCommas: function(x) {
			return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
		},

		parseSidebar: function() {
			var sidebarHtml = this.get('description_html');
			sidebarHtml = (typeof sidebarHtml === 'undefined') ? '' : $('<div/>').html(sidebarHtml).text();
			this.set('description_html', sidebarHtml)
		}

	});
	return Sidebar;
});