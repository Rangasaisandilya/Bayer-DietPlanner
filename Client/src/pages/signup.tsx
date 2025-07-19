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
  contactNumber: string;
  password: string;
  confirmPassword: string;
  role: string;
  gender: string;
  address: string;
};

type ApiResponse = {
  Status?: boolean;
  status?: boolean;
  message?: string;
  msg?: string;
  errors?: { msg: string; path: string }[];
};

const defaultValues: FormData = {
  username: '',
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: '',
  role: '',
  gender: '',
  address: '',
};

const schema: yup.ObjectSchema<FormData> = yup.object().shape({
  username: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  contactNumber: yup.string().required('Contact number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm your password'),
  role: yup.string().required('Role is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
});

const registerUser = async (data: FormData): Promise<ApiResponse> => {
  const [shiftStart, shiftEnd] = ['09:00', '17:00'];

  const newUser = {
    username: data.username,
    email: data.email,
    contactNumber: data.contactNumber,
    password: data.password,
    role: data.role,
    shiftStart,
    shiftEnd,
    gender: data.gender,
    address: data.address,
  };

  const response = await api.post<ApiResponse>('/api/user/add-user', newUser);
  if (!response.data) throw new Error('No response data received from server');
  return response.data;
};

const mapBackendErrors = (
  errors: { msg: string; path: string }[],
  setError: ReturnType<typeof useForm<FormData>>['setError']
) => {
  errors.forEach((err) => {
    setError(err.path as keyof FormData, {
      type: 'server',
      message: err.msg,
    });
  });
};

function RegisterForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const mutation = useMutation<ApiResponse, Error, FormData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data?.status) {
        showSuccessToast('Registration successful!');
        reset();
        navigate('/');
      } else if (data.message === 'Internal server error') {
        showErrorToast('Something went wrong');
      } else if (data?.errors?.length) {
        mapBackendErrors(data.errors, setError);
        data.errors.forEach((err) => showErrorToast(`${err.path}: ${err.msg}`));
      } else {
        showErrorToast(data?.message || 'Registration failed');
      }
    },
    onError: (error) => {
      showErrorToast(error.message || 'Something went wrong');
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-gray-200"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-lime-500">Register</h2>
          <p className="text-gray-500">Create your account</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          <InputField label="Full Name" name="username" register={register} error={errors.username?.message} />
          <InputField label="Email" name="email" type="email" register={register} error={errors.email?.message} />
          <InputField label="Contact Number" name="contactNumber" register={register} error={errors.contactNumber?.message} />
          <InputField label="Password" name="password" type="password" register={register} error={errors.password?.message} />
          <InputField label="Confirm Password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword?.message} />
          <InputField label="Address" name="address" register={register} error={errors.address?.message} />
          <SelectField label="Role" name="role" register={register} error={errors.role?.message} options={['Patient']} />
          <SelectField label="Gender" name="gender" register={register} error={errors.gender?.message} options={['Male', 'Female', 'Other']} />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-8 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          {mutation.isPending ? 'Registering...' : 'Register'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

// Reusable Input Field
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
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Select Field
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
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
