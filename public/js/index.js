$(function() {
    $('#hamburger-menu').click(function(){
        if(!$('.nav-wrapper').hasClass('open')){
          $('#hamburger-menu').addClass('open');
          $('.nav-wrapper').addClass('open');
        } else {
          $('#hamburger-menu').removeClass('open');
          $('.nav-wrapper').removeClass('open');
        }
      });
    $('body').on('click','#typeInput', function(){
        if($('#typeInput').children("option:selected").val() =='film'){
            $('#poetryContentInput').prop('disabled', true);
            $("[id^=film]").each(function() {
              $(this).prop('disabled', false);
            });
        } else {
            $("[id^=film]").each(function() {
              $(this).prop('disabled', true);
              $('#poetryContentInput').prop('disabled', false);
            });
        }
    });
    var padding = $('.side-padding').css('padding-left').replace('px', '');
    $('#videoEmbedded').css('width',$(window).width()-padding*2+'px');
    $('#videoEmbedded').css('height',$(window).width()*9/16+'px');
});