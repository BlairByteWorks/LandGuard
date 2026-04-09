import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden group/design-root min-w-[320px]">
            <Navbar />
            <main className="flex flex-1 flex-col">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
