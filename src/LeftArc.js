import React from 'react';

export default function LeftArc(props){ // progress <- [0, 100]
  const {width, height, progress} = props;
  // progress[0, 100] -> startRad[0, PI]
  const startRad  = progress / 100 * 2 * Math.PI;
  const endRad = 0;
  const rx = width/2*0.9;
  const ry = height/2*0.9;

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


  const lines = [0, 1, 2, 3, 4]
    .map(index => 2 * Math.PI / 5 * index - Math.PI/2)
    .map(rad => {
      const x = width/2 + (rx-15)*Math.cos(rad);
      const y = height/2 + (ry-15)*Math.sin(rad);
      const x2 =   width/2 + (rx+15)*Math.cos(rad);
      const y2 =   height/2 + (ry+15)*Math.sin(rad);

      return {x, y, x2, y2};
    })
    .map(points=>{
      return (
        <path d={`M ${points.x} ${points.y} L ${points.x2} ${points.y2}`} stroke="#fff" style={{opacity:.5}}  
          strokeWidth="2" fill="none"/>
      )

    })

  return (
    <svg {...props} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} version="1.1" xmlns="http://www.w3.org/2000/svg">

      <path d={`M${startPointX},${startPointY}  A${rx},${ry} 0 ${large_sweep} ${endPointX},${endPointY}`} stroke="#fff" style={{opacity:.2}}  
        transform="rotate(-90)" transform-origin="50%" strokeWidth="30" fill="none"/>
      { lines }
    </svg>
  );
}