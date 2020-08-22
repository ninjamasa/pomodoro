import React, {useState, useEffect, useRef} from 'react';
import './App.scss';

const STATUSES = [0,1];
const [WORKING, RESTING] = STATUSES;

function statusToString(status){
  if(status == WORKING){
    return  "Working Time";
  }
  else if(status == RESTING){
    return  "Rest Time";
  }
  else{
    return null;
  }
}

function determinStatus(minutes){
  return minutes % 2  == 0 ? RESTING : WORKING;
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

export function useValueRef(val) {
  const ref = React.useRef(val);
  React.useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const catCrySound = new Audio("./cat-cry1.mp3");
const bellSound = new Audio("./bell1.mp3");

function App() {
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState(WORKING);

  const refStatus = useValueRef(status);

  const playSound = ()=>{
    try{

      catCrySound.play();
    }
    catch(e){

      console.log("fuck you");
      console.log(e);
    }
  }

  useEffect(() => { //最初と最後のみ実行してタイマーをセット
    const timer = setInterval(()=>{
      const currentStatus = refStatus.current;
      //時間を取得して、分に応じて状態を変化
      const newTime = new Date();
      setTime(newTime);

      const minutes = newTime.getMinutes();
      const newStatus = determinStatus(minutes); //分から、今がWORKINGかRESTINGか判断

      setStatus(newStatus);

      if(currentStatus != newStatus){
        if(newStatus == WORKING){
          console.log("changed to working");
          playSound()
        }
        else if(newStatus == RESTING){
          console.log("changed to resting");
          playSound()
        }
      }

    },1000);
    return () => {
      clearInterval(timer);
    };
  },[]);



  return (
    <div className={"p-timer-screen " + (status === WORKING ? "is-working":"is-resting")}>
      <div className="e-bg"></div>

      <div className="e-content">
        <div className="e-date">{ time.getFullYear() }/{ time.getMonth()+1 }/{ time.getDate() }({ DAYS[time.getDay()] })</div>
        <div className="e-time">
          <span className="e-slot">{ time.getHours() }:</span>
          <span className="e-slot">{ time.getMinutes() }:</span>
          <span className="e-slot">{ time.getSeconds() }</span>
        </div>
        <div className="e-slot">{statusToString(status)}</div>
        <div><button onTouchStart={playSound}>音声を許可</button></div>
      </div>
    </div>
  );
}

export default App;
