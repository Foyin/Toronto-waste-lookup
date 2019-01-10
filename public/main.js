$(function() { 
  
  // Initialize variables
  var $window = $(window);
  var $button = $('button');
  var $searchField = $('input');
  var $searchButton = $("#search");
  var $searchRes = $("#searchRes");
  var $favList = $("#favList");
  var $favItem = $("#favItem");
  var $title = $(".title");
  var $mainPage = $('.main.page');
  var reposjson;
  var enterKey = jQuery.Event("keydown");
  //enterKey.which = 13; //Enter key

  $mainPage.show();
  $searchField.focus();
  
  //Check if input field is empty every second
  $searchField.keyup(function(){
	if (!$searchField.val()){
		$("#searchRes > div").remove();
	}
  });

  function main(){ 
	  $("#searchRes > div").remove();
	  var numEntries = 10;
	  $.when(
	    $.getJSON("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000", function(json) {
		data = json.filter( obj => obj.keywords.toString().includes($searchField.val()) );
	    })  
	  ).then(function() {
	    if (data) {
		  for (i = 0; i < data.length; i++) {
			$searchRes.append("<div class=grid >" +
						"<div class=title><i class=addFav ></i> " + data[i].title + "</div>" +
						"<div class=desc>" + data[i].body + "</div>" + 
						"</div>");
			$('.title i').addClass('fas fa-star');
		  }
			$(".addFav").click(function(){	
				if($(this).parent().parent().parent().attr('id') === 'searchRes'){		    
					$favItem.append($(this).parent().parent().clone(true, true));
					$(this).css('color','green');
					$("#favList #favItem i").css('color','green');
    		$("#favItem > div").removeDuplicates();
				}

				else if($(this).parent().parent().parent().attr('id') === 'favItem'){
					$(this).parent().parent().remove();
					//$("#searchRes > #" + $(this).attr('id') + " .favItem").css('color','grey');
					//$("#searchRes > #" + $(this).attr('id') + " i").click(function(){$(this).css('color','grey');});
				}
			});

	    }
	    else {
		console.log("Error JSON file not found");
	    }
	    
	   });
  }

  //Search button functions, click anytime to refresh search
  $searchButton.click(main);
  $searchField.keypress(function (key) {
	if (key.which == 13) {
		main();  
  	}
  });
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
