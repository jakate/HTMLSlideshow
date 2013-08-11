/*! slideshow - v0.0.0 - 2013-08-11
* Copyright (c) 2013 ; Licensed  */
var Slideshow = {};

var log = function(message) { console.log(message); };


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


Slideshow.Slide = function() {

	var self         = this;

	var myElement    = null;

	var stepChildren = null;

	var steps        = null;
	var currentStep  = null;
	var animspeed    = 300;

	var codeBlock       = null;
	var codeBlockType   = null;
	var codeBlockTarget = null;

	this.init = function(element) {
		myElement = element;

		stepChildren = $(myElement).find('.step_children')[0];
		steps = $(stepChildren).children().length;

		codeBlock = $(myElement).find("*[data-styles='true']");
		if(codeBlock[0])
		{
			codeBlock       = $(codeBlock)[0];
			codeBlockType   = "style";
			codeBlockTarget = $(codeBlock).data('target');
			codeBlockTarget = $('#'+codeBlockTarget);

			$(codeBlock).keyup(function(e) { keyUp(e); });
		}
	};


	this.ready = function(){

		if(currentStep < steps)
		{
			$(stepChildren).find(' > *').each(function(index){
				if(index == currentStep) {
					$(this).animate({
						'opacity':'1'
					}, 500);
				}
			});

			currentStep = currentStep+1;

			return false;
		}

		return true;
	};


	this.scale = function(tow, toh) {
		$(myElement).css({
			'width': tow,
			'height': toh
		});

		var content = $(myElement).find('.slide_content');

		var mt = toh / 2 - $(content).height() / 2;
		var ml = tow / 2 - $(content).width() / 2;

		$(content).css({
			'margin-top': mt,
			'margin-left': ml
		});
	};


	this.enter = function(direction) {
		$(myElement).css({
			'display': 'block',
			'opacity': '0',
			'margin-left' : 400 * direction
		});

		$(myElement).animate({
			'opacity': 1,
			'margin-left': 0
		}, animspeed);

		// if slide has steps in it
		if(stepChildren)
		{
			currentStep = 0;

			$(stepChildren).children().each(function() {
				$(this).css({
					'opacity':'0.05'
				});
			});
		}

		$(myElement).removeClass('exit');
	};

	this.exit = function(direction, speed) {
		var exitSpeed = speed !== undefined ? speed : animspeed;

		$(myElement).addClass('exit');
		$(myElement).animate({
			'opacity': 0,
			'margin-left' : -400 * direction
		}, exitSpeed, function(){
			$(myElement).css({
				'display': 'none'
			});
		});
	};


	var keyUp = function(e) {

		if(codeBlockType === "style")
		{
			var data = $(codeBlock).text();
				data = data.replace(/(<([^>]+)>)/ig,"");
				data = data.split(';');

			for (var i = 0; i < data.length; i++) {
				var parts = data[i].split(':');

				if(parts[0] !== "" && parts[1] !== "")
				{
					log(parts[0] + "  " + parts[1]);
					$(codeBlockTarget).css(String(parts[0]),String(parts[1]));
				}
			}
		}
	};


};


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