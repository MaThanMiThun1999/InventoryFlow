import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleBarChart from '../../components/charts/BarChart';
import SimplePieChart from '../../components/charts/PieChart';
import useProductStore from '../../store/productStore';
import useEmployeeStore from '../../store/employeeStore';
import SimpleLineChart from '../../components/charts/LineChart';
import LoadingScreen from '../../components/base/LoadingScreen';

const AdminDashboard = () => {
  const { products, fetchProducts } = useProductStore();
  const { employees, fetchEmployees } = useEmployeeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts();
        await fetchEmployees();
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data for dashboard', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProducts, fetchEmployees]);

  if (loading) {
    return (
      <LoadingScreen
        message='Loading dashboard data...'
        spinnerSize='80px'
        backgroundColor='#F1F5F9'
        textColor='#007bff'
      />
    );
  }
  const productStatusData = [
    {
      name: 'Available',
      value: products?.filter((product) => product.status === 'available')
        .length,
    },
    {
      name: 'Out of Stock',
      value: products?.filter((product) => product.status === 'out-of-stock')
        .length,
    },
  ];
  const productCreationData = products?.map((product) => ({
    createdAt: product.createdAt.substring(0, 10),
  }));

  const employeeRolesData = employees?.reduce((acc, employee) => {
    const role = employee.role;
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']; // example colors

  const employeeRoleArray = Object.keys(employeeRolesData).map((key) => ({
    name: key,
    value: employeeRolesData[key],
  }));

  const productCountByDate = productCreationData?.reduce((acc, item) => {
    const date = item.createdAt;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const productCountData = Object.keys(productCountByDate)?.map((key) => ({
    createdAt: key,
    count: productCountByDate[key],
  }));

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-2'>Products</h2>
          <SimplePieChart
            data={productStatusData}
            dataKey='value'
            nameKey='name'
            colors={pieColors}
          />
          <ul className='list-disc pl-5'>
            <li>
              <Link
                to='/admin/products'
                className='text-blue-500 hover:underline'
              >
                View Products
              </Link>
            </li>
            <li>
              <Link
                to='/admin/products/create'
                className='text-green-500 hover:underline'
              >
                Add New Product
              </Link>
            </li>
          </ul>
        </div>

        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-2'>Employees</h2>
          <SimplePieChart
            data={employeeRoleArray}
            dataKey='value'
            nameKey='name'
            colors={pieColors}
          />
          <ul className='list-disc pl-5'>
            <li>
              <Link
                to='/admin/employees'
                className='text-blue-500 hover:underline'
              >
                View Employees
              </Link>
            </li>
            <li>
              <Link
                to='/admin/employees/create'
                className='text-green-500 hover:underline'
              >
                Add New Employee
              </Link>
            </li>
          </ul>
        </div>
        <div className='p-6 bg-white rounded-lg shadow-md md:col-span-2'>
          <h2 className='text-lg font-semibold mb-2'>Products Created</h2>
          <SimpleLineChart
            data={productCountData}
            lineColor='#82ca9d'
            dataKey='count'
            lineName='Products'
            xAxisLabel='createdAt'
            yAxisLabel='Count'
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
