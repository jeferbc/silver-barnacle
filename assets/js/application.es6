//= require_tree .

const growl = (type, message) => {
  const types = {
    success: "is-success",
    info: "is-info",
    error: "is-danger"
  }
  $(`<div class="notification ${types[type]}"><button class="delete"></button> ${message}</div>`)
    .appendTo(".messages")
    .delay(5000)
    .fadeOut();
  $(".messages").append();
}

$(() => {
  $(".messages").on("click", ".notification .delete", (e) => {
    e.preventDefault();
    $(".messages").empty();
  });
});
