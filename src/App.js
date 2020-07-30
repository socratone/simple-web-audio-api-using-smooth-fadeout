import React, { useEffect } from 'react';
import './App.css';

let AudioContext;
let audioContext;
let gainNode;

const MASTER_VOLUME = 1;

function App() {
  const audio = React.createRef();

  const clickPlayButton = () => {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    gainNode.gain.value = MASTER_VOLUME;
    audio.current.play();
  };

  const clickPauseButton = () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    audio.current.pause();
  };

  const clickFadeButton = () => {
    const INTERVAL = 1;
    let volume = MASTER_VOLUME;

    const fadeout = setInterval(() => {
      volume -= 0.02;
      if (volume > -1) {
        gainNode.gain.value = volume.toFixed(2);
      } else {
        clearInterval(fadeout);
        gainNode.gain.value = -1;
        audio.current.pause();
        audio.current.currentTime = 0;
      }
    }, INTERVAL);
  };

  useEffect(() => {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    // pass it into the audio context
    const track = audioContext.createMediaElementSource(audio.current);
    track.connect(audioContext.destination);

    // 게인 조절
    gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);
  }, []);

  return (
    <div className="App">
      <audio src="e4.mp3" ref={audio}></audio>
      <button onClick={clickPlayButton}>play</button>
      <button onClick={clickPauseButton}>pause</button>
      <button onClick={clickFadeButton}>fade</button>
    </div>
  );
}

export default App;
