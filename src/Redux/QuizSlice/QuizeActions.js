import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    quizeQuestions:[]
}

// get the data 
export const getQuizeQuestions = createAsyncThunk(
    "Quizes/getQuizeQuestions",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get("https://opentdb.com/api.php?amount=100");
        console.log(response.data)
        return response.data;
      } catch (error) {
         if(error.reponse && error.response.status === 429){
           await new Promise(resolve => setTimeout(resolve,5000))
           return rejectWithValue("Retry after delay");
         }else{
          return rejectWithValue(error.message);
         }
      }
    }
  );

  
export const Quizslice = createSlice ({
    name : "Quizes",
    initialState,
    reducers:{},
    extraReducers(build){
        build
        .addCase(getQuizeQuestions.fulfilled,(state,action)=>{
          state.quizeQuestions = action.payload && action.payload.results
        })
    }
})

export default Quizslice.reducer;