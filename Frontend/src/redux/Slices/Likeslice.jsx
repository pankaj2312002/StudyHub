

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Api/axiosInstance';

//  toggle like status on a note
export const toggleLikeNote = createAsyncThunk(
  'notes/toggleLikeNote',
  async ({ noteId, userLiked }, { rejectWithValue }) => {
    console.log("noteId =>", noteId);
    console.log("userLiked =>", userLiked);
    try {
      const response = await axiosInstance.post(
        `auth/notes/toggle-like/${noteId}`, 
        { liked: !userLiked }
      );
    
      return { noteId, likes: response.data.likes }; 
    } catch (error) {
      return rejectWithValue(
        error.response?.status === 401
          ? 'Please log in to like the note.'
          : error.response?.data
      );
    }
  }
);

const likeSlice = createSlice({
  name: 'Likes',
  initialState: {
    notes: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateLikes: (state, action) => {
      const { noteId, likes } = action.payload;
      const note = state.notes.find((note) => note._id === noteId);
      if (note) {
        note.likes = likes; 
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleLikeNote.fulfilled, (state, action) => {
      const { noteId, likes } = action.payload;
      const note = state.notes.find((note) => note._id === noteId);
      if (note) {
        note.likes = likes; 
      }
    });
  },
});

export const { updateLikes } = likeSlice.actions;
export default likeSlice.reducer;
