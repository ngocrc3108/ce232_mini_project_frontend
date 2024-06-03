import { LineChart } from '@mui/x-charts/LineChart';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Stack from '@mui/material/Stack';

const socket = io();

const dateFormatter = (dateObj) => {
  // Get month (0-indexed) and day as zero-padded strings
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');
  
  // Combine month and day with a separator
  return `${month}-${day} ${hour}:${minute}`;
}

function App() {
  const [dataSet, setDataSet] = useState([]);
  const [minTemp, setMinTemp] = useState();
  const [maxTemp, setMaxTemp] = useState();
  const [minHumi, setMinHumi] = useState();
  const [maxHumi, setMaxHumi] = useState();

  useEffect(() => {
    socket.on("initialize", (data) => {
      data = data.map((e) => {return {...e, time: new Date(e.time)}});
      setMinTemp(Math.min(...data.map(e => e.temperature)));
      setMaxTemp(Math.max(...data.map(e => e.temperature)));
      setMinHumi(Math.min(...data.map(e => e.humidity)));
      setMaxHumi(Math.max(...data.map(e => e.humidity)));
      const step = parseInt(data.length / 70) || 1;
      console.log(step);
      var newData = [];
      for(var i = 0; i < data.length; i = i + step) {
        let accTemp = 0;
        let acchumi = 0;
        let accTime = 0;
        var j = i;
        for(; j < data.length && j < i + step; j++) {
          const accStep = data.length - i < step ? data.length - i : step;
          accTemp += data[j].temperature / accStep;
          acchumi += data[j].humidity / accStep;
          accTime += data[j].time.valueOf() / accStep;
        }
        newData.push({temperature: accTemp, humidity: acchumi, time: new Date(accTime)});
      }
      console.log(newData);
      setDataSet(newData);
    });

    socket.on("data", (data) => {
      console.log(data);
      console.log(typeof data.temperature)
      if(data.temperature < minTemp)
        setMinTemp(data.temperature);
      if(data.temperature > maxTemp)
        setMaxTemp(data.temperature);
      if(data.humidity < minHumi)
        setMinHumi(data.humidity);
      if(data.humidity > maxHumi)
        setMaxHumi(data.humidity);
      setDataSet((pre) => [...pre, {...data, time: new Date(data.time)}]);
    });

  }, []);

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <LineChart
          dataset={dataSet}
          xAxis={[{
            dataKey: 'time',
            min: dataSet[0]?.time,
            max: dataSet[dataSet.length-1]?.time,
            scaleType: 'time',
            valueFormatter: dateFormatter,
          }]}
          yAxis={[{
            min: minTemp - 0.5,
            max: maxTemp + 0.5,
          }]}
          series={[
            {
              dataKey: 'temperature',
              label: "temperature",
              showMark: false,
              curve: "catmullRom",
              area: true,
            },
          ]}
          width={600}
          height={700}
        />
        <LineChart
          dataset={dataSet}
          xAxis={[{
            dataKey: 'time',
            min: dataSet[0]?.time,
            max: dataSet[dataSet.length-1]?.time,
            scaleType: 'time',
            valueFormatter: dateFormatter,
          }]}
          yAxis={[{
            min: minHumi - 10,
            max: maxHumi + 10,
          }]}
          series={[
            {
              dataKey: 'humidity',
              label: "humidity",
              showMark: false,
              curve: "catmullRom",
              area: true,
              color: 'lightblue',
            },
          ]}
          width={600}
          height={700}
        />
      </Stack>
    </div>
  );
}

export default App;
