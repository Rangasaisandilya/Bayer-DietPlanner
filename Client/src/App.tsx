import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './routes/ProtectedRoute';
import Loader from './component/Loader/Loader';

const Login = lazy(() => import('./pages/login'));
const Home = lazy(() => import('./pages/home'));
const Userlist = lazy(() => import('./pages/userlist'));
const Register = lazy(() => import('./pages/register'));
const DietPlanner= lazy(() => import('./pages/DietPlannerCard'));
function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dietPlanner" element={<DietPlanner/>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/userlist" element={<ProtectedRoute><Userlist /></ProtectedRoute>} />     
        </Routes>
    </Suspense>
  );
}
export default App;
