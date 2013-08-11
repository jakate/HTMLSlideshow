

Slideshow.SlideController = function() {

	var self          = this;

	var windowWidth   = 0;
	var windowHeight  = 0;

	var currentSlide  = 0;

	var slides        = [];


	var slideshow     = null;

	this.init = function(parent) {

		slideshow = parent;

		var slideElements = $('.slide', 'body');

		for (var i = 0; i < slideElements.length; i++) {
			var slide = new Slideshow.Slide();
			slide.init(slideElements[i]);
			slides.push(slide);
			slide.exit(0, 0);
		}

		resize();

		$(window).on('hashchange', function() { changeSlide(); });
		$(window).keyup(function(e) { keyUp(e); });
		$(window).resize(function() { resize(); });

		hideAll();

		setTimeout(startShow, 500);
	};

	var startShow = function() {
		if(!window.location.hash) {
			updateHash(currentSlide);
		} else {
			changeSlide();
		}
	};


	var scaleSlide = function(item) {
		slides[currentSlide].scale(windowWidth, windowHeight);
	};


	var scaleCurrentSlide = function() {
		scaleSlide(slides[currentSlide]);
	};


	var navigateTo = function(index) {
		index = Number(index);

		var oldSlide  = currentSlide;
		currentSlide  = index;

		var direction = currentSlide-oldSlide;

		if(oldSlide === currentSlide) oldSlide = null;

		if(slides[oldSlide]) slides[oldSlide].exit(direction);
		if(slides[currentSlide]) slides[currentSlide].enter(direction);

		scaleCurrentSlide();

		slideshow.updateProgress(currentSlide, slides.length-1);
	};


	var changeSlide = function() {

		// minus one, becouse we dont't like #0 in the url,
		// so the passed value is "wrong"
		var to = Number(window.location.hash.split('#').join('')) - 1;
		navigateTo(to);
	};


	var nextSlide = function() {
		if(slides[currentSlide].ready())
		{
			var nextSlide = currentSlide+1;

			if(nextSlide < slides.length) {
				updateHash(nextSlide);
			}
		}
	};


	var prevSlide = function() {
		var prevSlide = currentSlide-1;

		if(prevSlide > -1) {
			updateHash(prevSlide);
		}
	};


	var updateHash = function(to) {
		// plus one, becouse we dont't like #0 in the url
		window.location.hash = Number(to) + 1;
	};


	var hideAll = function() {
		for (var i = 0; i < slides.length; i++) {
			slides[i].exit();
		}
	};


	/*   Events    */

	var resize = function() {
		windowWidth = $(window).width();
		windowHeight = $(window).height();
		scaleCurrentSlide();
	};

	var keyUp = function(e) {
		//log("press: " + e.keyCode);

		if($('body').find('*:focus')[0]) return;

		var pressed = e.keyCode;
		switch(pressed){
			case 39 :
				nextSlide();
			break;
			case 37 :
				prevSlide();
			break;
		}
	};


};