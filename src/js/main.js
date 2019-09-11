
function loadApp() {

  var flipbook = $('.book');

  // Check if the CSS was already loaded
  
  if (flipbook.width()==0 || flipbook.height()==0) {
    setTimeout(loadApp, 10);
    return;
  }

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

  flipbook.turn({
    elevation: 50,
    acceleration: false,
    gradients: true,
    autoCenter: true,
    duration: 1000,
    pages: 10,
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
          $('.book .p9').addClass('fixed');
      else
          $('.book .p9').removeClass('fixed');

      Hash.go('page/'+page).update();
     

    },

    turned: function(e, page, view) {

      var book = $(this);

      if (page==2 || page==3) {
          book.turn('peel', 'br');
        }

      updateDepth(book);

      book.turn('center');

    },

    end: function(e, pageObj) {
    
      var book = $(this);

      updateDepth(book);

    },

    missing: function (e, pages) {

      for (var i = 0; i < pages.length; i++)
        addPage(pages[i], $(this));

    }
  }
  });

  flipbook.addClass('animated');


  // Show canvas

  $('#canvas').css({visibility: ''});
}

// Hide canvas

$('#canvas').css({visibility: 'hidden'});

yepnope({
  test: Modernizr.csstransforms,
  yep: ['lib/turn.min.js', 'src/css/jquery.ui.css'],
  nope: ['lib/turn.html4.min.js'],
  both: ['src/css/docs.css', 'src/js/docs.js'],
  complete: loadApp
});
