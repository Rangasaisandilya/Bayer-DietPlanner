// import { Link } from "react-router-dom";
// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import MenuIcon from "../../assets/MenuIcon";

// const Header = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <>
//     {/* <AddEditBookModal isOpen onClose={()=>{}} /> */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <header className="bg-gradient-to-r from-lime-500 to-lime-700 text-white p-3 shadow-lg z-30 relative">
//         <div className="flex justify-between items-center w-full">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="focus:outline-none cursor-pointer"
//             >
//               <MenuIcon />
//             </button>



//             <Link
//               to="/home"
//               className="text-2xl font-extrabold tracking-wide hover:text-blue-200 transition duration-300"
//             >
              
//               Bayer Healthcare
//             </Link>
//           </div>

//           {/* <nav className="flex items-center space-x-6">
//             <Link
//               to="/notifications"
//               className="hover:text-blue-200 transition duration-300"
//               title="Notifications"
//             >
//               <BellIcon />
//             </Link>

//             <Link
//             to="/profile"
//               className="text-lg font-medium hover:text-blue-200 transition duration-300"
//             >
//              <UserIcon />
//             </Link>

//           </nav> */}
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;


import { Link } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import MenuIcon from "../../assets/MenuIcon";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="bg-gradient-to-r from-lime-500 to-emerald-600 border-b shadow-md relative p-3 top-0 z-30">
  {/* Left: Menu + Logo */}
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center space-x-4">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-md bg-lime-500 hover:bg-lime-600 text-white focus:outline-none shadow transition"
        aria-label="Toggle Menu"
      >
        <MenuIcon />
      </button>

      <Link
        to="/home"
        className="text-[#f5f5dc] text-xl sm:text-2xl font-bold tracking-wide"
      >
        Bayer Healthcare
      </Link>
    </div>
  </div>
</header>

    </>
  );
};

export default Header;


