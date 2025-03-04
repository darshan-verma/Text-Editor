import React from "react";
import { useNavigate } from "react-router-dom";

interface FileItemProps{
    id: string;
    name: string;
}
const FileItem:React.FC<FileItemProps> = ({id, name}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/edito/${id}`)
    }

    return ( 
        <div
        onClick={handleClick}
        className="cursor-pointer w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 border-b border-gray-200 transition-colors duration-200 flex items-center">
            <div className="truncate text-xs sm:text-sm md:text-base flex-1">
                {name}
            </div>
        </div>
     );
}
 
export default FileItem;