

Slideshow.Main = function() {

	var self            = this;
	var slideController = null;

	var progress        = null;

	this.init = function() {
		progress = new Slideshow.Progress();
		progress.init();

		slideController = new Slideshow.SlideController();
		slideController.init(this);
	};


	this.updateProgress = function(currentSlide, slideElements) {
		progress.update(currentSlide, slideElements);
	};
};
