import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation'; 
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
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
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn : false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }
  
  loadUser = (data) => {
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  /*componentDidMount(){
     fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log)
  }*/

  calculateFaceLocation = (data) => {
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifyFace.left_col * width,
      topRow: clarifyFace.top_row * height,
      rightCol: width - (clarifyFace.right_col * width),
      bottomRow: height - (clarifyFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
        //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        // do something with response
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
       <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div> 
          : (
            route === 'signin'
            ?  <SignIn onRouteChange={this.onRouteChange} />
            :  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )          
      }
      </div> 
    );
  }
}

export default App;
