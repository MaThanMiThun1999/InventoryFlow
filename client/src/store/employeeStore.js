// src/store/employeeStore.js
import { create } from 'zustand';
import { postData, getData, putData, deleteData } from '../services/apiService';
import axiosInstance from '../services/axiosInstance';

const useEmployeeStore = create((set, get) => ({
  employees: [],
  employee: null,
  isLoading: false,
  error: null,
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getData('/employees');
      set({ employees: data.employees, isLoading: false });
    } catch (error) {
      set({ employees: [], isLoading: false, error: error.message });
      throw error;
    }
  },
  fetchEmployeeById: async (id) => {
    set({ isLoading: true, error: null, employee: null });
    try {
      const data = await getData(`/employees/${id}`);
      set({ employee: data.employee, isLoading: false });
    } catch (error) {
      set({ employee: null, isLoading: false, error: error.message });
      throw error;
    }
  },
  createEmployee: async (employeeData) => {
    set({ isLoading: true, error: null });
    try {
      await postData(
        '/employees',
        employeeData,
        'Employee created successfully'
      );
      set({ isLoading: false, message: 'Employee created successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  updateEmployee: async (id, employeeData) => {
    set({ isLoading: true, error: null });
    try {
      await putData(
        `/employees/${id}`,
        employeeData,
        'Employee updated successfully'
      );
      set({ isLoading: false, message: 'Employee updated successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  updateEmployeeProfileImage: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      // const updatedEmployee = await putData(
      //   `/employees/${id}/update-profile-image`,
      //   formData,
      //   'Employee profile image updated successfully'
      // );
      const updatedEmployee = await axiosInstance.put(
        `/employees/${id}/update-profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      set({
        employee: updatedEmployee,
        isLoading: false,
        message: 'Employee profile image updated successfully',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
  deleteEmployee: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteData(`/employees/${id}`, 'Employee deleted successfully');
      set({ isLoading: false, message: 'Employee deleted successfully' });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },
}));

export default useEmployeeStore;
