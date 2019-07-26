$(function () {
    $(".save-button").on("click", function (event) {
        var id = $(this).data("id");
        var saveCondition = $(this).data("saved");

        var newSavedState = {
            saved: !saveCondition
        };

        $.post("/api/saveBook/" + id, newSavedState);
        $(this).parents(".col-sm-3").remove();
    });


    $(".note-button").on("click", function (event) {
        var id = $(this).data("id");
        $("#add-note-button").data("id", id);
        getNotes(id);
        $("#notesModal").modal("show");
    });



    $("#add-note-button").on("click", function (event) {
        var id = $(this).data("id");
        var note = $("#note-input").val();

        if (note.length === 0)
            return;

        $.post("/api/addNote/" + id, {
            note: note
        });

        $("#note-input").val("");
        $("#notesModal").modal("hide");
    })
});

function getNotes(id) {
    $.get("/api/notes/" + id).then(function (data) {
        $("#note-list").empty();

        data.forEach(element => {
            var div = $("<div>");
            var deleteButton = $("<button>").addClass("btn btn-danger btn-sm").html("&times; delete");
            deleteButton.on("click", function () {
                $.post("/api/deleteNote/" + element._id);
                $(div).remove();
            });
            div.append($("<p>").text(element.body + " ").append(deleteButton));
            $("#note-list").append(div);
        });

    });
}