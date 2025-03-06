import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFileContent, updateFileName } from '../store/fileExplorerSlice';
import { RootState } from '../store/store';
import { Edit2 } from 'lucide-react';

const TextEditor: React.FC = () => {
    const dispatch = useDispatch();
    const selectedFileId = useSelector((state: RootState) => state.fileExplorer.selectedFileId);
    const files = useSelector((state: RootState) => state.fileExplorer.files);
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');

    
    if (!selectedFileId) {
        return (
            <div className="h-full flex items-center justify-center text-gray-500">
                <p>Select a file to edit</p>
            </div>
        );
    }

   
    const file = files[selectedFileId];
    if (!file) {
        return (
            <div className="h-full flex items-center justify-center text-red-500">
                <p>File not found</p>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(updateFileContent({
            id: selectedFileId,
            content: e.target.value
        }));
    };

    const handleNameEdit = () => {
        setEditedName(file.name);
        setIsEditingName(true);
    };

    const handleNameSave = () => {
        if (editedName.trim() && selectedFileId) {
            dispatch(updateFileName({
                id: selectedFileId,
                name: editedName.trim()
            }));
            setIsEditingName(false);
        }
    };

    const handleNameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNameSave();
        } else if (e.key === 'Escape') {
            setIsEditingName(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 p-4 flex items-center">
                {isEditingName ? (
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={handleNameSave}
                        onKeyDown={handleNameKeyDown}
                        className="text-lg font-semibold px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blugray-100"
                        autoFocus
                    />
                ) : (
                    <div 
                        className="flex items-center group cursor-pointer"
                        onClick={handleNameEdit}
                    >
                        <h2 className="text-lg font-semibold">{file.name}</h2>
                        <Edit2 className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-auto">
                <textarea
                    className="w-full h-full p-4 resize-none focus:outline-none"
                    value={file.content}
                    onChange={handleChange}
                    placeholder="Start typing..."
                />
            </div>
        </div>
    );
};

export default TextEditor;
