import '../App.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../axios/axiosinstance';
import { setCookie } from '../utils/commonfunc/cookie';
import { showErrorToast, showSuccessToast } from '../utils/commonfunc/toast';
import { useAppDispatch } from '../redux/hooks';
import { setUser, UserState } from '../redux/userslice';
import { Link } from 'react-router-dom';

type LoginFormData = {
  email: string;
  password: string;
};

interface AuthResponse {
  token: string;
  user: UserState;
  message: string;
}

interface APIError {
  message?: string;
  errors?: Record<string, string>[];
  status?: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const result = await api.post<AuthResponse>('/api/user/login', data) as {
        success: boolean;
        data?: AuthResponse;
        error?: APIError | string;
      };

      if (result.success && result.data) {
        const { token, user, message } = result.data;

        if (!token || !user) {
          showErrorToast("Invalid response from server.");
          return;
        }

        showSuccessToast(message || "Login successful!");
        setCookie('token', token, 7);
        setCookie('userId', user._id, 7);
        setCookie('role', user.role, 7);
        dispatch(setUser(user));
        navigate('/home');
      } else {
        const errorMessage = result.data?.message || "Login failed. Please try again.";
        showErrorToast(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      showErrorToast("Something went wrong. Please try again later.");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-lg">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="https://www.bayer.com/themes/custom/bayer_cpa/logo.svg" // Replace with actual path or import
          alt="Bayer Logo"
          className="h-20"
        />
      </div>

      {/* Login Title */}
      <h2 className="text-3xl font-bold text-center text-sky-600 mb-6">Login</h2>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-lime-500 hover:bg-lime-600 text-white py-3 rounded-md font-semibold transition"
        >
          Login
        </button>
      </form>

      {/* Links */}
      <div className="mt-6 text-center text-sm">
        <Link to="/forgot-password" className="text-sky-600 hover:underline block">
          Forgot Password?
        </Link>
        <Link to="/signup" className="text-sky-600 hover:underline block mt-2">
          New User? Register here
        </Link>
      </div>
    </div>
  </div>
);

};

export default Login;
