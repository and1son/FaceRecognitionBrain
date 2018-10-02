import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation'; 
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Logo from './components/logo/logo'; 
import ImageLinkForm from './components/imagelinkform/ImageLinkForm'; 
import Rank from './components/rank/Rank'; 
import './App.css';



const app = new Clarifai.App({
 apiKey: '3373b64fcd65493fb59885ab3ad0c512'
});

const particlesOptions = {
    particles: {
      number: {
        value: 30, 
        density:{
          enable:true,
          value_area:800
        }
      }
    }
 }

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: ''
    }
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(
      function(response) {
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        // do something with response
      },
      function(err) {
        // there was an error
      }
    );
  }

  render() {
    return (
      <div className="App">
       <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit} 
          />
          <FaceRecognition imageUrl={this.state.imageUrl} />
      </div> 
    );
  }
}

export default App;
