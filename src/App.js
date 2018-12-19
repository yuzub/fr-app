import React, { Component } from 'react';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: '413e15c29c194e00b01158d0c6ecdd7e'
});

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log('click');
    this.setState({ imageUrl: this.state.input });
    // https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png
    // https://static.seattletimes.com/wp-content/uploads/2018/10/90a2c67c-ba17-11e8-b2d9-c270ab1caed2-1020x776.jpg
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(
        function (response) {
          // do something with response
          console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        },
        function (err) {
          // there was an error
        }
      );
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
