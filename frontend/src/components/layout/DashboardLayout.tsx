import { useState, ReactNode } from 'react';
import { UserSidebar } from '@/components/sidebar/UserSidebar';
import { Header } from '@/components/layout/Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} showMenuButton={true} />
      
      <div className="flex flex-1">
        <UserSidebar />
        
        <div className={`md:ml-[220px] flex-1 p-4 md:p-8 transition-all duration-300 ${sidebarOpen ? 'ml-[220px]' : 'ml-0'}`}>
          {children}
        </div>
      </div>
    </div>
  );
} 