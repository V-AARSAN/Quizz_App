import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Quizstart from './Component/QuizStart';
import QuizTest from './Component/QuizTest';
import { Provider } from 'react-redux';
import { store } from './Redux/Store';


export default function App() {
  return (
    <>
      <BrowserRouter >
        <Provider store={store}>
          <Routes>
            <Route path='/' element={<Quizstart/>} />
            <Route path='/quizTest' element={<QuizTest/>} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </>
  );
}

