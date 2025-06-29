(function() {
  const builders = [];

  window.BlockFactory = {
    register(builder) {
      if (typeof builder === 'function') {
        builders.push(builder);
      }
    },

    buildAll(data, tdee) {
      return builders.map(fn => fn(data, tdee)).join('');
    },

    clear() {
      builders.length = 0;
    }
  };
})();
