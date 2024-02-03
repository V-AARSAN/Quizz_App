import { configureStore } from "@reduxjs/toolkit";
import  Quizslice  from "./QuizSlice/QuizeActions";

export const store = configureStore({
    devTools:true,
    reducer:{
        Quiz : Quizslice
    }
})