class SurveysView {
  constructor() {
    $('.delete-survey').on("click", this.deleteSurvey);
  }

  deleteSurvey(e) {
    e.preventDefault();

    if (!confirm("Are you sure to delete this survey?")) {
      return;
    }

    var id = $(e.currentTarget).data("id");
    $.ajax({
      url: "/surveys/" + id,
      method: "DELETE",
    }).done((resp) => {
      $("#survey-" + id).remove();
      $(".messages").append('<div class="notification is-primary"><button class="delete"></button> The survey was removed successully</div>');
    });
  }
}

class SurveyFormView {
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
