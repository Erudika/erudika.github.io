/* global Bloodhound */

(function ($) {
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

	$.ajaxSetup({headers: {'Authorization': 'Anonymous ' + APPID}});

	var blogposts = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		remote: {
			url: ENDPOINT + '/blogposts?limit=6&q=%QUERY',
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
		limit: 40,
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