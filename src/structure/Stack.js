class Stack {
  static MAX_SIZE = 5;

  static get EMPTY_STACK() {
    let stack = [];
    for (let i = 1; i <= this.MAX_SIZE; i++) {
      stack.push({ time: i, price: i + 3 });
    }
    return stack;
  }

  constructor() {
    this._stack = [];
  }

  get stack() {
    return this._stack;
  }

  get size() {
    return this._stack.length;
  }

  get top() {
    return this._stack[0];
  }

  get bottom() {
    return this._stack[this.size - 1];
  }

  pop() {
    this._stack.shift();
  }

  push(item) {
    if (this.size < Stack.MAX_SIZE) {
      this._stack.unshift(item);
    } else {
      this._stack.pop();
      this._stack.unshift(item);
    }
  }
}

Stack.prototype.toString = function() {
  return (
    'Stack[' +
    this._stack.reduce((p, c) => p.toString() + ', ' + c.toString()) +
    ']'
  );
};

export default Stack;
