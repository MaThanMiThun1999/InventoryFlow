import React, { useEffect, useState } from 'react';
import useEmployeeStore from '../../store/employeeStore';
import { Link } from 'react-router-dom';
import { formatCustomDate } from '../../utils/date';
import LoadingScreen from '../../components/base/LoadingScreen';

const EmployeeList = () => {
  const { employees, fetchEmployees } = useEmployeeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchEmployees();
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch employees', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchEmployees]);

  if (loading) {
    return (
      <LoadingScreen
        message='Employees are loading...'
        spinnerSize='80px'
        backgroundColor='#F1F5F9'
        textColor='#007bff'
      />
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Employee List</h1>
        <p className='text-gray-700 text-xl mb-4'>No employees found.</p>
        <Link
          to='/admin/employees/create'
          className='text-green-500 hover:underline'
        >
          Add New Employee
        </Link>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Employee List</h1>
      <div className='overflow-x-auto bg-white rounded-lg shadow-lg border-t-2 border-neutral-500'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Profile
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Role
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Created At
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {employees.map((employee) => (
              <tr key={employee._id} className='hover:bg-gray-50'>
                {/* Profile Image */}
                <td className='px-6 py-4'>
                  <img
                    src={employee?.profileImage || '/default-profile.png'}
                    alt={employee.name}
                    className='w-10 h-10 rounded aspect-square object-cover'
                  />
                </td>

                {/* Name */}
                <td className='px-6 py-4'>
                  <div className='text-sm font-medium text-gray-900'>
                    {employee.name}
                  </div>
                </td>

                {/* Email */}
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-500'>{employee.email}</div>
                </td>

                {/* Role */}
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-900'>{employee.role}</div>
                </td>

                {/* Created At */}
                <td className='px-6 py-4'>
                  <div className='text-sm text-gray-500'>
                    {formatCustomDate(employee.createdAt)}
                  </div>
                </td>

                {/* Actions */}
                <td className='px-6 py-4 text-center'>
                  <div className='flex justify-center gap-4'>
                    <Link
                      to={`/admin/employees/${employee._id}`}
                      className='text-blue-500 hover:underline text-sm'
                    >
                      View
                    </Link>
                    <Link
                      to={`/admin/employees/edit/${employee._id}`}
                      className='text-green-500 hover:underline text-sm'
                    >
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
