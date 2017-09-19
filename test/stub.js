
class EventTarget {

  constructor() {
    this._listeners = [];
  }

  addListener(fn) {
    this._listeners.push(fn);
  }

  removeListener(fn) {
    for (var i = 0, len = this._listeners.length; i < len; i++) {
      if (this._listeners[i] === fn) {
        return this._listeners.splice(i, 1);
      }
    }
  }

  nofifyListeners(...args) {
    this._listeners.forEach(i => i.apply(this, args));
  }
}

window.chrome = window.chrome || {};
window.chrome.storage = window.chrome.storage || {};
window.chrome.storage.onChanged = new EventTarget();
window.chrome.storage.sync = {};
window.chrome.storage.sync.get = function(property, callback) {
  setTimeout(function() {
    callback({
      'HISTORY_ENABLED': true,
      'MAGICVARS_ENABLED': true,
      'useCookieStorage': true,
      'requestDefaultTimeout': 45
    });
  }, 1);
};

window.chrome.storage.sync.set = function(obj, callback) {
  setTimeout(function() {
    var changes = {};
    Object.keys(obj).forEach(key => {
      changes[key] = {newValue: obj[key]};
    });
    window.chrome.storage.onChanged.nofifyListeners(changes, 'sync');
    callback();
  }, 1);
};
