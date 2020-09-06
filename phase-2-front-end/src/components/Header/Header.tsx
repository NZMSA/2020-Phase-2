import * as React from 'react';
import logo from '../../assets/purplePixel.gif';

class Header extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      refresh: 0,
    };
  }

  refresh() {
    this.setState({ refresh: 1 });
  }

  componentDidMount() {
    setInterval(this.refresh.bind(this), 3000);
  }

  updateColours() {
    let colours = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo'];
    return colours[(Math.random() * colours.length) >> 0];
  }

  render() {
    return (
      <div className='header'>
        <h1>
          <span id='P-char' style={{ color: this.updateColours() }}>
            P
          </span>
          <span id='I-char' style={{ color: this.updateColours() }}>
            i
          </span>
          <span id='X-char' style={{ color: this.updateColours() }}>
            x
          </span>
          <span id='E-char' style={{ color: this.updateColours() }}>
            e
          </span>
          <span id='L-char' style={{ color: this.updateColours() }}>
            l
          </span>
          <span id='S-char' style={{ color: this.updateColours() }}>
            s
          </span>
          <img alt='header' src={logo} style={{ display: 'inline', height: '35px', verticalAlign: 'middle', margin: '20px' }} />
        </h1>
      </div>
    );
  }
}

export default Header;
