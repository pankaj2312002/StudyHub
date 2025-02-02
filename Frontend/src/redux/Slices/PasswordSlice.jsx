

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Api/axiosInstance';

export const forgetPassword = createAsyncThunk(
  'password/forgetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('auth/forgot-password', { email });
      console.log("forgetPassword =>",response.data)
      return response.data; 
      
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'password/resetPassword',
  async ({ token, userId, password }, { rejectWithValue }) => {
    console.log("toekn =>", token)
         console.log("userId =>",userId)
         console.log("userId =>",password)
    try {
      const response = await axiosInstance.post(`auth/reset-password/${userId}/${token}`, { password });
      console.log("resetPassword =>",response.data)
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

const passwordSlice = createSlice({
  name: 'password',
  initialState :{
    isLoading: false,
    resetSuccess: false,
    resetError: null,
    forgetSuccess: false,
    forgetError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.resetError = null;
      state.forgetError = null;
    },
    clearSuccess: (state) => {
      state.resetSuccess = false;
      state.forgetSuccess = false;
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(forgetPassword.pending, (state) => {
        state.isLoading = true;
        state.forgetSuccess = false;
        state.forgetError = null;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.forgetSuccess = true;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.forgetError = action.payload;
      })
     
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.resetSuccess = false;
        state.resetError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.resetError = action.payload;
      });
  },
});

export const { clearErrors, clearSuccess } = passwordSlice.actions;

export default passwordSlice.reducer;
