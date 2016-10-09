(function() {
  "use strict"
  let getFriends = require('./modules/get-friends.js');
  let Handlebars = require('handlebars');
  new Promise(function(resolve) {
    if (document.readyState == 'complete') {
      resolve();
    }
    else {
      window.onload = resolve;
    }
  }).then(function() {
    getFriends().then(function(friends) {
      let source   = document.getElementById('friend-template').innerHTML;
      let template = Handlebars.compile(source);
      let html = template(friends);
      left.innerHTML = html;
    });
  });
}());
