let cookie = function() {
  var parent = this;

  this.get = function(name) {
    var matches = window.parent.document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  this.set = function(name, value, options) {
    var options = options || {},
        expires = options.expires,
        updatedCookie, propName,
        d = new Date();
    if (typeof expires == "number" && expires) {
      d.setTime(d.getTime() + expires * 1000);
      expires = options.expires = d;
    }
    if (expires && expires.toUTCString)
      options.expires = expires.toUTCString();
    value = encodeURIComponent(value);
    updatedCookie = name + "=" + value;
    for (propName in options) {
      updatedCookie += "; " + propName;
      var propValue = options[propName];
      if (propValue !== true) {
        updatedCookie += "=" + propValue;
      }
    }
    window.parent.document.cookie = updatedCookie;
  }
  this.delete = function(name) {
    this.set(name, "", {expires: -1});
  }
}

module.exports = cookie;
