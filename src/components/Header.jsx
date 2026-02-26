import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, BookOpen } from 'lucide-react';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center cursor-pointer">
                        <div className="bg-primary-500 text-white p-2 rounded-xl mr-3">
                            <BookOpen size={24} />
                        </div>
                        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            English Play
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
