window.onload = fetch;

function fetch() {
  document.body.classList.add("loading");
  var url = "http://api.ihackernews.com/page?format=jsonp&callback=onceFetched";
  var script = document.createElement("script");
  script.setAttribute("src", url);
  document.head.appendChild(script);
}

function onceFetched(data) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < data.items.length; i++) {
    var title = data.items[i].title;
    var url = data.items[i].url;
    var points = data.items[i].points + " points";
    var comments = data.items[i].commentCount + " comments";
    var when = data.items[i].postedAgo;
    var who = data.items[i].postedBy;
    var icon = "http://g.etfv.co/" + url;

    var a = document.createElement("a");
    a.href = url;
    a.target = "_";
    a.textContent = title;

    pointsSpan = document.createElement("span");
    pointsSpan.className = "points";
    pointsSpan.textContent = points;

    commentsSpan = document.createElement("span");
    commentsSpan.className = "comments";
    commentsSpan.textContent = comments;

    whenSpan = document.createElement("span");
    whenSpan.className = "when";
    whenSpan.textContent = when;

    whoSpan = document.createElement("span");
    whoSpan.className = "who";
    whoSpan.textContent = who;

    var img = document.createElement("img");
    img.src = icon;

    var div = document.createElement("div");
    div.className = "meta";
    div.appendChild(pointsSpan);
    div.appendChild(commentsSpan);
    div.appendChild(whenSpan);
    div.appendChild(whoSpan);

    var li = document.createElement("li");
    li.appendChild(img);
    li.appendChild(a);
    li.appendChild(div);

    fragment.appendChild(li);
  }
  var ul = document.querySelector("ul");
  ul.innerHTML = "";
  ul.appendChild(fragment);
  document.body.classList.remove("loading");
}


// Install app
if (navigator.mozApps) {
  var checkIfInstalled = navigator.mozApps.getSelf();
  checkIfInstalled.onsuccess = function () {
    if (checkIfInstalled.result) {
      // Already installed
    } else {
      var install = document.querySelector("#install"),
      manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
/*
To install a package instead, exchange the above line to this:
manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/package.manifest";
*/
      install.className = "show-install";
      install.onclick = function () {
        var installApp = navigator.mozApps.install(manifestURL);
/*
To install a package instead, exchange the above line to this:
var installApp = navigator.mozApps.installPackage(manifestURL);
*/
        installApp.onsuccess = function(data) {
          install.style.display = "none";
        };
        installApp.onerror = function() {
          alert("Install failed\n\n:" + installApp.error.name);
        };
      };
    }
  };
} else {
  console.log("Open Web Apps not supported");
}
