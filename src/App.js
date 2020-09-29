import React, {useState, useCallback,  useEffect, useRef} from 'react';
import './App.scss';

import catSoundPath from "./cat.mp3";
import bellSoundPath from "./bell.mp3";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop, faLeaf, faBell, faBellSlash} from "@fortawesome/free-solid-svg-icons";


const STATUSES = [0,1];
const [WORKING, RESTING] = STATUSES;

function statusToString(status){
  if(status === WORKING){
    return  "work";
  }
  else if(status === RESTING){
    return  "break";
  }
  else{
    return null;
  }
}


function determinStatus(minutes){
  return minutes % 2  === 0 ? RESTING : WORKING;
  /*
  if(25 <= minutes  && minutes < 30){
    return RESTING;
  }
  else if(55 <= minutes  && minutes < 60){
    return RESTING;
  }
  else{
    return WORKING;
  }
  */

}

function calcProgress(minutes, seconds){
  minutes += seconds/60;

  if((25 <= minutes && minutes < 30) || (55 <= minutes  && minutes < 60)){
    //resting
    let left_5min = 0;
    if((25 <= minutes && minutes < 30)){
      left_5min = 30 - minutes;
    }
    else{
      left_5min = 60 - minutes;
    }
    return (1-left_5min/5) * 100;
  }
  else{

    let left_25min = 0;
    if((0 <= minutes && minutes < 25)){
      left_25min = 25 - minutes;
    }
    else{
      left_25min = 55 - minutes;
    }

    return (1-left_25min/25) * 100;
  }
}


export function useValueRef(val) {
  const ref = useRef(val);
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const catSound = new Audio(catSoundPath);
const bellSound = new Audio(bellSoundPath);

function LeftArc(props){ // progress <- [0, 100]
  const {width, height, progress} = props;
  // progress[0, 100] -> startRad[0, PI]
  const startRad  = progress / 100 * 2 * Math.PI;
  const endRad = 0;
  const rx = width/2*0.9;
  const ry = width/2*0.9;

  const startPointX = width/2 + rx * Math.cos(startRad);
  const startPointY = height/2 + ry * Math.sin(startRad);

  const endPointX = width/2 + rx * Math.cos(endRad);
  const endPointY = height/2 + ry * Math.sin(endRad);

  let large_sweep = "1,1";

  if(startRad > Math.PI){
    large_sweep = "0,1";
  }
  else{
    large_sweep = "1,1";
  }



  return (
    <svg {...props} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} version="1.1" xmlns="http://www.w3.org/2000/svg">

      <path d={`M${startPointX},${startPointY}  A${rx},${ry} 0 ${large_sweep} ${endPointX},${endPointY}`} stroke="#fff" style={{opacity:.2}}  
        transform="rotate(-90)" transform-origin="50%" strokeWidth="30" fill="none"/>
    </svg>
  );
}

function App() {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState(WORKING);
  const [soundAllowed, setSoundAllowed] = useState(false);
  const [volume, setVolume] = useState(0.5);


  const refStatus = useValueRef(status);
  const refSoundAllowed = useValueRef(soundAllowed);


  const progress = calcProgress(time.getMinutes(), time.getSeconds());

  const playSound = async(status, vol = volume)=>{
    try{
      if(status === WORKING){
        bellSound.volume = vol;
        await bellSound.play();
        console.log(bellSound.volume);
      }
      else{
        catSound.volume = vol;
        await catSound.play();
        console.log(catSound.volume);
      }

      setSoundAllowed(true);
    }
    catch(e){
      console.log(e);
    }
  }

  const tick = useCallback(()=>{
    //いちいちrefで参照するのだるいなあ？
    const currentStatus = refStatus.current;
    const currentSoundAllowed = refSoundAllowed.current;

    //時間を取得して、分に応じて状態を変化
    const newTime = new Date();
    setTime(newTime);

    const minutes = newTime.getMinutes();
    const newStatus = determinStatus(minutes); //分から、今がWORKINGかRESTINGか判断

    setStatus(newStatus);


    if(currentStatus !== newStatus){

      console.log(currentSoundAllowed );
      if(currentSoundAllowed ){
        playSound(newStatus, volume)
      }
    }
  }, [refStatus,refSoundAllowed, volume]);
    

  useEffect(() => { //最初と最後のみ実行してタイマーをセット
    setTimeout(tick, 1000);

    return () => {
    };
  },[time, tick]);


  return (
    <div className={"p-timer-screen " + (status === WORKING ? "is-working":"is-resting")}>
      <div className="e-bg"></div>

      <div className="e-content">
        
        <LeftArc className="e-arc" width={800} height={800} progress={progress}/>

        <div className="e-date">{ time.getFullYear() }/{ time.getMonth()+1 }/{ time.getDate() }({ DAYS[time.getDay()] })</div>
        <div className="e-time">
          <span className="e-slot">{ time.getHours() }:</span>
          <span className="e-slot">{ time.getMinutes() }:</span>
          <span className="e-slot">{ time.getSeconds() }</span>
        </div>
        <div className={"e-status " + (status === WORKING ? "is-work":"is-break")}>
          <div className="e-icon">
            {
              status === WORKING ? 
                <FontAwesomeIcon size={"lg"} icon={faDesktop} />
                :
                <FontAwesomeIcon height="65" icon={faLeaf} />
            }
          </div>
          <div className="e-text">{statusToString(status)}</div>
          
        </div>
      </div>

      <div className="e-settings">
        <div className="e-icon" onClick={playSound}>
          {
            soundAllowed ? 
              <FontAwesomeIcon icon={faBell} />
              : 
              <FontAwesomeIcon icon={faBellSlash} />
          }
        </div>
        <div className="e-range">
          <input type="range" min="0" max="1" step=".1" onChange={e=>setVolume(e.target.value)}/>
        </div>
      </div>
    </div>
  );
}

export default App;
