import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronRight, ChevronDown, Folder, Plus, File, Trash2 } from 'lucide-react';
import { createFile, createFolder, deleteFile, deleteFolder, selectFile } from '../store/fileExplorerSlice';
import { RootState } from '../store/store';

interface FolderItemProps {
    id: string;
    name: string;
    level: number;
    isCollapsed?: boolean;
}

const FolderItem: React.FC<FolderItemProps> = ({ 
    id, 
    name, 
    level,
    isCollapsed = false 
}) => {
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const files = useSelector((state: RootState) => 
        Object.values(state.fileExplorer.files).filter(file => file.folderId === id)
    );
    const subFolders = useSelector((state: RootState) => 
        Object.values(state.fileExplorer.folders).filter(folder => folder.parentId === id)
    );

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddFile = () => {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            dispatch(createFile({ name: `${fileName}.txt`, folderId: id }));
        }
    };

    const handleAddFolder = () => {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            dispatch(createFolder({ name: folderName, parentId: id }));
        }
    };

    const handleDeleteFolder = () => {
        if (confirm('Are you sure you want to delete this folder and all its contents?')) {
            dispatch(deleteFolder(id));
        }
    };

    const handleFileClick = (fileId: string) => {
        dispatch(selectFile(fileId));
    };

    const handleDeleteFile = (e: React.MouseEvent, fileId: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this file?')) {
            dispatch(deleteFile(fileId));
        }
    };

    return (
        <div className="w-full">
            <div 
                className={`
                    flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer group
                    ${isCollapsed ? 'justify-center' : ''}
                `}
                style={!isCollapsed ? { paddingLeft: `${level * 12}px` } : undefined}
                onMouseEnter={() => setShowOptions(true)}
                onMouseLeave={() => setShowOptions(false)}
            >
                {!isCollapsed && (
                    <button onClick={handleToggle} className="p-1">
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                )}
                <Folder className="w-4 h-4 mx-1" />
                {!isCollapsed && (
                    <>
                        <span className="text-sm flex-1 truncate">{name}</span>
                        {showOptions && (
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={handleAddFile}
                                    className="p-1 hover:bg-gray-200 rounded"
                                    title="Add File"
                                >
                                    <File className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleAddFolder}
                                    className="p-1 hover:bg-gray-200 rounded"
                                    title="Add Folder"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleDeleteFolder}
                                    className="p-1 hover:bg-gray-200 rounded text-red-500"
                                    title="Delete Folder"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {isExpanded && !isCollapsed && (
                <div className="w-full">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            onClick={() => handleFileClick(file.id)}
                            className="flex items-center px-2 py-1 hover:bg-gray-100 cursor-pointer group"
                            style={{ paddingLeft: `${(level + 1) * 12}px` }}
                        >
                            <File className="w-4 h-4 mx-1" />
                            <span className="text-sm flex-1 truncate">
                                {file.name}
                            </span>
                            <button
                                onClick={(e) => handleDeleteFile(e, file.id)}
                                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded text-red-500"
                                title="Delete File"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {subFolders.map((folder) => (
                        <FolderItem
                            key={folder.id}
                            id={folder.id}
                            name={folder.name}
                            level={level + 1}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FolderItem;
