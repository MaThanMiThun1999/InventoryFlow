import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SimpleBarChart = ({
  data,
  dataKey,
  barColor,
  barName,
  yAxisLabel,
  xAxisLabel,
}) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey={xAxisLabel} />
        <YAxis
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip />
        <Bar dataKey={dataKey} fill={barColor} name={barName} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
