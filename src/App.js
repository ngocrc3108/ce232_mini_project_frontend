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

  useEffect(() => {
    socket.on("initialize", (data) => {
      data = data.map((e) => {return {...e, createdAt: new Date(e.createdAt)}});
      setDataSet(data);
    });

    socket.on("data", (data) => {
      console.log(data);
      setDataSet((pre) => [...pre, {...data, createdAt: new Date(data.createdAt)}]);
    });

  }, []);

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <LineChart
          dataset={dataSet}
          xAxis={[{
            dataKey: 'createdAt',
            min: dataSet[0]?.createdAt,
            max: dataSet[dataSet.length-1]?.createdAt,
            scaleType: 'time',
            valueFormatter: dateFormatter,
          }]}
          yAxis={[{
            min: 30,
            max: 40
          }]}
          series={[
            {
              dataKey: 'temperature',
              label: "temperature",
              showMark: false,
              curve: "natural",
              area: true,
            },
          ]}
          width={600}
          height={700}
        />
        <LineChart
          dataset={dataSet}
          xAxis={[{
            dataKey: 'createdAt',
            min: dataSet[0]?.createdAt,
            max: dataSet[dataSet.length-1]?.createdAt,
            scaleType: 'time',
            valueFormatter: dateFormatter,
          }]}
          yAxis={[{
            // min: 30,
            // max: 40
          }]}
          series={[
            {
              dataKey: 'humidity',
              label: "humidity",
              showMark: false,
              curve: "natural",
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
