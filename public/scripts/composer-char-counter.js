$(() => {

  $('textarea').on('input', function() {
    const charLength = 140 - $(this).val().length;
    const $counter = $(this).siblings().children('.counter');

    if (charLength < 0) {
      $counter.addClass("red");
    } else {
      $counter.removeClass("red");
    }

    $counter.val(charLength);
  });

});