let getFriends = function() {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5573044
    });

    VK.Auth.login(function(response) {
      if (response.session)
        resolve(response);
      else
        reject(new Error('Не удалось авторизоваться'));
    }, 8);
  }).then(function() {
    return new Promise(function(resolve) {
      VK.api('friends.get', {'name_case': 'nom', 'fields': 'photo_100', 'version': '5.53'}, response => {
        if (response.error)
          reject(new Error(response.error.error_msg));
        else
          resolve(response.response);
      });
    });
  }).catch(function(e) {
    alert(`Ошибка: ${e.message}`);
  });
}

module.exports = getFriends;
