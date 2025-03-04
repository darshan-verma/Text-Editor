import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface OpenFile {
  id: string;
  name: string;
}

interface EditorState {
  activeFile: string | null;
  openFiles: OpenFile[];
}

// Initial state
const initialState: EditorState = {
  activeFile: null,
  openFiles: [],
};

// Slice
const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    openFile: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const exists = state.openFiles.some(
        (file) => file.id === action.payload.id
      );
      if (!exists) {
        state.openFiles.push({
          id: action.payload.id,
          name: action.payload.name,
        });
      }
      state.activeFile = action.payload.id;
    },
    
    closeFile: (state, action: PayloadAction<string>) => {
      state.openFiles = state.openFiles.filter(
        (file) => file.id !== action.payload
      );
      if (state.activeFile === action.payload) {
        state.activeFile = state.openFiles.length > 0
          ? state.openFiles[state.openFiles.length - 1].id
          : null;
      }
    },
    
    setActiveFile: (state, action: PayloadAction<string>) => {
      if (state.openFiles.some((file) => file.id === action.payload)) {
        state.activeFile = action.payload;
      }
    },
  },
});

export const { openFile, closeFile, setActiveFile } = editorSlice.actions;

export default editorSlice.reducer;
