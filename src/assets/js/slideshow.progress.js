

Slideshow.Progress = function() {

	var self        = this;

	var progress    = null;
	var progressBar = null;

	this.init = function() {

		$('.slides').each(function() {
			createProgressBar($(this));
		});

	};

	this.update = function(current, max) {

		$(progressBar).width(current/max*100 + "%");

		var progressLabel = "<div class='progress_label'>" + (current+1) + ' / ' + (max+1) + "</div>";
		$(progressBar).html(progressLabel);

	};

	var createProgressBar = function(item) {

		var bar = "<div class='progress'><div class='progress_bar'></div></div>";
		$(item).append(bar);

		progress    = $('.progress');
		progressBar = $('.progress_bar');

	};

};