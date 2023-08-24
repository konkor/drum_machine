'use strict';

const e = React.createElement;

const PADS = [
  {key: 'Q', name: 'Heater 1', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'},
  {key: 'W', name: 'Heater 2', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'},
  {key: 'E', name: 'Heater 3', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'},
  {key: 'A', name: 'Heater 4', src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'},
  {key: 'S', name: 'Clap',     src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'},
  {key: 'D', name: 'Open HH',  src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'},
  {key: 'Z', name: 'Kick & Hat', src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'},
  {key: 'X', name: 'Kick',     src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'},
  {key: 'C', name: 'Closed HH',src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'}
];

const PAD_OFF = {};
const PAD_ON = {backgroundColor: "#ff8a8a", boxShadow: "2px 2px 3px #faaaaa, 0 0 3px #fff"};

class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.sample = props.sample;
    this.sample.keyCode = this.sample.key.charCodeAt(0);
    this.audio = e (
      'audio',
      {id: this.sample.key, className: 'clip', src: this.sample.src},
      null
    );
    this.state = { padStyle: PAD_OFF };

    this.play = this.play.bind (this);
    this.handleKeyPress = this.handleKeyPress.bind (this);
    this.disable = this.disable.bind (this);
  }

  componentDidMount () {
    var p = document.getElementById (this.sample.key);
    p.addEventListener ("ended", this.disable);
    p.volume = 0.5;
    document.addEventListener ("keydown", this.handleKeyPress);
  }

  componentWillUnmount () {
    var p = document.getElementById (this.sample.key);
    p.removeEventListener ("ended", this.disable);
    document.removeEventListener ("keydown", this.handleKeyPress);
  }

  handleKeyPress (e) {
    if (e.keyCode == this.sample.keyCode) this.play ();
  }

  play () {
    if (!this.props.parent.state.power) return;
    var p = document.getElementById (this.sample.key);
    p.currentTime = 0;
    p.play ();
    this.props.setDisplay (this.sample.name);
    this.activate ();
  }

  activate () {
    this.setState ({padStyle: PAD_ON});
  }

  disable () {
    this.setState ({padStyle: PAD_OFF});
  }

  render() {
    return e(
      'div',
      { className: 'drum-pad', onClick: this.play, style: this.state.padStyle },
      this.audio, this.sample.key
    );
  }
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.pads = [];

    this.state = {
      display: "Drums Kit",
      power: true
    };

    this.setDisplay = this.setDisplay.bind (this);
    this.setVolume = this.setVolume.bind (this);

    PADS.forEach (p => {
      this.pads.push (e(
        DrumPad,
        { sample: p , setDisplay: this.setDisplay, parent: this },
        null
      ));
    });
  }

  setDisplay (label) {
    this.setState ({
      display: label
    });
  }

  setVolume (e) {
    var col = document.getElementsByClassName ('clip');
    Array.from (col).forEach (p => {p.volume = e.target.value / 100})
    if (this.state.power) this.setState ({
      display: "Volume: " + Math.round (e.target.value)
    });
  }

  render() {
    let led_style = this.state.power ? {backgroundColor: "#f99", borderColor: "red"} : {};
    let power_style = this.state.power ? {boxShadow: "0 0 2px #222, -2px -2px 2px #4f4f4f"} : {};
    let logo = e ('a', {id: 'logo', href: "https://github.com/konkor/drum_machine"}, 'Drum Machine');
    let pads_panel = e ('div', {id: 'pads-panel'}, this.pads);
    let display = e ('div', {id: 'display'}, this.state.display);
    let led = e ('div', {id: 'led', style: led_style}, "");
    let power_botton = e ('div', {id: 'power', style: power_style, onClick: o => this.setState ({power: !this.state.power, display: this.state.power?"":"Drums Kit"})}, "POWER", led);
    let volume = e ('input', {id: "volume", onChange: this.setVolume, type: "range", min: 0.0, max: 100.0, step: 10}, null);
    let control_panel = e ('div', {id: 'control-panel'}, display, volume, power_botton);
    return e(
      'div',
      { id: 'drum-machine' },
      pads_panel, logo, control_panel
    );
  }
}

const domContainer = document.querySelector('#drum_machine_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(DrumMachine));
