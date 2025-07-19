import type { ReactElement } from "react";
import Header from "../component/layoutComponents/Header";
import Footer from "../component/layoutComponents/Footer";

interface DashboardLayoutProps {
  children: ReactElement;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
