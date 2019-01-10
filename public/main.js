$(function() { 
  // Initialize variables
  var $window = $(window);
  var $button = $('button');
  var $searchField = $('input');
  var $searchButton = $("#search");
  var $searchRes = $("#searchRes");
  var $favList = $("#favList");
  var $favItems = $("#favItems");
  var $title = $(".title");
  var $mainPage = $('.main');
  var reposjson;
  var enterKey = jQuery.Event("keydown");
  //enterKey.which = 13; //Enter key

  $mainPage.show();
  $searchField.focus();

  function main(){ 
	  $("#searchRes > div").remove();
	  $.when(
	    $.getJSON("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000", function(json) {
		data = json.filter( obj => obj.keywords.toString().includes($searchField.val()) );
	    })  
	  ).then(function() {
		    if (data) {
			  for (i = 0; i < data.length; i++) {
				$searchRes.append("<div class=grid >" +
							"<div class=title><i class=addFav ></i> " + data[i].title + "</div>" +
							"<div class=desc>" + decodeEntities(data[i].body) + "</div>" + 
							"</div>");
				$('.title i').addClass('fas fa-star');
			  }
				$(".addFav").click(function(){	
					if($(this).parent().parent().parent().attr('id') === 'searchRes'){		    
						$favItems.append($(this).parent().parent().clone(true, true));
						$(this).css('color','green');
						$("#favList #favItems i").css('color','green');
	    					$("#favItems > div").removeDuplicates();
					}

					else if($(this).parent().parent().parent().attr('id') === 'favItems'){
						$(this).parent().parent().remove();
					}
				});

		    }
		    else {
			console.log("Error JSON file not found");
		    }
	    
	   });
  }

  //Check if input field is empty
  $searchField.keyup(function(){
	if (!$searchField.val()){
		$("#searchRes > div").remove();
	}
  });

  //Search functions, click button or press enter to refresh search
  $searchButton.click(main);
  $searchField.keypress(function (key) {
	if (key.which == 13) {
		main();  
  	}
  });

  var decodeEntities = (function() {
	  // this prevents any overhead from creating the object each time
	  var element = document.createElement('div');

	  function decodeHTMLEntities (str) {
		if(str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = '';
		}

		return str;
	  }

	  return decodeHTMLEntities;
  })();
});

(function($) {
  
  $.fn.removeDuplicates = function() {
    var $original = $([]);
    
    this.each(function(i, el) {
      var $el = $(el),
          isDuplicate;
      
      $original.each(function(i, orig) {
        if (el.isEqualNode(orig)) {
          isDuplicate = true;
          $el.remove();
        }
      });
      
      if (!isDuplicate) {
        $original = $original.add($el);
      }
    });
    
    return $original;
  };
}(jQuery));
