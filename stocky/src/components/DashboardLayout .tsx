import type { ReactNode } from 'react'
import Navbar from "./Navbar";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />
            <main className='flex-1 p-4 bg-gray-50'>{children} </main>
        </div>
    )
};

export default DashboardLayout;