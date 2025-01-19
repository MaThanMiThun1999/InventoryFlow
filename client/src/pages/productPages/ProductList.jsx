import React, { useEffect, useState } from 'react';
import useProductStore from '../../store/productStore';
import { Link } from 'react-router-dom';
import { formatCustomDate } from '../../utils/date';
import OptimizedImage from '../../components/base/OptimizedImage';
import { useAuthStore } from '../../store/authStore';
import LoadingScreen from '../../components/base/LoadingScreen';

const ProductList = () => {
  const { products, fetchProducts } = useProductStore();
  const { user } = useAuthStore();
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
        message='Products are loading...'
        spinnerSize='80px'
        backgroundColor='#F1F5F9'
        textColor='#007bff'
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Product List</h1>
        <p className='text-gray-700 text-xl mb-4'>No products found.</p>
        <Link
          to='/admin/products/create'
          className='text-green-500 hover:underline'
        >
          Add New Product
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Product List</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {products?.map((product) => (
          <div
            key={product._id}
            className='bg-white rounded-lg shadow-md overflow-hidden'
          >
            {product?.images.length > 0 ? (
              <OptimizedImage
                src={product?.images[0]}
                alt={product.name}
                className='h-48 w-full object-cover'
              />
            ) : (
              <div className='h-48 w-full bg-gray-300'></div>
            )}
            <div className='p-4'>
              <h2 className='text-lg font-semibold mb-2'>{product.name}</h2>
              <p className='text-gray-700 mb-2'>
                {product.description && product.description.length > 25
                  ? `${product.description.substring(0, 25)}...`
                  : product.description}
              </p>

              <div className='flex justify-between items-center mb-2'>
                <span className='text-gray-500'>Stock: {product.stock}</span>
                <span className='text-gray-500'>Status: {product.status}</span>
              </div>

              <div className='flex justify-between items-center text-xs text-gray-500'>
                <p>Created By: {product?.createdBy?.name}</p>
              </div>
              <div className='flex justify-between items-center text-xs text-gray-500'>
                <p>Created At: {formatCustomDate(product.createdAt)}</p>
              </div>

              <div className='mt-4 flex justify-between'>
                <Link
                  to={
                    user?.role === 'admin'
                      ? `/admin/products/${product._id}`
                      : `/products/${product._id}`
                  }
                  className='text-blue-500 hover:underline'
                >
                  View Details
                </Link>

                {/* Edit Product */}
                {user?.role === 'admin' && (
                  <Link
                    to={`/admin/products/edit/${product._id}`}
                    className='text-green-500 hover:underline'
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
