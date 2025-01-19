import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../store/employeeStore';
import ModernInput from '../../components/base/ModernInput';
import FileDropzone from '../../components/global/FileDropzone';
import toast from 'react-hot-toast';
import LoadingScreen from '../../components/base/LoadingScreen';
const EmployeeEdit = () => {
  const { id } = useParams();
  const {
    employee,
    fetchEmployeeById,
    updateEmployee,
    updateEmployeeProfileImage,
    isLoading,
  } = useEmployeeStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEmployeeById(id);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch employee for edit', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchEmployeeById, id]);

  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setEmail(employee.email || '');
      setPhoneNumber(employee.phoneNumber || '');
      setRole(employee.role || 'employee');
    }
  }, [employee]);

  const handleFileChange = (files) => {
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(id, { name, email, phoneNumber, role });
      navigate(`/admin/employees/${id}`);
    } catch (error) {
      console.error('Failed to update employee', error);
    }
  };

  const handleUpdateProfileImage = async () => {
    if (files.length === 0) {
      return;
    }
    if (files.length > 1) {
      toast.error('You can only upload one file.');
      return;
    }

    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`profileImage`, file);
    });

    try {
      await updateEmployeeProfileImage(id, formData);
      navigate(`/admin/employees/${id}`);
    } catch (error) {
      console.error('error updating employee profile image:', error);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message='Please wait, Employee is loading...'
        spinnerSize='80px'
        backgroundColor='#F1F5F9'
        textColor='#007bff'
      />
    );
  }
  if (!employee) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Employee not found</h1>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Edit Employee</h1>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <ModernInput
            id='employee-name'
            name='name'
            type='text'
            label='Full Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <ModernInput
            id='employee-email'
            name='email'
            type='email'
            label='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <ModernInput
            id='employee-phone'
            name='phoneNumber'
            type='text'
            label='Phone Number'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <div className='flex items-center gap-4'>
            <label htmlFor='role' className='font-semibold'>
              Role:
            </label>
            <select
              id='role'
              className='bg-transparent text-gray-700 rounded-md  ring-2 ring-gray-400 focus:ring-sky-600 focus:outline-none'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value='employee'>Employee</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <FileDropzone onFilesSelected={handleFileChange} />

          <div className='flex justify-between items-center mt-4'>
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 rounded'
            >
              {isLoading ? 'Updating...' : 'Update Employee'}
            </button>
            {files.length > 0 && (
              <button
                onClick={handleUpdateProfileImage}
                type='button'
                className='bg-green-500 text-white p-2 rounded'
              >
                {isLoading ? 'Updating...' : 'Update Profile Image'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeEdit;
