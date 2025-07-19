import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { showErrorToast, showSuccessToast } from '../../src/utils/commonfunc/toast';
import { api } from '../../src/axios/axiosinstance';

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
};

const defaultValues: FormData = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  gender: '',
};

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  username: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
  gender: yup.string().required('Gender is required'),
});

const registerUser = async (data: FormData) => {
  console.log('Registering user:', data);
  const newUser = {
    username: data.username,
    email: data.email,
    password: data.password,
    gender: data.gender,
  };

  const response = await api.post('/api/user/add-user', newUser);
  return response.data;
};

function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data?.status) {
        showSuccessToast('Registration successful!');
        reset();
        navigate('/');
      } else if (data?.errors?.length) {
        data.errors.forEach((err: any) => {
          setError(err.path as keyof FormData, {
            type: 'server',
            message: err.msg,
          });
          showErrorToast(`${err.path}: ${err.msg}`);
        });
      } else {
        showErrorToast(data?.message || 'Registration failed');
      }
    },
    onError: (err: any) => {
      showErrorToast(err.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-sky-600">Register</h2>
          <p className="text-gray-500">Create your account</p>
        </div>

        <div className="space-y-5">
          <InputField
            label="Full Name"
            name="username"
            register={register}
            error={errors.username?.message}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email?.message}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register}
            error={errors.confirmPassword?.message}
          />
          <SelectField
            label="Gender"
            name="gender"
            register={register}
            error={errors.gender?.message}
            options={['Male', 'Female', 'Other']}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-6 w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-lg font-semibold transition"
        >
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-sky-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

const InputField = ({
  name,
  label,
  type = 'text',
  register,
  error,
}: {
  name: keyof FormData;
  label: string;
  type?: string;
  register: ReturnType<typeof useForm<FormData>>['register'];
  error?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      {...register(name)}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  name,
  label,
  register,
  error,
  options,
}: {
  name: keyof FormData;
  label: string;
  register: ReturnType<typeof useForm<FormData>>['register'];
  error?: string;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      {...register(name)}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default RegisterForm;
