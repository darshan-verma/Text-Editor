// // src/store/fileExplorerSlice.ts
// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Types
// export interface File {
//   id: string;
//   name: string;
//   content: string;
//   folderId: string | null;
// }

// export interface Folder {
//   id: string;
//   name: string;
//   parentId: string | null;
// }

// interface FileExplorerState {
//   files: Record<string, File>;
//   folders: Record<string, Folder>;
//   selectedFileId: string | null;
// }

// // Initial state
// const initialState: FileExplorerState = {
//   files: {},
//   folders: {},
//   selectedFileId: null
// };

// const fileExplorerSlice = createSlice({
//   name: "fileExplorer",
//   initialState,
//   reducers: {
//     createFolder: (
//       state,
//       action: PayloadAction<{
//         name: string;
//         parentId: string | null;
//       }>
//     ) => {
//       const id = `folder-${Date.now()}`;
//       state.folders[id] = {
//         id,
//         name: action.payload.name,
//         parentId: action.payload.parentId,
//       };
//     },

//     createFile: (
//       state,
//       action: PayloadAction<{
//         name: string;
//         folderId: string | null;
//       }>
//     ) => {
//       const id = `file-${Date.now()}`;
//       state.files[id] = {
//         id,
//         name: action.payload.name,
//         content: '',
//         folderId: action.payload.folderId,
//       };
//     },

//     updateFileName: (
//       state,
//       action: PayloadAction<{
//         id: string;
//         name: string;
//       }>
//     ) => {
//       if (state.files[action.payload.id]) {
//         state.files[action.payload.id].name = action.payload.name;
//       }
//     },

//     updateFileContent: (
//       state,
//       action: PayloadAction<{
//         id: string;
//         content: string;
//       }>
//     ) => {
//       if (state.files[action.payload.id]) {
//         state.files[action.payload.id].content = action.payload.content;
//       }
//     },

//     updateFolderName: (
//       state,
//       action: PayloadAction<{
//         id: string;
//         name: string;
//       }>
//     ) => {
//       if (state.folders[action.payload.id]) {
//         state.folders[action.payload.id].name = action.payload.name;
//       }
//     },

//     moveFile: (
//       state,
//       action: PayloadAction<{
//         id: string;
//         folderId: string | null;
//       }>
//     ) => {
//       if (state.files[action.payload.id]) {
//         state.files[action.payload.id].folderId = action.payload.folderId;
//       }
//     },

//     moveFolder: (
//       state,
//       action: PayloadAction<{
//         id: string;
//         parentId: string | null;
//       }>
//     ) => {
//       if (state.folders[action.payload.id]) {
//         state.folders[action.payload.id].parentId = action.payload.parentId;
//       }
//     },

//     deleteFile: (
//       state,
//       action: PayloadAction<string>
//     ) => {
//       delete state.files[action.payload];
//       if (state.selectedFileId === action.payload) {
//         state.selectedFileId = null;
//       }
//     },

//     deleteFolder: (
//       state,
//       action: PayloadAction<string>
//     ) => {
//       const folderId = action.payload;
      
//       // Delete all files in this folder
//       Object.values(state.files).forEach(file => {
//         if (file.folderId === folderId) {
//           delete state.files[file.id];
//         }
//       });

//       // Delete all subfolders recursively
//       const deleteSubFolders = (parentId: string) => {
//         Object.values(state.folders).forEach(folder => {
//           if (folder.parentId === parentId) {
//             // Delete files in this subfolder
//             Object.values(state.files).forEach(file => {
//               if (file.folderId === folder.id) {
//                 delete state.files[file.id];
//               }
//             });
//             // Recursively delete subfolders
//             deleteSubFolders(folder.id);
//             // Delete the subfolder
//             delete state.folders[folder.id];
//           }
//         });
//       };

//       // Start recursive deletion
//       deleteSubFolders(folderId);
//       // Delete the folder itself
//       delete state.folders[folderId];
//     },

//     selectFile: (state, action: PayloadAction<string | null>) => {
//       state.selectedFileId = action.payload;
//     }
//   },
// });

// export const {
//   createFolder,
//   createFile,
//   updateFileName,
//   updateFileContent,
//   updateFolderName,
//   moveFile,
//   moveFolder,
//   deleteFile,
//   deleteFolder,
//   selectFile
// } = fileExplorerSlice.actions;

// export default fileExplorerSlice.reducer;
// src/store/fileExplorerSlice.ts
// src/store/fileExplorerSlice.ts
// src/store/fileExplorerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface File {
  id: string;
  name: string;
  content: string;
  folderId: string | null;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface FileExplorerState {
  files: Record<string, File>;
  folders: Record<string, Folder>;
  selectedFileId: string | null;
  openFiles: string[];
}

