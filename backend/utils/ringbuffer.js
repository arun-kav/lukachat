class RingBuffer {
  constructor(size = 100) {
    this.size = size;
    this.buf = [];
  }
  
  push(item) {
    this.buf.push(item);
    if (this.buf.length > this.size) {
      this.buf.shift();
    }
  }
  
  getAll() {
    return [...this.buf];
  }
  
  getLast(n) {
    return this.buf.slice(-n);
  }
  
  clear() {
    this.buf = [];
  }
  
  get length() {
    return this.buf.length;
  }
}

module.exports = RingBuffer;