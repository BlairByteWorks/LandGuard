import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white px-6 py-12 dark:bg-background-dark dark:border-t dark:border-gray-800">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    </div>
                    <span className="text-lg font-bold text-secondary dark:text-white">LandGuard</span>
                </div>
                <div className="flex flex-wrap justify-center gap-8 text-sm text-text-muted dark:text-gray-400">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
                    <a href="#" className="hover:text-primary transition-colors">Help Center</a>
                </div>
                <p className="text-sm text-text-muted dark:text-gray-500">© 2026 LandGuard. All rights reserved.</p>
            </div>
        </footer>
    );
}
