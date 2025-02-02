

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Api/axiosInstance';

// Upload a new note
export const uploadNote = createAsyncThunk(
  'upload/uploadNote',
  async (noteData, { rejectWithValue }) => {
    console.log(`uploadNote => `, ...noteData);
    try {
      const response = await axiosInstance.post(
        'user/uploadNote',
        noteData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("newNote =>", response.data.newNote);
      return response.data.newNote; 
    } catch (error) {
      console.log("upload error =>", error);
      return rejectWithValue(error.response?.data || 'Failed to upload notes');
    }
  }
);

// Delete uploaded notes
export const deleteNotes = createAsyncThunk(
  'notes/deleteNotes',
  async (noteId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `user/deleteNotes/${noteId}`
      );
      return { noteId, message: response.data.message }; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete note');
    }
  }
);

const uploadNotesSlice = createSlice({
  name: 'uploadNote',
  initialState: {
    uploadedNotes: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetUploadState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadNote.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(uploadNote.fulfilled, (state, action) => {
        state.uploadedNotes.push(action.payload);
        state.loading = false;
        state.success = true;
        state.error = null; 
      })
      .addCase(uploadNote.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to upload notes';
      })
      .addCase(deleteNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
       
        state.uploadedNotes = state.uploadedNotes.filter(
          (note) => note._id !== action.payload.noteId
        );
      })
      .addCase(deleteNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetUploadState } = uploadNotesSlice.actions;

export default uploadNotesSlice.reducer;
