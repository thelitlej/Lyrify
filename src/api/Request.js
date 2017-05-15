
export default class Request {
  constructor(url) {
    this.request = new XMLHttpRequest(); 
    this.url = url;
    this.method = '';
    this.params = '?';
  }

  isGet() {
    this.method = 'GET';
    return this;
  }

  isPost() {
    this.method = 'POST';
    return this;
  }

  addParam(key, value) {
    if (this.params !== '?') {
      this.params += '&';  
    }
    this.params += key + '=' + value;
    return this;
  }

  send() {
    return new Promise((reject, resolve) => {
      this.request.open(this.method, this.url + this.params, true);
      this.request.onreadystatechange = function() {
          if (this.readyState === XMLHttpRequest.DONE ) {
            if (this.status === 200) {
              resolve(JSON.parse(this.request.responseText));
            } else {
              reject(this.request.responseText);
            }
          }
      };
      this.request.send();
    });
  }
}