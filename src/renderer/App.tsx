import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { useState } from 'react'
import React from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import RecipeReviewCard from './ConsoleCollapse';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
let packageJson = require("../../package.json");

let isRunOnce1 = true


let iposc
let portosc
let iposcout
let portoscout
let ipwatchout
let portwatchout
let oscinenabled
let oscoutenabled
let buttonConnected
let textConnected = "Connect"

const Hello = () => {
 //console.log("New Render!")

let [oscIpIn, setOscIpIn] = useState("");
let [oscPortIn, setOscPortIn] = useState("");
let [oscIpOut, setOscIpOut] = useState("");
let [oscPortOut, setOscPortOut] = useState("");
let [watchoutIpOut, setWatchoutIpOut] = useState("");
let [watchoutPortOut, setWatchoutPortOut] = useState("");
let [connected, setConnected] = useState("")
let [_, setTextConnect] = useState("Connect")

const [checked, setChecked] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

const [checke, setChecke] = React.useState("");

  const handleChang = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecke(event.target.checked);
  };

// const openDev = () => {
//   window.electron.console("Hi")
// }

//window.electron.console("hiiiii")

// iposc = oscIpIn
// portosc = oscPortIn
// ipwatchout = watchoutIpOut
// portwatchout = watchoutPortOut

window.electron.ipcRenderer.on('woconnected', (event, arg) => {
  //console.log("App on happend")
  //console.log(arg)
  if (arg == true){
    setConnected(buttonConnected = "success")
    setTextConnect(textConnected = "Connected")
} else {
  setConnected(buttonConnected = "error")
  setTextConnect(textConnected = "Disconnected")
  }
  console.log(`OSC (In)\nIP: ${iposc} \nPort: ${portosc}\n\nOSC (Out)\nIP: ${iposcout} \nPort: ${portoscout}\n\nWebsocket (Out)\nIP: ${ipwatchout}\nPort: ${portwatchout}`)
})

const getConfigDefaults = async () => {
  const result = await electron.getConfig()
  iposc = result.iposc
  portosc = result.portosc
  iposcout = result.iposcout
  portoscout = result.portoscout
  ipwatchout = result.ipwatchout
  portwatchout = result.portwatchout
  oscinenabled = result.oscinenabled
  setChecked(oscinenabled)
  oscoutenabled = result.oscoutenabled
  setChecke(oscoutenabled)


  console.log(`[Version: ${packageJson.version}]`)
  console.log(`[Last Used Config Settings]\n\nOSC (In)\nIP: ${iposc} \nPort: ${portosc}\n\nOSC (Out)\nIP: ${iposcout} \nPort: ${portoscout}\n\nWebsocket (Out)\nIP: ${ipwatchout}\nPort: ${portwatchout}`)


  let input = document.getElementById("input1")
  input.value = iposc

  let input2 = document.getElementById("input2")
  input2.value = portosc

  let input5 = document.getElementById("input5")
  input5.value = iposcout

  let input6 = document.getElementById("input6")
  input6.value = portoscout

  let input3 = document.getElementById("input3")
  input3.value = ipwatchout

  let input4 = document.getElementById("input4")
  input4.value = portwatchout

  oscinenabled = checked

  oscoutenabled = checke


}

const isRunOnce = async () => {
  //const result = await window.electron.getIsRunOnce()
  //console.log(isRunOnce1)
  if (isRunOnce1){
    isRunOnce1 = false
    getConfigDefaults()
  }
}
isRunOnce()


const handleSubmit = async (e) => {
  e.preventDefault()

  // window.electron.ipcRenderer.send('ping', 'ping')

  if(textConnected == "Connected"){
    return
  }

  oscinenabled = checked
  oscoutenabled = checke
  setTextConnect(textConnected = "Connecting...")
  const configData = {iposc, portosc, iposcout, portoscout, ipwatchout, portwatchout, oscinenabled, oscoutenabled}
  console.log("[OSC CONNECTED]\n[OSC SERVER RUNNING...]")
  //console.log(configData)
  const result = await window.electron.sendConfig(configData)
  //console.log(result)

}



  return(
    <div className='body1'>
      <form onSubmit={
        handleSubmit
        }>
        <Box
      //component="form"
      sx={{
        '& .MuiTextField-root': { m: 4, width: '21ch', },
        tabSize: 2
      }}
      noValidate
      autoComplete="off"
      />
      <div>
      <FormGroup>
      <FormControlLabel control={<Checkbox checked={checked} onChange={handleChange}/>} label="OSC (IN)" />
      </FormGroup>
      {/* <h2 className='App-header'>OSC (In)</h2> */}

      <TextField
      sx={{
        input: { color: 'white'},
        fieldSet: { borderColor: 'white'},
        label: { color: 'white'}
      }}
      size="small"
      margin="dense"
        id="input1"
        label="IP"w
        defaultValue={oscIpIn}
        onChange={(e) => setOscIpIn(
          e.target.value,
          iposc = e.target.value,
          //console.log(e)
        )}
        />
      <TextField
      sx={{
        input: { color: 'white'},
        fieldSet: { borderColor: 'white'},
        label: { color: 'white'}
      }}
        id="input2"
        size="small"
        margin='dense'
        label="Port"
        defaultValue={oscPortIn}
        onChange={(e) => setOscPortIn(
          portosc = e.target.value,
          e.target.value
          )}
        />


      <FormGroup>
      <FormControlLabel control={<Checkbox checked={checke} onChange={handleChang}/>} label="OSC (OUT)"/>
      </FormGroup>

      <TextField
      sx={{
        input: { color: 'white'},
        fieldSet: { borderColor: 'white'},
        label: { color: 'white'}
      }}
      size="small"
      margin="dense"
        id="input5"
        label="IP"w
        defaultValue={oscIpOut}
        onChange={(e) => setOscIpOut(
          e.target.value,
          iposcout = e.target.value,
          //console.log(e)
        )}
        />
      <TextField
      sx={{
        input: { color: 'white'},
        fieldSet: { borderColor: 'white'},
        label: { color: 'white'}
      }}
        id="input6"
        size="small"
        margin='dense'
        label="Port"
        defaultValue={oscPortOut}
        onChange={(e) => setOscPortOut(
          portoscout = e.target.value,
          e.target.value
          )}
        />

        <div>
        {/* {SimpleAccordion() } */}
        {RecipeReviewCard()}
      </div>

      <br></br>
      <h2 className='App-header'>Websocket (Out)</h2>
      <TextField
      sx={{
        input: { color: 'white'},
        fieldSet: { borderColor: 'white'},
        label: { color: 'white'}
      }}
        margin="dense"
        id="input3"
        label="IP"
        size="small"
        defaultValue={watchoutIpOut}
        onChange={(e) => setWatchoutIpOut(
          e.target.value,
          ipwatchout = e.target.value
          )}
        />
      <TextField
      sx={{
        input: { color: 'white'},
        fieldSet: { borderColor: 'white'},
        label: { color: 'white'}
      }}
        margin="dense"
        id="input4"
        label="Port"
        size="small"
        defaultValue={watchoutPortOut}
        onChange={(e) => setWatchoutPortOut(
          e.target.value,
          portwatchout = e.target.value
          )}
      />

      <Button sx={{
        position:'absolute',
        bottom:"0",
        right:"0",
        height:60
        }} fullWidth variant='contained'color={buttonConnected} type='submit'>{textConnected}</Button>
      </div>
      </form>
    </div>
  )
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
