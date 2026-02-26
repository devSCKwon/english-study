import React from 'react';
import Header from './Header';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
            <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                © 2026 English Play. All rights reserved.
            </footer>
        </div>
    );
}
