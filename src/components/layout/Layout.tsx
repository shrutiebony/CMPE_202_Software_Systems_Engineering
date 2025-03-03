import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../store/authStore';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Check if user is logged in when app loads
    checkAuth();
  }, [checkAuth]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;