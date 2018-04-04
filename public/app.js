// Grab the articles as a json
$.getJSON("/all", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p>" + data[i].title + "<br />" + data[i].link + "<button type='button' data-id='" + data[i]._id + "'class='save'>Save Article</button></p>");
    }
  });

$.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#myarticles").append("<p>" + data[i].title + "<br />" + data[i].link + "<button type='button' data-id='" + data[i]._id + "'class='delete'>Delete Article</button></p>");
    }
  });

$(document).on("click", ".save", function (){
    console.log("clicked");
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "GET",
        url: "/saved/" + thisId
      });
});

$(document).on("click", ".delete", function (){
    console.log("clicked");
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "GET",
        url: "/unsaved/" + thisId
      });
});