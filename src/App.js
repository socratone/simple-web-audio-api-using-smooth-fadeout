import React, { useEffect } from 'react';
import './App.css';

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
let gainNode;

function App() {
  const audioFile = React.createRef();

  useEffect(() => {
    audioContext = new AudioContext();

    // Create a MediaElementAudioSourceNode
    // Feed the HTMLMediaElement into it
    const source = audioContext.createMediaElementSource(audioFile.current);

    // Create a gain node and set its gain value to 0.5
    gainNode = audioContext.createGain();

    // connect the AudioBufferSourceNode to the gainNode
    // and the gainNode to the destination
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }, []);

  const clickPlayButton = () => {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    // 아래와 더불어 setValueAtTime 설정이 빠지면 click 노이즈가 발생한다.
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    audioFile.current.play();
  };

  const clickPauseButton = () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    audioFile.current.pause();
  };

  const clickFadeButton = () => {
    // 위와 더불어 setValueAtTime 설정이 빠지면 click 노이즈가 발생한다.
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 1
    );
  };

  return (
    <div className="App">
      <audio src="e4.mp3" ref={audioFile}></audio>
      <button onClick={clickPlayButton}>play</button>
      <button onClick={clickPauseButton}>pause</button>
      <button onClick={clickFadeButton}>fade</button>
    </div>
  );
}

export default App;
