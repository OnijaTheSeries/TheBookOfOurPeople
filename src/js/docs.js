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
		$('.book .p9 .depth').css({
			width: depthWidth,
			right: 20 - depthWidth
		});
	else
		$('.book .p9 .depth').css({width: 0});

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

	book.turn('addPage', element, page);
	if (page<9){
		element.html('<div class="loader"></div>');
		loadPage(page);
	}
	
}


function numberOfViews(book) {
	return book.turn('pages') / 2 + 1;
}


function getViewNumber(book, page) {
	return parseInt((page || book.turn('page'))/2 + 1, 10);
}