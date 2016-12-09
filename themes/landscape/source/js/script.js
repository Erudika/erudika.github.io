(function ($) {
	// Share
	$('body').on('click', function () {
		$('.article-share-box.on').removeClass('on');
	}).on('click', '.article-share-link', function (e) {
		e.stopPropagation();

		var $this = $(this),
				url = $this.attr('data-url'),
				encodedUrl = encodeURIComponent(url),
				id = 'article-share-box-' + $this.attr('data-id'),
				offset = $this.offset();

		if ($('#' + id).length) {
			var box = $('#' + id);

			if (box.hasClass('on')) {
				box.removeClass('on');
				return;
			}
		} else {
			var html = [
				'<div id="' + id + '" class="article-share-box">',
				'<input class="article-share-input" value="' + url + '">',
				'<div class="article-share-links">',
				'<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"></a>',
				'<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"></a>',
				'<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"></a>',
				'<a href="https://plus.google.com/share?url=' + encodedUrl + '" class="article-share-google" target="_blank" title="Google+"></a>',
				'</div>',
				'</div>'
			].join('');

			var box = $(html);

			$('body').append(box);
		}

		$('.article-share-box.on').hide();

		box.css({
			top: offset.top + 25,
			left: offset.left
		}).addClass('on');
	}).on('click', '.article-share-box', function (e) {
		e.stopPropagation();
	}).on('click', '.article-share-box-input', function () {
		$(this).select();
	}).on('click', '.article-share-box-link', function (e) {
		e.preventDefault();
		e.stopPropagation();

		window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
	});

	// Caption
	$('.article-entry').each(function (i) {
		$(this).find('img').each(function () {
			if ($(this).parent().hasClass('fancybox'))
				return;

			var alt = this.alt;

			if (alt)
				$(this).after('<span class="caption">' + alt + '</span>');

			$(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
		});

		$(this).find('.fancybox').each(function () {
			$(this).attr('rel', 'article' + i);
		});
	});

	if ($.fancybox) {
		$('.fancybox').fancybox();
	}

	////////////////////////////
	//	SEARCH BOX
	////////////////////////////

	var APPID = "app:albogdano";
	var ENDPOINT = "https://paraio.com/v1"; // OR "http://localhost:8080/v1"
	$.ajaxSetup({
		headers: {'Authorization': 'Anonymous ' + APPID}
	});

	var blogposts = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: ENDPOINT + '/blogposts?q=%QUERY',
			wildcard: '%QUERY',
			transform: function (res) {
				return res.items || [];
			}
		}
	});

	$('#search-box').typeahead({
		hint: false,
		highlight: true,
		minLength: 3
	},
	{
		name: 'blogposts',
		source: blogposts,
		templates: {
			notFound: '<i>No results.</i>'
		},
		display: function (result) {
			return result.name;
		}
	});

	$('#search-box').bind('typeahead:select', function (ev, result) {
		window.location = result.url || '';
	});

})(jQuery);