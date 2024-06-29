self.onmessage = function(e) {
  const { method, args } = e.data;
  const result = myObject[method](...args);
  self.postMessage(result);
};

const myObject = {
  myMethod: function(arg1, arg2) {
      // Simulate a time-consuming task
      let sum = 0;
      for (let i = 0; i < 1e9; i++) {
          sum += i;
      }
      return sum + arg1 + arg2;
  }
};
