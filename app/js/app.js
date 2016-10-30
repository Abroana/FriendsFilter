"use strict"

let FriendsFilter = function() {
  let getFriends = require('./modules/get-friends.js');
  let Handlebars = require('handlebars');
  let Cookie = require('./modules/cookie.js');
  let parent = this;
  let cookie = new Cookie();
  this.allFriends = [];
  this.friends = [];
  this.favorites = [];

  this.init = function() {
    new Promise(function(resolve) {
      if (document.readyState == 'complete') {
        resolve();
      }
      else {
        window.onload = resolve;
      }
    }).then(function() {
      getFriends().then(function(friends) {
        parent.allFriends = friends;
        let favorites = JSON.parse(cookie.get('favorites') || '[]') ;
        let source, template, html;
        if (favorites.length > 0) {
          parent.favorites = parent.getNewFiriendList({type: 'favorites', data: favorites});
          parent.friends = parent.getNewFiriendList({type: 'friends', data: favorites});
          source   = document.getElementById('friend-right').innerHTML;
          template = Handlebars.compile(source);
          html = template(parent.favorites);
          right.innerHTML = html;

          source   = document.getElementById('friend-left').innerHTML;
          template = Handlebars.compile(source);
          html = template(parent.friends);
          left.innerHTML = html;
        }
        else {
          source   = document.getElementById('friend-left').innerHTML;
          template = Handlebars.compile(source);
          html = template(parent.allFriends);
          parent.friends = parent.allFriends.slice();
          left.innerHTML = html;
        }

        let container = document.querySelector('.modal');
        container.addEventListener('click', function(e) {
          if (e.target.className.indexOf('friend-list-item__icon--add') > -1) {
            parent.changeFavorites({id: e.target.dataset.id, type: 'add'});
          }
          else if (e.target.className.indexOf('friend-list-item__icon--remove') > -1) {
            parent.changeFavorites({id: e.target.dataset.id, type: 'remove'});
          }
          else if (e.target.className.indexOf('save-state') > -1) {
            parent.saveData();
          }
        });

        let searchContainer = document.querySelector('.search-container');
        searchContainer.addEventListener('input', function(e) {
          let value = e.target.value.toLowerCase();
          if (e.target.className.indexOf('left') > -1) {
            for (let i = 0; i < parent.friends.length; i++) {
              let el = document.querySelector('.friend-list-item[data-id="' + parent.friends[i].uid + '"]');
              if (parent.friends[i].first_name.toLowerCase().indexOf(value) === -1 && parent.friends[i].last_name.toLowerCase().indexOf(value) === -1) {
                el.style.display = 'none';
              }
              else if ('none' === el.style.display) {
                el.style.display = 'block';
              }
            }
          }
          else if (e.target.className.indexOf('right') > -1) {
            for (let i = 0; i < parent.favorites.length; i++) {
              let el = document.querySelector('.friend-list-item[data-id="' + parent.favorites[i].uid + '"]');
              if (parent.favorites[i].first_name.toLowerCase().indexOf(value) === -1 && parent.favorites[i].last_name.toLowerCase().indexOf(value) === -1) {
                el.style.display = 'none';
              }
              else if ('none' === el.style.display) {
                el.style.display = 'block';
              }
            }
          }
        });

        /* drag-n-drop */
        let dragEl;
        container.addEventListener('dragstart', function(e) {
          if (e.target.className === 'friend-list-item') {
            dragEl = e.target;
            let type = ('right' === dragEl.parentNode.id) ? 'remove' : 'add';
            dragEl.style.opacity = 0.4;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', JSON.stringify({id: dragEl.dataset.id, type: type}));
          }
        });

        container.addEventListener('dragover', function(e) {
          if (e.target.className === 'friend-list' || e.target.parentNode.className === 'friend-list') {
            if (e.preventDefault)
              e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            return false;
          }
        });

        container.addEventListener('drop', function(e) {
          if (e.target.className == 'friend-list' || e.target.parentNode.className === 'friend-list') {
            if (e.stopPropagation)
              e.stopPropagation();
            let data = JSON.parse(e.dataTransfer.getData('text/plain') || '[]');
            if (((e.target.id == 'left' || e.target.parentNode.id === 'left' || e.target.className == 'friend-list-item') && 'add' === data.type) || ((e.target.id == 'right' || e.target.parentNode.id === 'right' || e.target.className == 'friend-list-item') && 'remove' === data.type)) {
              e.dataTransfer.dropEffect = 'none';
              dragEl.style.opacity = 1;
            }
            else {
              parent.changeFavorites(data);
            }
            return false;
          }
        });

        container.addEventListener('dragend', function(e) {
          if (e.stopPropagation)
            e.stopPropagation();
          if (dragEl) {
            dragEl.style.opacity = 1;
          }
          return false;
        });
      });
    });
  }

  this.getNewFiriendList = function(options) {
    let friends = parent.allFriends.slice(),
        newList = [];
    if ('friends' === options.type) {
      for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < friends.length; j++) {
          if (friends[j].uid == options.data[i])
            friends.splice(j, 1);
        }
      }
      return friends;
    }
    else {
      for (let i = 0; i < options.data.length; i++) {
        for (let j = 0; j < friends.length; j++) {
          if (friends[j].uid == options.data[i])
            newList.push(friends[j]);
        }
      }
      return newList;
    }
  }

  this.getFriendIndexById = function(id) {
    let friends = parent.allFriends;
    var id = parseInt(id, 10);
    for (let i = 0; i < friends.length; i++) {
      if (id == friends[i].uid)
        return i;
    }
  }

  this.changeFavorites = function(options) {
    var options = options || {};
    let index = parent.getFriendIndexById(options.id);
    let item = parent.allFriends[index] || {};
    let element = document.querySelector('.friend-list-item[data-id="' + item.uid + '"]');
    let source, template, html;
    element.remove();
    if ('add' === options.type) {
      source   = document.getElementById('friend-favorite').innerHTML;
      template = Handlebars.compile(source);
      html = template(item);
      right.innerHTML = html + right.innerHTML;
      for (let i = 0; i < parent.friends.length; i++) {
        if (parent.friends[i].uid === item.uid)
          parent.friends.splice(i, 1);
      }
      parent.favorites.push(item);
    }
    else if ('remove' === options.type) {
      source   = document.getElementById('friend').innerHTML;
      template = Handlebars.compile(source);
      html = template(item);
      left.innerHTML = html + left.innerHTML;
      for (let i = 0; i < parent.favorites.length; i++) {
        if (parent.favorites[i].uid === item.uid)
          parent.favorites.splice(i, 1);
      }
      parent.friends.push(item);
    }
  }

  this.saveData = function() {
    let container = document.getElementById('right'),
        data = [];
    for (let i = 0; i < container.childNodes.length; i++) {
      if (1 === container.childNodes[i].nodeType)
        data.push(container.childNodes[i].dataset.id);
    }
    cookie.set('favorites', JSON.stringify(data));
    alert('Изменения сохранены');
  }
}

let fFilter = new FriendsFilter();
fFilter.init();
