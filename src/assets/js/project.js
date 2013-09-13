var slideshow;

$(document).ready(function(){
	slideshow = new Slideshow.Main();
	slideshow.init();

	$('.toggle-animation').click(function(e){
		e.preventDefault();

		var isInvert = $('.slides');

		if($('.slides').hasClass('invert') === true) {
			$('.slides').removeClass('invert');
		} else {
			$('.slides').addClass('invert');
		}
	});

});