var slideshow;

$(document).ready(function(){
	slideshow = new Slideshow.Main();
	slideshow.init();

	$('.toggle-animation').change(function() {

		var data = $(this).serialize();

		var anim_type = String(data.split('anim-style=')[1]);
		anim_type = anim_type.split('+');

		$('.slides').removeClass('cube');
		$('.slides').removeClass('invert');
		$('.slides').removeClass('swoop');

		for (var i = 0; i < anim_type.length; i++) {
			$('.slides').addClass(anim_type[i]);
		}
	});
});