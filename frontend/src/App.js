import React, { Component } from "react";
import "./App.css";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
  apiKey: "413e15c29c194e00b01158d0c6ecdd7e"
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
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    };
  }

  calculateFaceLocation = data => {
    const coorFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(coorFace);
    const image = document.getElementById("inputimg");
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: coorFace.left_col * width,
      rightCol: width - coorFace.right_col * width,
      topRow: coorFace.top_row * height,
      bottomRow: height - coorFace.bottom_row * height
    };
  };

  displayFaceBox = box => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = event => {
    console.log(event.target.value);
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    console.log("click");
    this.setState({ imageUrl: this.state.input });
    // https://media.glamour.com/photos/5a425fd3b6bcee68da9f86f8/master/w_644,c_limit/best-face-oil.png
    // https://static.seattletimes.com/wp-content/uploads/2018/10/90a2c67c-ba17-11e8-b2d9-c270ab1caed2-1020x776.jpg
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === 'signin') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={box}
              imageUrl={imageUrl}
            />
          </div>
        ) : route === "signin" ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
