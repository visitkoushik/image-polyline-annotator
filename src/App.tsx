import React from 'react'; 
import './App.css';    
import Annotator from './Annotator/reactimageannotator';

function App() {
  return (
     <Annotator   images={[
      {
        url:'https://placekitten.com/408/285',
        width:"60vw",
        height:"60vh"
      }
     ]}/>
  );
}

export default App;
