let padZero = (n, width = 2) => {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
};

class Utils {
  constructor() {}

  static formatTimeString(time = new Date()) {
    if (time === null) return '';
    let d = new Date(time);
    let month = padZero(d.getMonth() + 1);
    let date = padZero(d.getDate());
    let hour = padZero(d.getHours());
    let minute = padZero(d.getMinutes());
    let second = padZero(d.getSeconds());
    return `${d.getFullYear()}/${month}/${date} ${hour}:${minute}:${second}`;
  }

  static randomColor() {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
  }

  static generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static getAvatar(filename) {
    return require('../assets/animal/' + filename);
  }

  static getStorage(key) {
    return JSON.parse(localStorage.getItem('BITCOIN_WATCHER_L_' + key));
  }

  static setStorage(key, value) {
    return localStorage.setItem(
      'BITCOIN_WATCHER_L_' + key,
      JSON.stringify(value)
    );
  }

  static round(n, decimal = 2) {
    let d = Math.pow(10, decimal);
    return Math.round(n * d) / d;
  }
}

export default Utils;
