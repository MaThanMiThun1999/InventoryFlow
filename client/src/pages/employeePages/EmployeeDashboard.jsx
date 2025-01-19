import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimplePieChart from '../../components/charts/PieChart';
import useProductStore from '../../store/productStore';
import LoadingScreen from '../../components/base/LoadingScreen';
import ProductList from '../productPages/ProductList';

const EmployeeDashboard = () => {
  const { products, fetchProducts } = useProductStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProducts();
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchProducts]);

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

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Employee Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Inventory Chart Section */}
        <div className='p-6 bg-white rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-2'>Inventory</h2>
          <SimplePieChart
            data={productStatusData}
            dataKey='value'
            nameKey='name'
            colors={pieColors}
          />
          <ul className='list-disc pl-5'>
            <li>
              <Link to='/products' className='text-blue-500 hover:underline'>
                View Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Product List Section */}
        <div className='p-6 bg-white col-span-2 rounded-lg shadow-md'>
          <h2 className='text-lg font-semibold mb-2'>Product List</h2>
          <div className='hidden md:block max-h-[400px] overflow-y-scroll'>
            {/* Table for larger screens */}
            <table className='w-full border-collapse border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border border-gray-300 px-4 py-2'>Name</th>
                  <th className='border border-gray-300 px-4 py-2'>
                    Description
                  </th>
                  <th className='border border-gray-300 px-4 py-2'>Stock</th>
                  <th className='border border-gray-300 px-4 py-2'>Status</th>
                  <th className='border border-gray-300 px-4 py-2'>Image</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className='hover:bg-gray-50'>
                    <td className='border border-gray-300 px-4 py-2'>
                      {product.name}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {product.description.length > 40
                        ? `${product.description.substring(0, 40)}...`
                        : product.description}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      {product.stock}
                    </td>
                    <td className='border border-gray-300 px-4 py-2 capitalize'>
                      {product.status.replace('-', ' ')}
                    </td>
                    <td className='border border-gray-300 px-4 py-2'>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className='w-12 h-12 object-cover rounded'
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='block md:hidden max-h-[300px] overflow-y-scroll'>
            {/* Cards for mobile screens */}
            {products.map((product) => (
              <div
                key={product._id}
                className='mb-4 p-4 border border-gray-300 rounded-lg shadow-sm'
              >
                <div className='flex items-center mb-2'>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded mr-4'
                  />
                  <h3 className='text-lg font-semibold'>{product.name}</h3>
                </div>
                <p className='text-sm text-gray-700 mb-1'>
                  <strong>Description:</strong> {product.description.length > 130 ? `${product.description.substring(0, 130)}...` : product.description}
                </p>
                <p className='text-sm text-gray-700 mb-1'>
                  <strong>Stock:</strong> {product.stock}
                </p>
                <p className='text-sm text-gray-700 mb-1 capitalize'>
                  <strong>Status:</strong> {product.status.replace('-', ' ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProductList />
    </div>
  );
};

export default EmployeeDashboard;
