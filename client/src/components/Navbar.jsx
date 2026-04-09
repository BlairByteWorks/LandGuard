import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-color bg-white/95 backdrop-blur-sm px-6 py-4 dark:bg-background-dark/95 dark:border-gray-800 lg:px-20">
            <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <Link to="/" className="text-secondary dark:text-white text-xl font-bold leading-tight tracking-tight">LandGuard</Link>
            </div>
            <div className="hidden flex-1 justify-end gap-8 md:flex">
                <nav className="flex items-center gap-8">
                    <Link to="/" className="text-secondary dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors">Home</Link>
                    <a href="#" className="text-secondary dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors">About</a>
                    <Link to="/login" className="text-secondary dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors">Login</Link>
                </nav>
                <Link to="/login" className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg bg-primary h-10 px-6 text-secondary text-sm font-bold shadow-sm transition-transform hover:scale-105 hover:bg-primary-dark hover:shadow-md active:scale-95">
                    <span>Register</span>
                </Link>
            </div>
            <button className="flex md:hidden text-secondary dark:text-white">
                <span className="material-symbols-outlined">menu</span>
            </button>
        </header>
    );
}
