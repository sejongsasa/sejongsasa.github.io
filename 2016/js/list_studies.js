var study_index = [],
  locPoints;
window.onload = function() {
  $.getJSON("data/study_index.json", function(data) {
    study_index = data;
    $.getJSON("data/points.json", function(data2) {
      locPoints = data2;
      $('#studies-main').html("");
      for (var key in study_index) {
        var author = "",
          locations = "";
        for (var ind in study_index[key].loc)
          locations += (locPoints[study_index[key].loc[ind] - 1].name + ", ");
        for (var ind in study_index[key].author)
          author += (study_index[key].author[ind] + ", ");
        $('#main-table-body').append("<tr><td>" + key + "</td><td><a href=\"detail.html?id=" + key + "\">" + study_index[key].title + "</a></td><td>" + author.substring(0, author.length - 2) + "</td><td>" + locations.substring(0, locations.length - 2) + "</td></tr>");
      }
    });
  });
};
