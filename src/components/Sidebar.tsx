import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FolderPlus, FileText, ChevronRight, FilePlus, Trash2, Edit2 } from 'lucide-react';
import { createFolder, createFile, selectFile, deleteFile, deleteFolder, updateFolderName } from '../store/fileExplorerSlice';
import { RootState } from '../store/store';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const folders = useSelector((state: RootState) => state.fileExplorer.folders) || {};
    const files = useSelector((state: RootState) => state.fileExplorer.files) || {};
    const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
    const [isExpanded, setIsExpanded] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [editedFolderName, setEditedFolderName] = useState('');

    const handleAddRootFolder = () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            dispatch(createFolder({ name: folderName, parentId: null }));
        }
    };

    const handleAddFile = (folderId: string | null) => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            dispatch(createFile({ name: fileName, folderId }));
        }
    };

    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    // Get root level folders
    const rootFolders = Object.values(folders).filter(folder => folder.parentId === null);

    // Get children of a folder
    const getFolderContents = (folderId: string) => {
        const childFiles = Object.values(files).filter(file => file.folderId === folderId);
        const childFolders = Object.values(folders).filter(folder => folder.parentId === folderId);
        return { childFiles, childFolders };
    };

    const handleDeleteFile = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this file?')) {
            dispatch(deleteFile(fileId));
        }
    };

    const handleDeleteFolder = (e: React.MouseEvent, folderId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this folder and all its contents?')) {
            dispatch(deleteFolder(folderId));
        }
    };

    const handleFolderNameEdit = (e: React.MouseEvent, folderId: string, currentName: string) => {
        e.stopPropagation();
        setEditingFolderId(folderId);
        setEditedFolderName(currentName);
    };

    const handleFolderNameSave = (e: React.FocusEvent | React.KeyboardEvent, folderId: string) => {
        e.stopPropagation();
        if (editedFolderName.trim()) {
            dispatch(updateFolderName({
                id: folderId,
                name: editedFolderName.trim()
            }));
        }
        setEditingFolderId(null);
    };

    const handleFolderNameKeyDown = (e: React.KeyboardEvent, folderId: string) => {
        if (e.key === 'Enter') {
            handleFolderNameSave(e, folderId);
        } else if (e.key === 'Escape') {
            e.stopPropagation();
            setEditingFolderId(null);
        }
    };

    const renderFolder = (folder: typeof folders[keyof typeof folders], level: number = 0) => {
        const { childFiles, childFolders } = getFolderContents(folder.id);
        const isOpen = expandedFolders.has(folder.id);

        return (
            <div key={folder.id} style={{ marginLeft: `${level * 16}px` }}>
                <div className="flex items-center justify-between p-2 hover:bg-gray-200 group">
                    <div 
                        className="flex items-center cursor-pointer flex-1"
                        onClick={() => toggleFolder(folder.id)}
                    >
                        <ChevronRight 
                            className={`w-4 h-4 mr-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                        />
                        {editingFolderId === folder.id ? (
                            <input
                                type="text"
                                value={editedFolderName}
                                onChange={(e) => setEditedFolderName(e.target.value)}
                                onBlur={(e) => handleFolderNameSave(e, folder.id)}
                                onKeyDown={(e) => handleFolderNameKeyDown(e, folder.id)}
                                className="px-1 py-0.5 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <div className="flex items-center group/name">
                                <span>{folder.name}</span>
                                <button
                                    onClick={(e) => handleFolderNameEdit(e, folder.id, folder.name)}
                                    className="p-1 opacity-0 group-hover/name:opacity-100 transition-opacity hover:shadow-md rounded-full"
                                    title="Rename Folder"
                                >
                                    <Edit2 className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddFile(folder.id);
                            }}
                            className="p-1 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Add File"
                        >
                            <FilePlus className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const folderName = prompt('Enter folder name:');
                                if (folderName) {
                                    dispatch(createFolder({ name: folderName, parentId: folder.id }));
                                }
                            }}
                            className="p-1 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Add Subfolder"
                        >
                            <FolderPlus className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                            onClick={(e) => handleDeleteFolder(e, folder.id)}
                            className="p-1 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete Folder"
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div>
                        {childFolders.map(childFolder => renderFolder(childFolder, level + 1))}
                        {childFiles.map(file => (
                            <div 
                                key={file.id}
                                className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer group ${
                                    selectedFileId === file.id ? 'bg-blue-100 hover:bg-blue-200' : ''
                                }`}
                                style={{ marginLeft: `${(level + 1) * 16}px` }}
                                onClick={() => dispatch(selectFile(file.id))}
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                <span className="flex-1">{file.name}</span>
                                <button
                                    onClick={(e) => handleDeleteFile(e, file.id)}
                                    className="p-1 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete File"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Expand Button - Only shown when sidebar is collapsed */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="fixed top-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm hover:bg-gray-100 
                    rounded-md shadow-lg z-[100] border border-gray-200 hover:border-gray-300"
                    title="Show Sidebar"
                >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            )}
            
            {/* Main Sidebar */}
            <div className={`
                h-full flex flex-col bg-gray-50 border-r border-gray-200
                ${isExpanded ? 'w-64' : 'w-0 hidden'}
                transition-all duration-300
            `}>
                {/* Header */}
                <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200">
                    <h2 className="font-semibold text-sm">File Explorer</h2>
                    <button
                        onClick={handleAddRootFolder}
                        className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                        title="Add Root Folder"
                    >
                        <FolderPlus className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* File Explorer */}
                <div className="flex-1 overflow-y-auto">
                    {(!files || !folders || rootFolders.length === 0 && Object.keys(files).length === 0) ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>No files or folders</p>
                            <p className="text-xs mt-1">Create a file or folder to get started</p>
                        </div>
                    ) : (
                        <>
                            {/* Root Files */}
                            {Object.values(files || {})
                                .filter(file => file.folderId === null)
                                .map(file => (
                                    <div 
                                        key={file.id}
                                        className={`flex items-center p-2 hover:bg-gray-200 cursor-pointer group ${
                                            selectedFileId === file.id ? 'bg-blue-100 hover:bg-blue-200' : ''
                                        }`}
                                        onClick={() => dispatch(selectFile(file.id))}
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        <span className="flex-1">{file.name}</span>
                                        <button
                                            onClick={(e) => handleDeleteFile(e, file.id)}
                                            className="p-1 hover:bg-gray-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete File"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            {/* Root Folders */}
                            {rootFolders.map(folder => renderFolder(folder))}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-2">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="w-full py-1 px-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center"
                    >
                        <ChevronRight className="w-4 h-4 mr-1" />
                        Collapse
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
