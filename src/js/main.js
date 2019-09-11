
function loadApp() {

  var flipbook = $('.book');

  // Check if the CSS was already loaded
  
  if (flipbook.width()==0 || flipbook.height()==0) {
    setTimeout(loadApp, 10);
    return;
  }

  // Mousewheel

  $('#book-zoom').mousewheel(function(event, delta, deltaX, deltaY) {

    var data = $(this).data(),
      step = 30,
      flipbook = $('.book'),
      actualPos = $('#slider').slider('value')*step;

    if (typeof(data.scrollX)==='undefined') {
      data.scrollX = actualPos;
      data.scrollPage = flipbook.turn('page');
    }

    data.scrollX = Math.min($( "#slider" ).slider('option', 'max')*step,
      Math.max(0, data.scrollX + deltaX));

    var actualView = Math.round(data.scrollX/step),
      page = Math.min(flipbook.turn('pages'), Math.max(1, actualView*2 - 2));

    if ($.inArray(data.scrollPage, flipbook.turn('view', page))==-1) {
      data.scrollPage = page;
      flipbook.turn('page', page);
    }

    if (data.scrollTimer)
      clearInterval(data.scrollTimer);
    
    data.scrollTimer = setTimeout(function(){
      data.scrollX = undefined;
      data.scrollPage = undefined;
      data.scrollTimer = undefined;
    }, 1000);

  });

  // Slider

  $( "#slider" ).slider({
    min: 1,
    max: 100,

    start: function(event, ui) {
      if (!window._thumbPreview) {
        _thumbPreview = $('<div />', {'class': 'thumbnail'}).html('<div></div>');
        setPreview(ui.value);
        _thumbPreview.appendTo($(ui.handle));
      } else
        setPreview(ui.value);

      moveBar(false);
    },

    slide: function(event, ui) {
      setPreview(ui.value);
    },

    stop: function() {
      if (window._thumbPreview)
        _thumbPreview.removeClass('show');
      
      $('.book').turn('page', Math.max(1, $(this).slider('value')*2 - 2));
    }
  });


  // URIs
  
  Hash.on('^page\/([0-9]*)$', {
    yep: function(path, parts) {
      var page = parts[1];

      if (page!==undefined) {
        if ($('.book').turn('is'))
          $('.book').turn('page', page);
      }

    },
    nop: function(path) {

      if ($('.book').turn('is'))
        $('.book').turn('page', 1);
    }
  });

  // Arrows

  $(document).keydown(function(e){

    var previous = 37, next = 39;

    switch (e.keyCode) {
      case previous:

        $('.book').turn('previous');

      break;
      case next:
        
        $('.book').turn('next');

      break;
    }

  });

  // Create the flipbook

  flipbook.bind(($.isTouch) ? 'touchend' : 'click', zoomHandle);

  flipbook.turn({
    elevation: 50,
    acceleration: false,
    gradients: true,
    autoCenter: true,
    duration: 1000,
    pages: 112,
    when: {

    turning: function(e, page, view) {
      
      var book = $(this),
      currentPage = book.turn('page'),
      pages = book.turn('pages');
        
      if (currentPage>3 && currentPage<pages-3) {
        if (page==1) {
          book.turn('page', 2).turn('stop').turn('page', page);
          e.preventDefault();
          return;
        } else if (page==pages) {
          book.turn('page', pages-1).turn('stop').turn('page', page);
          e.preventDefault();
          return;
        }
      } else if (page>3 && page<pages-3) {
        if (currentPage==1) {
          book.turn('page', 2).turn('stop').turn('page', page);
          e.preventDefault();
          return;
        } else if (currentPage==pages) {
          book.turn('page', pages-1).turn('stop').turn('page', page);
          e.preventDefault();
          return;
        }
      }

      updateDepth(book, page);

      if (page>=2)
          $('.book .p2').addClass('fixed');
      else
          $('.book .p2').removeClass('fixed');

      if (page<book.turn('pages'))
          $('.book .p111').addClass('fixed');
      else
          $('.book .p111').removeClass('fixed');

      Hash.go('page/'+page).update();

      if (page==1 || page==pages)
        $('.book .tabs').hide();
      

    },

    turned: function(e, page, view) {

      var book = $(this);

      $('#slider').slider('value', getViewNumber(book, page));

      if (page!=1 && page!=book.turn('pages'))
        $('.book .tabs').fadeIn(500);
      else
        $('.book .tabs').hide();

      updateDepth(book);

      book.turn('center');
      updateTabs();

    },

    start: function(e, pageObj) {
  
      moveBar(true);

    },

    end: function(e, pageObj) {
    
      var book = $(this);

      updateDepth(book);

      setTimeout(function() {
        $('#slider').slider('value', getViewNumber(book));
      }, 1);

      moveBar(false);

    },

    missing: function (e, pages) {

      for (var i = 0; i < pages.length; i++)
        addPage(pages[i], $(this));

    }
  }
  }). turn('page', 2);


  $('#slider').slider('option', 'max', numberOfViews(flipbook));

  flipbook.addClass('animated');


  // Show canvas

  $('#canvas').css({visibility: 'visible'});
}

// Hide canvas

$('#canvas').css({visibility: 'hidden'});

yepnope({
  test: Modernizr.csstransforms,
  yep: ['lib/turn.min.js'],
  nope: ['lib/turn.html4.min.js', 'src/css/jquery.ui.html4.css'],
  both: ['src/css/docs.css', 'src/js/docs.js', 'src/css/jquery.ui.css'],
  complete: loadApp
});
