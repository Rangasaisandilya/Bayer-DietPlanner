/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsers } from '../axios/useraxios';
import { RootState } from '../redux/store';
import RegisterFormModal from '../component/signupcomponent/signup';

import { api } from '../axios/axiosinstance';

interface IUser {
  _id: string;
  username: string;
  email: string;
  contactNumber: string;
  role: string;
  shiftStart: string;
  shiftEnd: string;
  address: string;
  gender: string;
  isAvailable: boolean;
  profilePicture?: File | null |string ;
  lastUpdated: string;
  deleted?: boolean;
  departmentId:{_id:string,name:string}
}
export default function UserList() {
  const reduxUser = useSelector((state: RootState) => state.user);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);



  






  return (
    <>
        <div className="max-w-4xl mx-auto p-6 pt-7bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-lime-500 mb-6 border-b pb-2 text-center">My Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
            <div><span className="font-semibold">Name:</span> {reduxUser.username}</div>
            <div><span className="font-semibold">Email:</span> {reduxUser.email}</div>
            <div><span className="font-semibold">Gender:</span> {reduxUser.gender}</div> 
             <div><span className="font-semibold">Age:</span> {reduxUser.age}</div> 
              <div><span className="font-semibold">Height:</span> {reduxUser.height}</div>
            <div><span className="font-semibold">Weight:</span> {reduxUser.weight}</div> 
            {/* <div><span className="font-semibold">Joining Date:</span> {moment(reduxUser.createdAt).format('DD MMM YYYY, hh:mm A')}</div> */}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setSelectedUser({
                  ...reduxUser,
                  lastUpdated: reduxUser.lastUpdated || '',
                  gender: reduxUser.gender || '',
                  isAvailable: reduxUser.isAvailable ?? true,
                  profilePicture: reduxUser.profilePicture || null,
                  deleted: reduxUser.deleted ?? false,
                  address: reduxUser.address || '',
                  shiftStart: reduxUser.shiftStart || '',
                  shiftEnd: reduxUser.shiftEnd || '',
                  contactNumber: reduxUser.contactNumber || '',
                  username: reduxUser.username || '',
                  email: reduxUser.email || '',
                  _id: reduxUser._id || '',
                  departmentId: { _id: '', name: '' },
                });
                setModalOpen(true);
              }}
              className="inline-flex items-center px-5 py-2.5 bg-lime-500 text-white font-medium rounded-lg shadow hover:bg-lime-700 transition duration-200"
            >
               Edit Profile
            </button>
          </div>
          <RegisterFormModal
            isOpen={isModalOpen}
            onClose={() => {
              setModalOpen(false);
              refetch();
            }}
            user={{
              ...reduxUser,
              password: '',
              shiftStart: reduxUser.shiftStart || '',
              shiftEnd: reduxUser.shiftEnd || '',
            }}
            mode="edit"
          />
        </div>
      
    </>
  );
}