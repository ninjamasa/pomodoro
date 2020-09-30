

export function calcLeftTime(minutes, seconds){
  //minutes += seconds/60;

  if((25 <= minutes && minutes < 30) || (55 <= minutes  && minutes < 60)){
    //resting
    let left_5min = 0;
    if((25 <= minutes && minutes < 30)){
      left_5min = 30 - minutes;
    }
    else{
      left_5min = 60 - minutes;
    }

    return {
      leftTime:left_5min,
      minutes: Math.floor(left_5min), 
      seconds: Math.floor((left_5min - Math.floor(left_5min))*60),
      max:5
    };
  }
  else{

    let left_25min = 0;
    if((0 <= minutes && minutes < 25)){
      left_25min = 25 - minutes;
    }
    else{
      left_25min = 55 - minutes;
    }

    return {
      leftTime:left_25min-seconds/60,
      minutes: left_25min + (seconds === 0 ? 1:0), 
      seconds: seconds === 0 ? 0 : 60 - seconds,
      max:25
    };
  }

}

export function calcProgress(minutes, seconds){
    const {leftTime, max} = calcLeftTime(minutes,seconds);

    return (1-leftTime/max) * 100;
}