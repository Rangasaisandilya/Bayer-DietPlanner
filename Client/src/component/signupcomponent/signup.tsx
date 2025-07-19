/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { type RootState } from '../../redux/store';
import { showErrorToast, showSuccessToast } from '../../utils/commonfunc/toast';
import { api } from '../../axios/axiosinstance';
type ModeType = 'add' | 'edit' | 'view';

type FormData = {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  gender?:string;
};

type UpdateFormData = Omit<FormData, 'confirmPassword'> & {
  _id: string;
  shiftStart?: string;
  shiftEnd?: string;
};

type ApiResponse = {
  status: boolean;
  message?: string;
  errors?: { msg: string; path: string }[];
};



const schema = (isProfile: boolean): yup.ObjectSchema<FormData> => {
  console.log('isProfile:', isProfile);

  return yup.object().shape({
    username: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    gender: yup.string().optional(),

    password: yup.string().when('$isAddMode', {
      is: true,
      then: (schema) => schema.min(6, 'Password must be at least 6 characters').required('Password is required'),
      otherwise: (schema) => schema.notRequired(),
    }),

    confirmPassword: yup.string().when('password', {
      is: (password: string | undefined) => !!password,
      then: (schema) =>
        schema
          .oneOf([yup.ref('password')], 'Passwords must match')
          .required('Confirm Password is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};


const updateUser = async (data: UpdateFormData): Promise<ApiResponse> => {
  const formData = new FormData();

  if (data._id !== undefined) formData.append('id', data._id);
  if (data.username !== undefined) formData.append('username', data.username);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.password !== undefined) formData.append('password', data.password);
  if (data.gender !== undefined) formData.append('gender', data.gender);



  const response = await api.post<ApiResponse>('/api/user/update-user', formData);
  if (!response.data) throw new Error('No response data received from server');
  return response.data;
};

const createUser = async (data: Omit<FormData, 'confirmPassword'>): Promise<ApiResponse> => {
  const formData = new FormData();

  if (data.username !== undefined) formData.append('username', data.username);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.password !== undefined) formData.append('password', data.password);
  

  const response = await api.post<ApiResponse>('/api/user/add-user', formData);
  if (!response.data) throw new Error('No response data received from server');

  return response.data;
};


const RegisterFormModal = ({
  isOpen,
  onClose,
  user,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UpdateFormData;
  mode: ModeType;
}) => {
  const reduxUser = useSelector((state: RootState) => state.user);
  console.log("mode === 'add'", mode === 'add')
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema(mode == 'add' ? true : false)),
    context: { isAddMode: mode === 'add' },
  });

  useEffect(() => {
    if (user && mode !== 'add') {
      reset({
        username: user.username,
        password: '',
        confirmPassword: '',
        gender: user.gender,

      });
    } else {
      reset({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
      });
    }
  }, [user, mode, reset]);

  const mutation = useMutation<ApiResponse, Error, FormData>({
    mutationFn: (data) => {
      const { _confirmPassword, ...formData } = data;
      return mode === 'add'
        ? createUser(formData)
        : updateUser({ ...formData, _id: user?._id ?? reduxUser._id });
    },
    onSuccess: (data) => {
      if (data.status) {
        showSuccessToast(mode === 'add' ? 'User created!' : 'Update successful!');
        reset();
        onClose();
      } else if (data.errors?.length) {
        data.errors.forEach((err) => {
          setError(err.path as keyof FormData, {
            type: 'server',
            message: err.msg,
          });
          showErrorToast(`${err.path}: ${err.msg}`);
        });
      } else {
        showErrorToast(data.message || 'Operation failed');
      }
    },
    onError: (error) => {
      showErrorToast(error.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: FormData) => {
    if (mode !== 'view') {
      mutation.mutate(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl">
          ×
        </button>
        <h2 className="text-3xl font-bold text-center text-lime-500 mb-6">
          {mode === 'view' ? 'View Profile' : mode === 'edit' ? 'Update Profile' : 'Register User'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Input fields */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">name:</label>
            <input
              type="text"
              id="username"
              {...register('username')}
              disabled={mode === 'view'}
              className={`w-full p-2 border ${errors.username? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              {...register('email')}
              disabled={mode === 'view'}
              className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
         
          {mode !== 'view' && (
            <>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Password:</label>
                <input
                  type="password"
                  id="password"
                  {...register('password')}
                  className={`w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  className={`w-full p-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
              </div>
              <div className="space-y-2">
                {
                  mode !== 'add' &&(
                         <><label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender:</label><select
                      id="gender"
                      {...register('gender')}
                      className={`w-full p-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select></>
                  )
                }
       
            {errors.gender && <p className="text-red-500 text-xs">{errors.gender.message}</p>}
          </div>
            </>
          )}
         
          {mode !== 'view' && (
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-400 hover:bg-lime-600"
              >
                {mode === 'edit' ? 'Update Profile' : 'Register User'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterFormModal;