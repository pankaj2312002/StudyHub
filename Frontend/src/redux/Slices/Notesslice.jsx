
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../Api/api";


//notes on 1 tme
export const fetchNotes = createAsyncThunk('notes/fetchNotes', async (_,{ rejectWithValue }) => {
  
    try {
      
    const response = await axios.get(`${baseURL}/user/getNotes`);
  
    return response.data.notes; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch allnotes');
    }
  });


// fetchNotesBysearchQuery
export const fetchNotesBysearchQuery = createAsyncThunk(
  'notes/fetchNotesBySubject',
  async (searchQuery, { rejectWithValue }) => {
    
      try {
          const response = await axios.get(`${baseURL}/user/notes?searchQuery=${searchQuery}`,{ withCredentials: true });
          
          return response?.data.notes; 
          
      } catch (error) {
          
          return rejectWithValue(error.response?.data || 'Failed to fetch notes based on Query');
      }
  }
);


   
  
 
const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        notes: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          
          .addCase(fetchNotes.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchNotes.fulfilled, (state, action) => {
            
            state.notes = action.payload;
            state.loading = false;
          })
          .addCase(fetchNotes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })

          
          
          .addCase(fetchNotesBysearchQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchNotesBysearchQuery.fulfilled, (state, action) => {
            state.notes = action.payload;
            state.loading = false;
          })
          .addCase(fetchNotesBysearchQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          });
      },
    });
    
    export default notesSlice.reducer;

