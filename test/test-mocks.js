// Mock Chrome API
window.chrome = {
  storage: {
    sync: {
      data: {},
      get: function(keys, callback) {
        return new Promise((resolve) => {
          const result = {};
          if (Array.isArray(keys)) {
            keys.forEach(key => {
              if (this.data[key] !== undefined) {
                result[key] = this.data[key];
              }
            });
          } else if (keys === null) {
            Object.assign(result, this.data);
          } else {
            Object.keys(keys).forEach(key => {
              result[key] = this.data[key] !== undefined ? this.data[key] : keys[key];
            });
          }
          if (callback) callback(result);
          resolve(result);
        });
      },
      set: function(items, callback) {
        return new Promise((resolve) => {
          Object.assign(this.data, items);
          if (callback) callback();
          resolve();
        });
      },
      clear: function(callback) {
        return new Promise((resolve) => {
          this.data = {};
          if (callback) callback();
          resolve();
        });
      },
      onChanged: {
        addListener: function() {}
      }
    }
  },
  runtime: {
    onInstalled: {
      addListener: function() {}
    },
    onMessage: {
      addListener: function() {}
    },
    sendMessage: function() {},
    lastError: null
  },
  tabs: {
    query: function() {
      return Promise.resolve([]);
    },
    sendMessage: function() {},
    onUpdated: {
      addListener: function() {}
    },
    reload: function() {}
  }
};