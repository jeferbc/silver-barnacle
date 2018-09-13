//= require_tree .

$(() => {
  $(".messages").on("click", ".notification .delete", (e) => {
    e.preventDefault();
    $(".messages").empty();
  });
});
