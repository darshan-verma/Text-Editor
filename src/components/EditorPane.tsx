import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import FileTabs from './FileTabs';
import TextEditor from './TextEditor';

const EditorPane: React.FC = () => {
    const { activeFile } = useSelector((state: RootState) => state.editor);
    const activeFileContent = useSelector((state: RootState) => 
        activeFile ? state.fileExplorer.files[activeFile]?.content || '' : ''
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50">
            <FileTabs />
            <div className="flex-1 overflow-hidden">
                {activeFile ? (
                    <TextEditor
                        fileId={activeFile}
                        content={activeFileContent}
                    />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        <div className="text-center">
                            <p className="text-lg mb-2">No file selected</p>
                            <p className="text-sm">Select a file from the sidebar or create a new one</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditorPane;
