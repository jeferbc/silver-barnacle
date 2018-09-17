class PollsView {
  constructor() {
    $('.delete-poll').on("click", this.deletePoll);
  }

  deletePoll(e) {
    e.preventDefault();

    if (!confirm("Are you sure to delete this poll?")) {
      return;
    }

    var id = $(e.currentTarget).data("id");
    $.ajax({
      url: "/polls/" + id,
      method: "DELETE",
    }).done((resp) => {
      $("#poll-" + id).remove();
      growl("success", "The poll was removed successully");
    });
  }
}

class PollFormView {
  constructor() {
    $('.add-option').on("click", this.addOption);
    $('form').on("click", ".remove-option", this.removeOption);
  }

  addOption(e) {
    e.preventDefault();

    $(".field-with-icon a").remove();
    $(".field-with-icon").removeClass("field-with-icon");

    var index = $(".options .field").length;
    $(".options").append('<div class="field field-with-icon"><input type="text" name="options[' + index + '][text]" class="input" placeholder="Option ' + (index + 1) + '"><a href="#" class="remove-option"><i class="far fa-trash-alt"></i></a></div>');
  }

  removeOption(e) {
    e.preventDefault();

    $(e.currentTarget).parents(".field").remove();
    if ($(".options .field").length > 2) {
      $(".options .field").last().addClass("field-with-icon").append('<a href="#" class="remove-option"><i class="far fa-trash-alt"></i></a>');
    }
  }
}
