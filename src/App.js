import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io();

const dateFormatter = (dateObj) => {
  // Get month (0-indexed) and day as zero-padded strings
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  // Combine month and day with a separator
  return `${month}-${day}`;
}

function App() {
  const [temps, setTemps] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    socket.on("initialize", (data) => {
      console.log(data);
      data = data.sort((a, b) => b.createdAt - a.createdAt)
      setTemps(data.map((element) => element.temperature));
      setTimes(data.map((element) => new Date(element.createdAt)));
    });

    socket.on("data", (data) => {
      console.log(data);
      setTemps((pre) => [...pre, data.temperature]);
      setTimes((pre) => [...pre, new Date(data.createdAt)]);
    });

  }, []);

  return (
    <div>
      <LineChart
        xAxis={[{
          data: times,
          min: times[0],
          max: times[times.length-1],
          scaleType: 'time',
          valueFormatter: dateFormatter,
        }]}
        yAxis={[{
          min: 30,
          max: 40
        }]}
        series={[
          {
            data: temps,
            label: "temperature",
            showMark: false,
            curve: "natural"
          },
        ]}
        width={600}
        height={700}
      />
    </div>
  );
}

export default App;
