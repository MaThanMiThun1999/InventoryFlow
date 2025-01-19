import React, { useState } from 'react';
import useProductStore from '../../store/productStore';
import FileDropzone from '../../components/global/FileDropzone';
import ModernInput from '../../components/base/ModernInput';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '../../components/global/LocationPicker';
import toast from 'react-hot-toast';

const ProductCreate = () => {
  const { createProduct, isLoading } = useProductStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!stock || isNaN(stock) || stock <= 0)
      newErrors.stock = 'Valid stock is required';
    if (files.length === 0) newErrors.files = 'At least one image is required';
    return newErrors;
  };

  const handleFileChange = (selectedFiles) => {
    setFiles(selectedFiles);
    if (errors.files) {
      setErrors((prevErrors) => ({ ...prevErrors, files: '' }));
    }
  };

  const handleLocationChange = (locationData) => {
    setLocation(JSON.stringify(locationData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(
        validationErrors.name ||
          validationErrors.stock ||
          validationErrors.files ||
          'Please fix the errors in the form.'
      );
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('stock', stock);
    if (location) {
      formData.append('location', location);
    }
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/admin/products');
      setName('');
      setDescription('');
      setStock('');
      setLocation('');
      setFiles([]);
    } catch (error) {
      console.error('Error creating product', error);
      toast.error('Failed to create product. Please try again.');
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6'>Create Product</h1>
      <div className='bg-white rounded-lg shadow p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Product Name */}
          <ModernInput
            id='product-name'
            name='name'
            type='text'
            label='Product Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          {/* Product Description */}
          <ModernInput
            id='product-description'
            name='description'
            type='text'
            label='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Product Stock */}
          <ModernInput
            id='product-stock'
            name='stock'
            type='number'
            label='Stock'
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={errors.stock}
            required
          />

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

          {/* File Dropzone */}
          <div>
            <FileDropzone onFilesSelected={handleFileChange} />
            {errors.files && (
              <p className='text-red-500 text-sm mt-2'>{errors.files}</p>
            )}
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
              className={`bg-blue-500 text-white font-medium py-2 px-4 rounded 
                ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-600'
                }`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;
