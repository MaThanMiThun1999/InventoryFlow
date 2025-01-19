import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import { formatCustomDate } from '../../utils/date';
import OptimizedImage from '../../components/base/OptimizedImage';
import LoadingScreen from '../../components/base/LoadingScreen';
import { useAuthStore } from '../../store/authStore';

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { product, fetchProductById, deleteProduct, isLoading } =
    useProductStore();
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProductById(id);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product details', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProductById, id]);

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      navigate('/admin/products');
    } catch (error) {
      console.error('Error deleting the product:', error);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <LoadingScreen
        message='Product details loading...'
        spinnerSize='80px'
        backgroundColor='#F1F5F9'
        textColor='#007bff'
      />
    );
  }

  if (!product) {
    return (
      <div className='text-center mt-20'>
        <p className='text-lg text-gray-700'>Product not found.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>{product.name}</h1>
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='flex flex-col md:flex-row'>
          {/* Carousel for Product Images */}
          <div className='md:w-1/2 md:pr-6'>
            {product?.images?.length > 1 ? (
              <div className='relative'>
                <OptimizedImage
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} Image`}
                  className='w-full h-96 object-cover rounded-lg'
                />
                {/* Carousel Controls */}
                <button
                  onClick={handlePreviousImage}
                  className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800'
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNextImage}
                  className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-800'
                >
                  &#8594;
                </button>
              </div>
            ) : (
              product.images.length === 1 && (
                <OptimizedImage
                  src={product.images[0]}
                  alt={`${product.name} Image`}
                  className='w-full h-96 object-cover rounded-lg'
                />
              )
            )}
          </div>

          {/* Product Details */}
          <div className='md:w-1/2'>
            <p className='text-gray-700 mb-4'>{product.description}</p>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Stock:</p>
              <p className='text-gray-600 text-lg font-bold'>{product.stock}</p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Status:</p>
              <p
                className={`${
                  product.status === 'available'
                    ? 'text-green-600'
                    : 'text-red-600'
                } text-lg uppercase font-bold`}
              >
                {product.status}
              </p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Created By:</p>
              <p className='text-gray-600 font-semibold uppercase'>{product?.createdBy?.name}</p>
              <p className='text-gray-600 text-sm'>
                {product?.createdBy?.email}
              </p>
            </div>
            <div className='mb-4'>
              <p className='font-semibold text-lg'>Created At:</p>
              <p className='text-gray-600'>
                {formatCustomDate(product.createdAt)}
              </p>
            </div>

            {product?.location?.coordinates && (
              <div className='mb-4'>
                <p className='font-semibold text-lg'>Location:</p>
                <p className='text-gray-600'>
                  Latitude: {product.location.coordinates[1]}, Longitude:{' '}
                  {product.location.coordinates[0]}
                </p>
              </div>
            )}

            {/* Admin Controls */}
            {user?.role === 'admin' && (
              <div className='flex justify-end gap-4 mt-6'>
                <button
                  onClick={handleDelete}
                  className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                  disabled={isLoading}
                >
                  {isLoading ? 'Deleting...' : 'Delete Product'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
