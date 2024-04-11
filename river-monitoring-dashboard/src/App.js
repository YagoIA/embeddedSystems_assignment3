import logo from './logo.svg';
import './App.css';
import SystemStatus from './components/SystemStatus'
import UserInput from './components/UserInput'
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';





function App(props) {
  var [sysVars, setSysVars] = useState({
    "valveOpeningLevel": 0,
    "monitoringFrequencyMs": 0,
    "state": "no data",
    "waterLevel": 0,
  })

  useEffect(() => {
    let intervalID = setInterval(() => {
      const backendAddr = `http://localhost:3001/status`
      fetch(backendAddr, {mode:'cors'})
        .then(function(res){
          res.json()
            .then(function(data) {
              setSysVars(data)
            })
        })
        .catch(function(err) {
          console.log("Fetch Error :-S", err);
        });
    }, 1000);
    return () => clearInterval(intervalID); 
  },[])



  return (
    <div className="App">
      <SystemStatus data={sysVars}></SystemStatus>
      <UserInput mode={sysVars.state}></UserInput>
    </div>
  );
}

export default App;
