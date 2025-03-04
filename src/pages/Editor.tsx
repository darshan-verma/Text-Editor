import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import EditorPane from '../components/EditorPane';
import { Menu, X } from 'lucide-react';

const Editor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Mobile Sidebar Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed z-50 bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow-lg"
            >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transform lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out`}
            >
                <Sidebar />
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <EditorPane />
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Editor;
