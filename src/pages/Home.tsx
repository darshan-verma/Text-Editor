import { useNavigate } from 'react-router-dom';
import { FileText, Plus, FolderPlus } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const handleCreateNew = () => {
        navigate('/editor/new');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                        Text Editor
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        A lightweight, modern text editor for managing and editing your .txt files with ease
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <FileText className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Simple Text Editing</h3>
                        <p className="text-gray-600">
                            Clean and distraction-free interface for editing your text files
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <FolderPlus className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Folder Management</h3>
                        <p className="text-gray-600">
                            Organize your files with nested folders and easy navigation
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <Plus className="w-10 h-10 text-blue-500 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Quick Creation</h3>
                        <p className="text-gray-600">
                            Create new files and folders with just a few clicks
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button
                        onClick={handleCreateNew}
                        className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Start New File
                    </button>
                </div>

                {/* Footer */}
                <footer className="mt-20 text-center text-gray-500">
                    <p className="text-sm">
                        Built with React, TypeScript, and Tailwind CSS
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Home;
