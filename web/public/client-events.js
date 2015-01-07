$(function() {
  $('input').on('submit', function(event) {
    event.preventDefault();
    var submission = $(this).val();
    $(this).val('');
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8080/",
      data: submission
    });
  });
});
