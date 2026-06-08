'use client';

import { Cog8ToothIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/app/provider/DarkmodeProvider';

export const NavBar = () => {
    const {darkMode, toggleDarkMode} = useDarkMode();

    return (
        <nav className='bg-background border-b border-gray-200 dark:border-gray-800'>
            <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                <div>
                    <h1 className='text-xl font-bold'>AI-MA homeworks</h1>
                </div>

                <div className='flex items-center gap-4'>
                    <button onClick={toggleDarkMode}>
                        {darkMode ? (
                            <MoonIcon className='size-12 text-gray-500'/>
                        ) : (
                            <SunIcon className='size-12 text-yellow-500'/>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    )
}