import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SimpleLineChart = ({
  data,
  dataKey,
  lineName,
  lineColor,
  yAxisLabel,
  xAxisLabel,
}) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey={xAxisLabel} />
        <YAxis
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey={dataKey}
          stroke={lineColor}
          name={lineName}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleLineChart;
