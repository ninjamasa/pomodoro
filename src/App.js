import React, {useState, useCallback,  useEffect, useRef} from 'react';
import './App.scss';

import catSoundPath from "./cat.mp3";
import bellSoundPath from "./bell.mp3";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop, faLeaf, faBell, faBellSlash} from "@fortawesome/free-solid-svg-icons";

import LeftArc from './LeftArc.js';
import {calcLeftTime, calcProgress} from './leftTime.js';

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
  //return minutes % 2  === 0 ? RESTING : WORKING;
  ///*
  if(25 <= minutes  && minutes < 30){
    return RESTING;
  }
  else if(55 <= minutes  && minutes < 60){
    return RESTING;
  }
  else{
    return WORKING;
  }
  //*/
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


function App() {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState(WORKING);
  const [soundAllowed, setSoundAllowed] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [leftTimeView, setLeftTimeView ] = useState(false);


  const refStatus = useValueRef(status);
  const refSoundAllowed = useValueRef(soundAllowed);


  const leftTime = calcLeftTime(time.getMinutes(), time.getSeconds())
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

        <div className="e-time" onClick={e=>setLeftTimeView(!leftTimeView)}>
          {
            !leftTimeView ? 
            <>
              <span className="e-slot">{ time.getHours() }:</span>
              <span className="e-slot">{ time.getMinutes() }:</span>
              <span className="e-slot">{ time.getSeconds() }</span>
            </>
            :
            <>
              <span className="e-slot">{ leftTime.minutes }:</span>
              <span className="e-slot">{ leftTime.seconds }</span>
            </>
          }
        </div>
        <div className={"e-status " + (status === WORKING ? "is-work":"is-break")}>
          <div className="e-icon">
            {
              status === WORKING ? 
                <FontAwesomeIcon icon={faDesktop} />
                :
                <FontAwesomeIcon icon={faLeaf} />
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
