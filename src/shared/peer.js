import wrtc from 'wrtc';

const resolveKey = key =>
  wrtc[key] ||
  wrtc[`moz${key}`] ||
  wrtc[`ms${key}`] ||
  wrtc[`webkit${key}`];

const RTCPeerConnection = resolveKey('RTCPeerConnection');
const RTCSessionDescription = resolveKey('RTCSessionDescription');
const RTCIceCandidate = resolveKey('RTCIceCandidate');

const PC_CONFIG = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const DC_CONFIG = {ordered: false, maxRetransmits: 0};

const DEFAULTS = {
  timeout: 10000
};

export default class {
  constructor({timeout} = DEFAULTS) {
    this.listeners = {};
    this.candidates = [];
    this.conn = new RTCPeerConnection(PC_CONFIG);
    this.conn.ondatachannel = ::this.handleDataChannel;
    this.conn.onicecandidate = ::this.handleIceCandidate;
    this.conn.onsignalingstatechange = ::this.handleSignalingStateChange;
    this.conn.oniceconnectionstatechange =
      ::this.handleIceConnectionStateChange;
    this.timeout = timeout;
    this.startTimeout();
  }

  call() {
    this.setDataChannel(
      this.channel = this.conn.createDataChannel('data', DC_CONFIG)
    );
    this.conn.createOffer(data =>
      this.conn.setLocalDescription(data, () =>
        this.trigger('signal', {type: 'offer', data})
      , ::this.handleError)
    , ::this.handleError);
    return this;
  }

  signal({type, data}) {
    switch (type) {
    case 'offer': return this.handleOffer(new RTCSessionDescription(data));
    case 'answer': return this.handleAnswer(new RTCSessionDescription(data));
    case 'stable': return this.handleStable();
    case 'candidates':
      data.forEach(candidate =>
        this.conn.addIceCandidate(new RTCIceCandidate(candidate))
      );
      break;
    }
    return this;
  }

  handleOffer(offer) {
    this.conn.setRemoteDescription(offer, () =>
      this.conn.createAnswer(data =>
        this.conn.setLocalDescription(data, () =>
          this.trigger('signal', {type: 'answer', data})
        , ::this.handleError)
      , ::this.handleError)
    , ::this.handleError);
  }

  handleAnswer(answer) {
    this.conn.setRemoteDescription(answer, () => {
      this.trigger('signal', {type: 'stable'});
      this.handleStable();
    }, ::this.handleError);
  }

  handleStable() {
    this.sendCandidates(this.candidates);
    delete this.candidates;
  }

  handleError(er) {
    this.trigger('error', er);
  }

  setDataChannel(channel) {
    channel.onopen = () => this.channel = channel;
    channel.onclose = () => { delete this.channel; };
    channel.onmessage = ::this.handleMessage;
    return this;
  }

  handleMessage({data}) {
    const parsed = JSON.parse(data);
    this.trigger(parsed.n, parsed.d);
  }

  handleDataChannel({channel}) {
    this.setDataChannel(channel);
  }

  handleIceCandidate({candidate}) {
    if (candidate) this.sendCandidate(candidate);
  }

  handleSignalingStateChange() {
    switch (this.conn.signalingState) {
    case 'stable': return this.cancelTimeout();
    case 'closed': return this.die();
    }
    this.startTimeout();
  }

  handleIceConnectionStateChange() {
    switch (this.conn.iceConnectionState) {
    case 'connected': case 'completed': return this.cancelTimeout();
    }
    this.startTimeout();
  }

  startTimeout() {
    this.cancelTimeout();
    this.timeoutId = setTimeout(::this.close, this.timeout);
    return this;
  }

  cancelTimeout() {
    clearTimeout(this.timeoutId);
    return this;
  }

  sendCandidates(data) {
    if (data) this.trigger('signal', {type: 'candidates', data});
    return this;
  }

  sendCandidate(candidate) {
    if (this.candidates) return this.candidates.push(candidate);
    return this.sendCandidates([candidate]);
  }

  send(n, d) {
    if (this.channel) this.channel.send(JSON.stringify({n, d}));
    return this;
  }

  close() {
    if (this.conn.signalingState !== 'closed') this.conn.close();
    return this;
  }

  die() {
    this.cancelTimeout();
    if (this.channel) this.channel.close();
    this.trigger('close');
    return this;
  }

  on(name, cb) {
    let listeners = this.listeners[name];
    if (!listeners) listeners = this.listeners[name] = [];
    listeners.push(cb);
    return this;
  }

  off(name, cb) {
    if (!name) this.listeners = {};
    if (!cb) delete this.listeners[name];
    let listeners = this.listeners[name];
    if (!listeners) return this;
    listeners = this.listeners[name] = listeners.filter(_cb => _cb !== cb);
    if (!listeners.length) delete this.listeners[name];
    return this;
  }

  trigger(name, data) {
    const listeners = this.listeners[name];
    if (!listeners) return this;
    for (let i = 0, l = listeners.length; i < l; ++i) listeners[i](data);
    return this;
  }
}
