

Slideshow.Slide = function() {

	var self         = this;

	var myElement    = null;

	var stepChildren = null;

	var steps        = null;
	var currentStep  = null;
	var animspeed    = 500;
	var marginAmount = 0;

	var codeBlock       = null;
	var codeBlockType   = null;
	var codeBlockTarget = null;

	this.init = function(element) {
		myElement = element;

		marginAmount = $(element).width()/2;

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
			'margin-left' : marginAmount * direction
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
		$(myElement).removeClass('right');
		$(myElement).removeClass('left');
	};

	this.exit = function(direction, speed) {
		var exitSpeed = speed !== undefined ? speed : animspeed;
		var exitDir = direction < 0 ? 'left' : 'right';

		$(myElement).addClass('exit');
		$(myElement).addClass(exitDir);
		$(myElement).animate({
			'opacity': 0,
			'margin-left' : (marginAmount*-1) * direction
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

			$(codeBlockTarget).attr('style', data);
		}
	};


};