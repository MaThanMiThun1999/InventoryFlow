import React, { useState } from 'react';
import useEmployeeStore from '../../store/employeeStore';
import ModernInput from '../../components/base/ModernInput';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EmployeeCreate = () => {
  const { createEmployee, isLoading } = useEmployeeStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('employee');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee({ name, email, password, phoneNumber, role });
      toast.success('Employee created successfully');
      navigate('/admin/employees');
      setName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setRole('employee');
    } catch (error) {
      console.error('Error creating employee', error);
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Create Employee</h1>
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
            id='employee-password'
            name='password'
            type='password'
            label='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <div className='flex justify-end'>
            <button
              type='submit'
              className='bg-blue-500 text-white p-2 rounded'
            >
              {isLoading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreate;
