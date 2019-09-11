/* Documentation sample */

function updateDepth(book, newPage) {

	var page = book.turn('page'),
		pages = book.turn('pages'),
		depthWidth = 16*Math.min(1, page*2/pages);

		newPage = newPage || page;

	if (newPage>3)
		$('.book .p2 .depth').css({
			width: depthWidth,
			left: 20 - depthWidth
		});
	else
		$('.book .p2 .depth').css({width: 0});

		depthWidth = 16*Math.min(1, (pages-page)*2/pages);

	if (newPage<pages-3)
		$('.book .p111 .depth').css({
			width: depthWidth,
			right: 20 - depthWidth
		});
	else
		$('.book .p111 .depth').css({width: 0});

}

function loadPage(page) {

	var img = $('<img />');
	img.load(function() {
		var container = $('.book .p'+page);
		img.css({width: container.width(), height: container.height()});
		img.appendTo($('.book .p'+page));
		container.find('.loader').remove();
	});

	img.attr('src', 'media/pages/' +  (page-2) + '.png');

}

function addPage(page, book) {

	var id, pages = book.turn('pages');

	var element = $('<div />', {'class': 'own-size',
				css: {width: 460, height: 582}});

	if (book.turn('addPage', element, page)) {
		element.html('<div class="gradient"></div><div class="loader"></div>');
		loadPage(page);
	}
}

function updateTabs() {
	
	var tabs = {7: 'Clases', 12:'Constructor', 14:'Properties', 16:'Methods', 23:'Events'},
		left = [],
		right = [],
		book = $('.book'),
		actualPage = book.turn('page'),
		view = book.turn('view');

	for (var page in tabs) {
		var isHere = $.inArray(parseInt(page, 10), view)!=-1;

		if (page>actualPage && !isHere)
			right.push('<a href="#page/' + page + '">' + tabs[page] + '</a>');
		else if (isHere) {
			
			if (page%2===0)
				left.push('<a href="#page/' + page + '" class="on">' + tabs[page] + '</a>');
			else
				right.push('<a href="#page/' + page + '" class="on">' + tabs[page] + '</a>');
		} else
			left.push('<a href="#page/' + page + '">' + tabs[page] + '</a>');

	}

	$('.book .tabs .left').html(left.join(''));
	$('.book .tabs .right').html(right.join(''));

}


function numberOfViews(book) {
	return book.turn('pages') / 2 + 1;
}


function getViewNumber(book, page) {
	return parseInt((page || book.turn('page'))/2 + 1, 10);
}

function moveBar(yes) {
	if (Modernizr && Modernizr.csstransforms) {
		$('#slider .ui-slider-handle').css({zIndex: yes ? -1 : 10000});
	}
}

function setPreview(view) {

	var previewWidth = 115,
		previewHeight = 73,
		previewSrc = 'media/pics/preview.jpg',
		preview = $(_thumbPreview.children(':first')),
		numPages = (view==1 || view==$('#slider').slider('option', 'max')) ? 1 : 2,
		width = (numPages==1) ? previewWidth/2 : previewWidth;

	_thumbPreview.
		addClass('no-transition').
		css({width: width + 15,
			height: previewHeight + 15,
			top: -previewHeight - 30,
			left: ($($('#slider').children(':first')).width() - width - 15)/2
		});

	preview.css({
		width: width,
		height: previewHeight
	});

	if (preview.css('background-image')==='' ||
		preview.css('background-image')=='none') {

		preview.css({backgroundImage: 'url(' + previewSrc + ')'});

		setTimeout(function(){
			_thumbPreview.removeClass('no-transition');
		}, 0);

	}

	preview.css({backgroundPosition:
		'0px -'+((view-1)*previewHeight)+'px'
	});
}