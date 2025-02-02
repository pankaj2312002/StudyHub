// store.js
import { configureStore , combineReducers} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import notesReducer from './Slices/Notesslice';
import authReducer from './Slices/Authslice';
import likesReducer from './Slices/Likeslice';
import uploadNoteReducer from './Slices/UploadNotesSlice';
import passwordReducer from './Slices/PasswordSlice'; 
import {checkTokenExpirationMiddleware } from '../Middlewares/checkToken'; 


const persistConfig = {
  key: 'root', 
  storage, 
  whitelist: ['auth'], 
};


const rootReducer = combineReducers(
    {
    notes: notesReducer,
    auth: authReducer,
    likes: likesReducer,
    uploadNotes: uploadNoteReducer,
    password: passwordReducer, 
  })




const persistedReducer = persistReducer(persistConfig, rootReducer);


const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(checkTokenExpirationMiddleware),
});


const persistor = persistStore(Store);

export { Store, persistor };

