import { LineChart } from '@mui/x-charts/LineChart';

const data = {
  times : [
    new Date("2024-05-12T07:03"),
    new Date("2024-05-12T08:03"),
    new Date("2024-05-12T09:03"),
    new Date("2024-05-12T10:03"),
    new Date("2024-05-12T11:03"),
    new Date("2024-05-12T12:03"),
    new Date("2024-05-12T13:03"),
    new Date("2024-05-12T14:03"),
    new Date("2024-05-12T15:03"),
    new Date("2024-05-12T16:03"),
    new Date("2024-05-12T16:20"),
    new Date("2024-05-12T16:38"),
    new Date("2024-05-12T17:06"),
    new Date("2024-05-12T17:08"),
    new Date("2024-05-12T17:23"),
    new Date("2024-05-12T17:58"),
    new Date("2024-05-12T18:15"),
    new Date("2024-05-12T18:27"),
    new Date("2024-05-12T18:30"),
    new Date("2024-05-12T18:43"),
],
  values : [30.1, 32.6, 28.9, 26.4, 33.7, 38.2, 34.5, 31.8, 27.6, 35.0, 30.1, 32.6, 28.9, 26.4, 33.7, 38.2, 34.5, 31.8, 27.6, 35.0],
}

const dateFormatter = (dateObj) => {
  // Get month (0-indexed) and day as zero-padded strings
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  // Combine month and day with a separator
  return `${month}-${day}`;
}

function App() {
  return (
    <div>
      <LineChart
        xAxis={[{
          data: data.times,
          scaleType: 'time',
          valueFormatter: dateFormatter
        }]}
        series={[
          {
            data: data.values,
            label: "temperature",
          },
        ]}
        width={800}
        height={500}
      />
    </div>
  );
}

export default App;
