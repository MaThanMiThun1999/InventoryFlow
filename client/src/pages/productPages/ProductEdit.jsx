import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductStore from '../../store/productStore';
import FileDropzone from '../../components/global/FileDropzone';
import ModernInput from '../../components/base/ModernInput';
import LocationPicker from '../../components/global/LocationPicker';
import toast from 'react-hot-toast';

const ProductEdit = () => {
  const { id } = useParams();
  const { product, fetchProductById, updateProduct } = useProductStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState('available');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProductById(id);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch product details', error);
        toast.error('Error fetching product details. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProductById, id]);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setStock(product.stock !== undefined ? String(product.stock) : '');
      setStatus(product.status || 'available');
      setLocation(product.location ? JSON.stringify(product.location) : '');
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Product name is required';
    if (!stock || isNaN(stock) || stock < 0)
      newErrors.stock = 'Valid stock is required';
    return newErrors;
  };

  const handleFileChange = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleLocationChange = (locationData) => {
    setLocation(JSON.stringify(locationData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formValidationErrors = validateForm();
    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('stock', stock);
    formData.append('status', status);
    if (location) {
      formData.append('location', location);
    }
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await updateProduct(id, formData);
      toast.success('Product updated successfully!');
      navigate(`/admin/products/${id}`);
    } catch (error) {
      console.error('Failed to update product', error);
      toast.error('Error updating product. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6'>Edit Product</h1>
      <div className='bg-white rounded-lg shadow p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Name Input */}
          <ModernInput
            id='product-name'
            name='name'
            type='text'
            label='Product Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errors.name}
          />

          {/* Description Input */}
          <ModernInput
            id='product-description'
            name='description'
            type='text'
            label='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Stock Input */}
          <ModernInput
            id='product-stock'
            name='stock'
            type='number'
            label='Stock'
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            error={errors.stock}
          />

          {/* Status Dropdown */}
          <div>
            <label
              htmlFor='product-status'
              className='block text-sm font-medium text-gray-700'
            >
              Status
            </label>
            <select
              id='product-status'
              name='status'
              className='mt-1 block w-full p-2 border-2 rounded-md border-[#6B7280] shadow-sm focus:border-blue-500 focus:ring-blue-500'
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value='available'>Available</option>
              <option value='out-of-stock'>Out of Stock</option>
            </select>
          </div>

          {/* Location Picker */}
          <div>
            <label
              htmlFor='location'
              className='block text-sm font-medium text-gray-700'
            >
              Location
            </label>
            <LocationPicker onLocationChange={handleLocationChange} />
          </div>

          {/* File Upload */}
          <div>
            <FileDropzone onFilesSelected={handleFileChange} />
            {files.length > 0 && (
              <div className='mt-4'>
                <h4 className='text-sm font-medium'>Selected Files:</h4>
                <ul className='list-disc pl-6'>
                  {files.map((file, index) => (
                    <li key={index} className='text-sm text-gray-600'>
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded'
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEdit;
