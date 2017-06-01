
export default class Request {
  constructor(url) {
    this.send = this.send.bind(this);

    this.request = new XMLHttpRequest(); 
    this.url = url;
    this.method = '';
    this.params = '?';
    this.jsonP = false;
    this.headers = {};
  }

  isGet() {
    this.method = 'GET';
    return this;
  }

  isJsonP() {
    this.jsonP = true;
    this.addParam('callback', 'c');
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
    this.params += encodeURIComponent(key) + '=' + encodeURIComponent(value);
    return this;
  }

  addHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  send() {
    return new Promise((resolve, reject) => {
      this.request.withCredentials = false;
      this.request.open(this.method, this.url + this.params, true);

      for (let key of Object.keys(this.headers)) {
        this.request.setRequestHeader(key, this.headers[key]);
      }

      this.request.onreadystatechange = () => {
          if (this.request.readyState === XMLHttpRequest.DONE ) {
            if (this.request.status === 200) {
              if (this.jsonP) {
                resolve(JSON.parse(this.request.responseText.slice(2, -2)));
              } else {
                resolve(JSON.parse(this.request.responseText));
              }
            } else {
              reject(this.request.responseText);
            }
          }
      };
      this.request.send();
    });
  }
}


//https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&q_track=house%20of%20the%20rising%20sun&q_artist=the%20animals&quorum_factor=1&page_size=1&apikey=3c1970e99ed4889fef6bbeb3bb4a6182
//https://api.musixmatch.com/ws/1.1/track.search?format=json&q_track=House%20Of%20The%20Rising%20Sun&q_artist=The%20Animals&quorum_factor=1&page_size=1&apikey=3c1970e99ed4889fef6bbeb3bb4a6182
//https://api.musixmatch.com/ws/1.1/track.search?ft=json&q_track=house%20of%20the%20rising%20sun&q_artist=the%20animals&quorum_factor=1&page_size=1&apikey=3c1970e99ed4889fef6bbeb3bb4a6182






