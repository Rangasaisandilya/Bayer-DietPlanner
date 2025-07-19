import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/userslice';
import type { RootState, AppDispatch } from '../../redux/store';
import { deleteCookie } from '../../utils/commonfunc/cookie';

import {
  PowerIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = (): void => {
    deleteCookie('userId');
    deleteCookie('token');
    deleteCookie('role');
    dispatch(clearUser());
    navigate('/');
  };

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 ${
      location.pathname === path
        ? 'bg-emerald-100 text-green-700 font-semibold shadow-sm'
        : 'text-gray-700 hover:bg-green-100 hover:text-green-600'
    }`;

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white/90 backdrop-blur-lg border-r border-gray-200 shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 text-2xl font-bold text-green-600 tracking-wide">
          Diet Planner
        </div>

        <nav className="flex flex-col p-4 space-y-3 text-base font-medium">
          <Link to="/userlist" onClick={onClose} className={linkClass('/userlist')}>
            
            Profile
          </Link>
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer rounded-lg transition-all duration-200 font-medium"
          >
            <PowerIcon className="w-5 h-5" />
            Logout
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />
      )}
    </>
  );
};

export default Sidebar;
