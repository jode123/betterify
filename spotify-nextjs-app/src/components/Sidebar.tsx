import React from 'react';
import Link from 'next/link'

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-[#282828] text-white p-6">
            <nav className="space-y-6">
                <div>
                    <h2 className="text-sm uppercase font-semibold text-gray-400 mb-4">Library</h2>
                    <ul className="space-y-3">
                        <li>
                            <Link href="/" className="flex items-center text-gray-300 hover:text-white">
                                <span className="material-icons mr-3">library_music</span>
                                Playlists
                            </Link>
                        </li>
                        <li>
                            <Link href="/artists" className="flex items-center text-gray-300 hover:text-white">
                                <span className="material-icons mr-3">person</span>
                                Artists
                            </Link>
                        </li>
                        <li>
                            <Link href="/albums" className="flex items-center text-gray-300 hover:text-white">
                                <span className="material-icons mr-3">album</span>
                                Albums
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;