// Initial state
const initialState: FileExplorerState = {
  files: {},
  folders: {},
  selectedFileId: null,
  openFiles: []
};

const fileExplorerSlice = createSlice({
  name: "fileExplorer",
  initialState,
  reducers: {
    // Create a new folder. If a parentId is provided, the folder is nested.
    createFolder: (
      state,
      action: PayloadAction<{ name: string; parentId: string | null }>
    ) => {
      // Defensive check: if state.folders is missing or is an array, reinitialize it as an object.
      if (!state.folders || Array.isArray(state.folders)) {
        state.folders = {};
      }
      const id = `folder-${Date.now()}`;
      state.folders[id] = {
        id,
        name: action.payload.name,
        parentId: action.payload.parentId,
      };
    },

    // Create a new file.
    createFile: (
      state,
      action: PayloadAction<{ name: string; folderId: string | null }>
    ) => {
      // Defensive check: if state.files is missing or is an array, reinitialize it as an object.
      if (!state.files || Array.isArray(state.files)) {
        state.files = {};
      }
      const id = `file-${Date.now()}`;
      state.files[id] = {
        id,
        name: action.payload.name,
        content: "",
        folderId: action.payload.folderId,
      };
    },

    updateFileName: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      if (state.files[action.payload.id]) {
        state.files[action.payload.id].name = action.payload.name;
      }
    },

    updateFileContent: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      if (state.files[action.payload.id]) {
        state.files[action.payload.id].content = action.payload.content;
      }
    },

    updateFolderName: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      if (state.folders[action.payload.id]) {
        state.folders[action.payload.id].name = action.payload.name;
      }
    },

    moveFile: (
      state,
      action: PayloadAction<{ id: string; folderId: string | null }>
    ) => {
      if (state.files[action.payload.id]) {
        state.files[action.payload.id].folderId = action.payload.folderId;
      }
    },

    moveFolder: (
      state,
      action: PayloadAction<{ id: string; parentId: string | null }>
    ) => {
      if (state.folders[action.payload.id]) {
        state.folders[action.payload.id].parentId = action.payload.parentId;
      }
    },

    deleteFile: (state, action: PayloadAction<string>) => {
      delete state.files[action.payload];
      // Ensure openFiles is defined before filtering.
      if (!Array.isArray(state.openFiles)) {
        state.openFiles = [];
      }
      state.openFiles = state.openFiles.filter((id) => id !== action.payload);
      if (state.selectedFileId === action.payload) {
        state.selectedFileId =
          state.openFiles.length > 0
            ? state.openFiles[state.openFiles.length - 1]
            : null;
      }
    },

    deleteFolder: (state, action: PayloadAction<string>) => {
      const folderId = action.payload;
      
      // Delete all files in this folder
      Object.values(state.files).forEach((file) => {
        if (file.folderId === folderId) {
          delete state.files[file.id];
        }
      });

      // Delete all subfolders recursively
      const deleteSubFolders = (parentId: string) => {
        Object.values(state.folders).forEach((folder) => {
          if (folder.parentId === parentId) {
            // Delete files in this subfolder
            Object.values(state.files).forEach((file) => {
              if (file.folderId === folder.id) {
                delete state.files[file.id];
              }
            });
            // Recursively delete subfolders
            deleteSubFolders(folder.id);
            // Delete the subfolder
            delete state.folders[folder.id];
          }
        });
      };

      // Start recursive deletion
      deleteSubFolders(folderId);
      // Delete the folder itself
      delete state.folders[folderId];
    },

    selectFile: (state, action: PayloadAction<string | null>) => {
      state.selectedFileId = action.payload;
      // Defensive check: ensure openFiles is an array
      if (!Array.isArray(state.openFiles)) {
        state.openFiles = [];
      }
      if (action.payload && !state.openFiles.includes(action.payload)) {
        state.openFiles.push(action.payload);
      }
    },

    closeFile: (state, action: PayloadAction<string>) => {
      // Defensive check: ensure openFiles is an array
      if (!Array.isArray(state.openFiles)) {
        state.openFiles = [];
      }
      state.openFiles = state.openFiles.filter((id) => id !== action.payload);
      if (state.selectedFileId === action.payload) {
        state.selectedFileId =
          state.openFiles.length > 0
            ? state.openFiles[state.openFiles.length - 1]
            : null;
      }
    },
  },
});

export const {
  createFolder,
  createFile,
  updateFileName,
  updateFileContent,
  updateFolderName,
  moveFile,
  moveFolder,
  deleteFile,
  deleteFolder,
  selectFile,
  closeFile,
} = fileExplorerSlice.actions;

export default fileExplorerSlice.reducer;


