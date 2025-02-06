import { useState } from 'react'
import Versions from './components/Versions'
// import electronLogo from './assets/electron.svg'
const { ipcRenderer } = require('electron')

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [duration, setDuration] = useState('')
  const [videoName, setVideoName] = useState('')
  const submitHandler = async (): Promise<void> => {
    // Request the main process to open the file dialog.
    const filePath = await ipcRenderer.invoke('select-video')
    if (!filePath) {
      setVideoName('No file selected.')
      console.log('No file selected from the dialog.')
      return
    }
    console.log('Renderer received filePath:', filePath)
    setVideoName('Selected file: ' + filePath)

    try {
      const duration = await ipcRenderer.invoke('get-video-duration', filePath)
      console.log('Renderer received duration:', duration)
      setDuration('\nVideo duration: ' + duration + ' seconds.')
    } catch (error) {
      console.error('Error retrieving video duration:', error)
      setVideoName('Error retrieving metadata: ' + error)
    }
  }

  return (
    <>
      <div className="container">
        <h1>Select a Video File</h1>
        <button onClick={submitHandler}>Select Video</button>
        <div id="result"></div>
        <p>{videoName}</p>
        <p>{duration}</p>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
