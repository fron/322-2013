$(document).ready(function() {
    	 
(function($){
   function prefix(el){

  // function prefix checks type of CSS3 transitions available to handle 
  // it receives as a parameter any raw DOM element 
  // then the animateSlides() function will conditionally select the animation method.
  
	     var prefixes = ["Webkit", "Moz", "O", "ms"];
		 for (var i = 0; i < prefixes.length; i++){
		    if (prefixes[i] + "Transition" in el.style){
				
			    return '-'+prefixes[i].toLowerCase()+'-'; 
			};
		}; 
		
		return "transition" in el.style ? "" : false;  
	};
	
	var methods = {
		init: function(settings){
			return this.each(function(){
				var config = {
					slideDur: 7000,          // time to show the pic: 7 seconds
					fadeDur: 800            // time to fade 800 ms
				};
				
				if(settings){
					$.extend(config, settings);
				};
				
				this.config = config;
				var $container = $(this),
			 	slideSelector = '.slide',
				fading = false,
				         slideTimer,
				         activeSlide,
				         newSlide,
						 $slides = $container.find(slideSelector),
				         totalSlides = $slides.length,
				         $pagerList = $container.find('.pager_list');
				         prefix = prefix($container[0]);
				
				
				
				function animateSlides(activeNdx, newNdx){           
					function cleanUp(){
						$slides.eq(activeNdx).removeAttr('style');     // remove styles for current pic
						activeSlide = newNdx;                          // new pic becomes active pic 
						fading = false;
						waitForNext();                                 // get the time to display and waits for the next pic
				    };
					
					if(fading || activeNdx == newNdx){
						return false;
					};
					
					fading = true;
					$pagers.removeClass('active').eq(newSlide).addClass('active');
					$slides.eq(activeNdx).css('z-index', 3);                             // Move the active slide up to z-index 3
					$slides.eq(newNdx).css({
						'z-index': 2,                                                     // Move the new slide to just below it at z-index 2 and
						'opacity': 1                                                      // show the picture by opacity => 1 
					});
					
				
				if(!prefix){    // if no transition support, use jQuery
						$slides.eq(activeNdx).animate({'opacity': 0}, config.fadeDur,        // fade out the current pic to reveal new pic
						function(){
							cleanUp();
						});
						} else {
							
					    //use CSS3, since we can’t use variables as property names,
                        // an object containing the styles must be built,
                        // then apply the desired properties to it.
						
						var styles = {};
						styles[prefix+'transition'] = 'opacity '+config.fadeDur+'ms';
						styles['opacity'] = 0;
						$slides.eq(activeNdx).css(styles);
						var fadeTimer = setTimeout(function(){
							cleanUp();
						},config.fadeDur);
					};
					
				};
				
			 
				//  moving trough the pictures using the arrows 
                 function changeSlides(target){
					
					if(target == 'next'){
						 
						newSlide = activeSlide + 1;
					
						if(newSlide > totalSlides - 1){
							newSlide = 0;                 // if end of list is reached we return to index 0 to show first pic  
						}
					} else if(target == 'prev'){
						newSlide = activeSlide - 1;
						if(newSlide < 0){
							newSlide = totalSlides - 1;     //loop back to the last pic because we just showed the first one  
						};
					} else {
						newSlide = target;                  // specific pic selected by the user 
					};
					animateSlides(activeSlide, newSlide);           // if user clicks on a specific pic then target is used  
				};
				
				// pictures will slide automatically when user don't interact  
				
				function waitForNext(){
					slideTimer = setTimeout(function(){
						changeSlides('next');
					},config.slideDur);
				};
				
				
				for(var i = 0; i < totalSlides; i++){
			        // generates the list for class pager_list     
				    $pagerList.append('<li class="page" data-target="'+i+'">'+i+'</li>' );
				};
				$container.find('.page').bind('click',function(){      // to locate an specific picture  
					var target = $(this).attr('data-target');
					clearTimeout(slideTimer);
					changeSlides(target);
				});
				
				var $pagers = $pagerList.find('.page');
				$slides.eq(0).css('opacity', 1);           // show first picture, first (by default it would've shown the last one   
				$pagers.eq(0).addClass('active');
				activeSlide = 0;
				waitForNext();
			});
		}
	};
	$.fn.easyFader = function(settings){
		  return methods.init.apply(this, arguments);
	};
})(jQuery);


// transition for the pics container
$(function(){
 $('#Fader').easyFader({
   slideDur: 6000,
   fadeDur: 800
 });
});

  });