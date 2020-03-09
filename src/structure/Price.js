class Price {
  constructor(time, price) {
    this._time = time;
    this._price = price;
  }

  get time() {
    return this._time;
  }

  get price() {
    return this._price;
  }
}

Price.prototype.toString = function() {
  return `{time: ${this._time}, price: ${this._price}}`;
};

export default Price;
