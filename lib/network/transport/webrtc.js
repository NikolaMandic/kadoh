var StateEventEmitter = require('../../util/state-eventemitter'),

var WebRTCTransport = module.exports = StateEventEmitter.extend({

  initialize : function(server_name, options) {
    this.supr();
    this._peerJSKey = options.peerJSKey;
    this._id = options.id;
    this.setState('disconnected');
  },

  connect : function() {
    this._peer = new Peer(this._id, {key: this._peerJSKey});
  },

  disconnect: function() {
  },

  send: function(dst, message) {
    if (this.stateIsNot('connected')) {
      throw new Error('WebRTC transport layer not connected.');
    }
    
    message = {
      dst: dst,
      msg: message
    };

    this.emit('data-out', JSON.stringify(message));
    //this.socket.emit('packet', message);
    this._peer.send(message)
  },

  listen : function(fn, context) {
    if (this.stateIsNot('connected')) {
      throw new Error('WebRTC transport layer not connected.');
    }

    context = context || this;
    var self = this;
    this._peer.on('connection', function(conn){
      conn.on('data', function(data) {
        self.emit('data-in', data);
        fn.call(context, message);
        console.log('Got data:', data);
      });
    });
    /*
    this.socket.on('packet', function(message) {
      fn.call(context, message);
    });
    */
  }
});
