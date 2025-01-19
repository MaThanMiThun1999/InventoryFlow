import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SimplePieChart = ({ data, dataKey, nameKey, colors }) => {
  // Validate input to avoid potential runtime issues
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div>No data available to display</div>;
  }

  return (
    <div className='simple-pie-chart'>
      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx='50%'
            cy='50%'
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Default Props
SimplePieChart.defaultProps = {
  colors: ['#8884d8', '#82ca9d', '#ffc658'], // Default color palette
};

// PropTypes for validation
SimplePieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  dataKey: PropTypes.string.isRequired,
  nameKey: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default SimplePieChart;
