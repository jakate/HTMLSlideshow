

Slideshow.SlideController = function() {

	var self          = this;

	var windowWidth   = 0;
	var windowHeight  = 0;

	var currentSlide  = 0;

	var slides        = [];
	var slidesElement = [];


	var slideshow     = null;

	this.init = function(parent) {

		slideshow = parent;

		slidesElement = $('.slides');

		var slideElements = $('.slide', 'body');

		var tmpCurrentSlide = Number(window.location.hash.split('#').join('')) -1;

		for (var i = 0; i < slideElements.length; i++) {
			var slide = new Slideshow.Slide();
				slide.init(slideElements[i]);
				$(slideElements[i]).css('visibility','hidden');
				slide.exit(tmpCurrentSlide-i, 0);
			slides.push(slide);
		}

		$(window).on('hashchange', function() { changeSlide(); });
		$(window).keyup(function(e) { keyUp(e); });
		$(window).resize(function() { resize(); });

		setTimeout(resize, 100);
		setTimeout(startShow, 200);
	};

	var startShow = function() {
		if(!window.location.hash) {
			updateHash(currentSlide);
		} else {
			changeSlide();
		}

		for (var i = 0; i < slides.length; i++) {
			slides[i].scale(windowWidth, windowHeight);
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

	var zoomOut = function() {

		var ML = 0;
		if($(slidesElement).hasClass('zoom-out'))
		{
			$(slidesElement).removeClass('zoom-out');

			$(slidesElement).find('.slide').each(function(){
				$(this).css({
					'margin-left': 0
				});
			});
		}
		else
		{
			$(slidesElement).addClass('zoom-out');

			$(slidesElement).find('.slide').each(function(index){
				$(this).css({
					'margin-left': ML
				});

				ML+= $(this).width();

				/*if(currentSlide == index)
				{
					//$(slidesElement).css('margin-left', ML * 0.2);
					$(slidesElement).css('margin-left', ML*-1 / 2);
					$(slidesElement).css('overflow', 'visible');
					$(slidesElement).css('width', '100%');
					$(slidesElement).css('position', 'relative');
				}*/
			});
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

		//log("pressed: " + pressed);

		switch(pressed){
			case 81 :
				zoomOut();
			break;
			case 39 :
				nextSlide();
			break;
			case 37 :
				prevSlide();
			break;
		}
	};


};