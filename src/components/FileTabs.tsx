import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { X } from 'lucide-react';
import { RootState } from "../store/store";
import { selectFile, closeFile } from "../store/fileExplorerSlice";

interface OpenFile {
    id: string;
    name: string;
}

const FileTabs: React.FC = () => {
    const dispatch = useDispatch();
    const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
    const files = useSelector((state: RootState) => state.fileExplorer.files);
    const openFileIds = useSelector((state: RootState) => state.fileExplorer.openFiles) || [];
    
    const openFiles = openFileIds.map(id => ({
        id,
        name: files[id]?.name || 'Untitled'
    }));

    const handleTabClick = (id: string) => {
        dispatch(selectFile(id));
    };

    const handleClose = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        dispatch(closeFile(id));
    };

    if (openFiles.length === 0) {
        return (
            <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center pl-12 pr-4">
                <span className="text-gray-500 text-sm">No files open</span>
            </div>
        );
    }

    return (
        <div className="h-12 flex border-b border-gray-200 bg-gray-50 overflow-x-auto pl-12 pr-4">
            {openFiles.map((file: OpenFile) => (
                <div
                    key={file.id}
                    onClick={() => handleTabClick(file.id)}
                    className={`
                        flex items-center min-w-[120px] max-w-[200px] px-4 border-r border-gray-200
                        cursor-pointer transition-colors duration-150 group
                        ${selectedFileId === file.id 
                            ? 'bg-white border-b-2 border-b-blue-500' 
                            : 'hover:bg-gray-100'
                        }
                    `}
                >
                    <span className="truncate flex-1 text-sm">
                        {file.name}
                    </span>
                    <button
                        onClick={(e) => handleClose(e, file.id)}
                        className={`
                            ml-2 p-1 rounded-sm opacity-0 group-hover:opacity-100
                            hover:bg-gray-200 transition-opacity duration-150
                        `}
                        title="Close tab"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FileTabs;
