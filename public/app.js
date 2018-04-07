// Grab the articles as a json
$.getJSON("/all", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p>" + data[i].title + "<br /><button type='button' data-id='" + data[i]._id + "'class='save btn btn-success'>Save Article</button><a href='"+ data[i].link +"' class='btn btn-primary'>Go To Article</button></p>");
    }
  });

$.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#myarticles").append("<p>" + data[i].title + "<br /><button type='button' data-id='" + data[i]._id + "'class='delete btn btn-danger'>Delete Article</button><a href='"+ data[i].link +"' class='btn btn-primary'>Go To Article</a><button type='button' data-title='"+ data[i].title +"'data-id='" + data[i]._id + "'id='note' class='btn btn-info'>Post Notes</button></p>");
    }
  });

$(document).on("click", ".save", function (){
    console.log("clicked");
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "PUT",
        url: "/saved/" + thisId
      });
    location.reload();
});

$(document).on("click", ".delete", function (){
    console.log("clicked");
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "PUT",
        url: "/unsaved/" + thisId
      });
    location.reload();
});

$(document).on("click", ".scrape", function (){
  console.log("clicked");
  $.ajax({
    type: "DELETE",
    url: "/clear"
  });
  $.ajax({
      type: "GET",
      url: "/scrape"
    });
  location.reload();
});

// Whenever someone clicks the note button
$(document).on("click", "#note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the note button
  var thisId = $(this).attr("data-id");
  console.log(this);
  console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/saved/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data[0].title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data[0]._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });
  });