window.addEventListener("load", function onLoad() {
  window.removeEventListener("load", onLoad, true);
  var button = document.querySelector("#reload");
  button.onclick = fetch;
}, true);

function fetch() {
  document.body.classList.add("loading");
  var ul = document.querySelector("ul");
  ul.innerHTML = "loading";
  var url = "http://hnify.herokuapp.com/get/top";
  var xhr = new XMLHttpRequest({mozSystem:true});
  xhr.addEventListener("load", onceFetched, true);
  xhr.addEventListener("error", onError, true);
  xhr.open("get", url, true);
  xhr.send();
}

function onError(e) {
  console.log("onError");
  console.log(e);
  var ul = document.querySelector("ul");
  ul.innerHTML = "";
  ul.textContent = "error: " + e;
  document.body.classList.remove("loading");
}

function onceFetched(event) {
  console.log("onceFetched");
  console.log(event);

  try {
    var data = JSON.parse(event.target.responseText);
  } catch(e) {
    onError(e);
    return;
  }

  var ul = document.querySelector("ul");
  ul.innerHTML = "";

  var fragment = document.createDocumentFragment();

  for (var i = 0; i < data.stories.length; i++) {
    var title = data.stories[i].title;
    var url = data.stories[i].link;
    var points = data.stories[i].points + " points";
    var comments = data.stories[i].num_comments + " comments";
    var when = data.stories[i].published_time;
    var who = data.stories[i].submitter;
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
