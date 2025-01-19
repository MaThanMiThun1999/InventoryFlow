import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../store/employeeStore';
import { formatCustomDate } from '../../utils/date';
import OptimizedImage from '../../components/base/OptimizedImage';
import { Trash2 } from 'lucide-react';
import LoadingScreen from '../../components/base/LoadingScreen';
import defaultProfileImage from '../../assets/img/defaultProfileImage.webp';

const EmployeeDetails = () => {
  const { id } = useParams();
  const { employee, fetchEmployeeById, deleteEmployee, isLoading } =
    useEmployeeStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEmployeeById(id);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch employee details', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchEmployeeById, id]);

  const handleDelete = async () => {
    try {
      await deleteEmployee(id);
      navigate('/admin/employees');
    } catch (error) {
      console.error('Error deleting the employee', error);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message='Loading employee details...'
        spinnerSize='80px'
        backgroundColor='#F1F5F9'
        textColor='#007bff'
      />
    );
  }

  if (!employee) {
    return (
      <div className='container mx-auto p-4'>
        <p className='text-gray-700 text-xl'>Employee not found.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6 text-gray-800'>{employee.name}</h1>
      <div className='bg-white shadow-lg rounded-lg overflow-hidden border-t-2 border-neutral-500'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row items-center p-6 bg-gray-200/90 border-b'>
          <div className='md:w-1/3 mb-4 md:mb-0'>
            <OptimizedImage
              src={employee?.profileImage || defaultProfileImage}
              alt={employee.name}
              className='w-40 h-40 rounded aspect-square object-cover mx-auto'
            />
          </div>
          <div className='md:w-2/3 md:pl-6 text-center md:text-left'>
            <h2 className='text-2xl font-semibold text-gray-800'>
              {employee.name}
            </h2>
            <p className='text-gray-600'>{employee.email}</p>
            <p className='text-gray-600'>{employee.phoneNumber || 'N/A'}</p>
            <p className='text-gray-600 font-semibold mt-2'>
              Role:{' '}
              <span className='text-gray-800 uppercase'>{employee.role}</span>
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className='p-6'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>
            Employee Details
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Email */}
            <div>
              <p className='font-medium text-gray-700'>Email</p>
              <p className='text-gray-600'>{employee.email}</p>
            </div>

            {/* Phone Number */}
            <div>
              <p className='font-medium text-gray-700'>Phone Number</p>
              <p className='text-gray-600'>{employee.phoneNumber || 'N/A'}</p>
            </div>

            {/* Role */}
            <div>
              <p className='font-medium text-gray-700'>Role</p>
              <p className='text-gray-600'>{employee.role}</p>
            </div>

            {/* Created At */}
            <div>
              <p className='font-medium text-gray-700'>Created At</p>
              <p className='text-gray-600'>
                {formatCustomDate(employee.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='bg-gray-100 p-4 flex justify-end gap-4'>
          <button
            onClick={handleDelete}
            className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition'
          >
            <Trash2 size={16} />
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
