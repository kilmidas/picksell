// cineplex_main.html > sort by 셀렉트 박스
$(document).ready(function () {
var selectTarget = $('.select_wrap select');
selectTarget.on('blur', function () {
    $(this).parent().removeClass('focus');
});
selectTarget.change(function () {
    var select_name = $(this).children('option:selected').text();
    $(this).siblings('label').text(select_name);
});
// cineplex_cinema.html > bookmark 표시
$('.cinema .bookmark .link').on('click', function(e){
	e.preventDefault();
	$(this).toggleClass('on');
});
// cineplex_cinema.html > 아코디언 메뉴
$('.cinema .cinema_system .link.cinema').on('click', function(e){
	e.preventDefault();
	if($(this).hasClass('on')){
		$(this).removeClass('on');
		$(this).next().hide();
		$(this).next().next().hide();
	}else {
		$(this).addClass('on');
		$(this).next().show();
		$(this).next().next().show();
	};
});
$('.movie_details .more_wrap .link').on('click', function(e){
	e.preventDefault();
	$('.movie_details .detail_info_wrap .exp.synopsis').toggleClass('open');
	if($(this).hasClass('more')){
		$(this).hide();
		$('.movie_details .more_wrap .link.close').show();
	}else {
		$(this).hide();
		$('.movie_details .more_wrap .link.more').show();
	};
});
$('.movie_details .layer_pop_wrap .link.close').on('click', function(e){
	e.preventDefault();
	$('.movie_details .layer_pop_wrap').hide();
});
$('.myticket .ticket_list_wrap .link').on('click', function(e){
	e.preventDefault();
	$('.myticket .layer_pop_wrap').show();
});
$('.myticket .layer_pop_wrap .link.close').on('click', function(e){
	e.preventDefault();
	$('.myticket .layer_pop_wrap').hide();
});
});
