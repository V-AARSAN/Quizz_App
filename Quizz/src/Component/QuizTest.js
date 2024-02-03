import React, { useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Container, Form, FormCheck, FormGroup, Row, Stack } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getQuizeQuestions } from '../Redux/QuizSlice/QuizeActions';
import '../assets/Css/style.css';
import he from 'he';
import { useNavigate } from 'react-router-dom';

export default function QuizTest() {

  // condtion for test and resu;t operators
    const[showTest, setShowTest] = useState(true)
    const[showResult, setShowResult] = useState(false)

    const[questionNum, setQuestionNum] = useState(1)
    const[time, setTime] = useState(30)
    const[checkedAnswers, setCheckedAnswers] = useState([])
    const {quizeQuestions} = useSelector(((state)=>state && state.Quiz))
    const[resultsCatogory, setResultsCatogory] = useState({
        score:0,
        wrongAnswer:0,
        correctAnswer:0
    })
    const[selectedAnswer, setSelectedAnswer] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // it dispatch the action to get data
    useEffect(() => {
      dispatch(getQuizeQuestions())
    }, [dispatch]);


// checking is this array or not
    const currentQuestion = Array.isArray(quizeQuestions) && quizeQuestions.length > 0 ? quizeQuestions[questionNum - 1]: null;
// extract the data
    const {question, correct_answer, category, incorrect_answers, difficulty ,type} = currentQuestion || {}
// decode entities
    const htmlEntititesDecode = (entities) => (typeof entities === 'string' ? he.decode(entities) : entities);
    const decodedQuestion = htmlEntititesDecode(question)
    const decodedCorrect_anwser = htmlEntititesDecode(correct_answer)
    const decodedIncorrect_Answer = useMemo(()=>incorrect_answers?.map(htmlEntititesDecode) || [],[incorrect_answers])
    const decodedDifficulty = htmlEntititesDecode(difficulty)
    const decodedCateory = htmlEntititesDecode(category)

// using memo hook for only trigger the dependancy value update
    const shuffledChoices = useMemo(()=>{
      
      if(Array.isArray(decodedIncorrect_Answer) && decodedIncorrect_Answer.length > 0 ){
        // shuffle the choices
        const allChoices = [decodedCorrect_anwser,...decodedIncorrect_Answer]
        const shuffledChoices = [...allChoices].sort(() => Math.random() - 0.5);
        return shuffledChoices
      }
      return[] 
    },[decodedCorrect_anwser, decodedIncorrect_Answer])

    // handling check box

  //  handling the next button
    const incrementValue = () =>{
      if(questionNum == quizeQuestions.length){
        // after all question attended
        setShowTest(false)
        setShowResult(true)
        if(checkedAnswers == decodedCorrect_anwser){
          setResultsCatogory((prev)=>({
            ...prev,
            correctAnswer : prev.correctAnswer + 1,
            score : prev.score + 1
          }))
        }else{
          setResultsCatogory((prev)=>({
            ...prev,
            wrongAnswer:prev.wrongAnswer +1
          }))
        }
      }else{

          // update results as wrong, correct and score
        if(checkedAnswers == decodedCorrect_anwser){
          setResultsCatogory((prev)=>({
            ...prev,
            correctAnswer : prev.correctAnswer + 1,
            score : prev.score + 1
          }))
        }else{
          setResultsCatogory((prev)=>({
            ...prev,
            wrongAnswer:prev.wrongAnswer +1
          }))
        }
      }
      setQuestionNum((prev)=>prev + 1)
      setCheckedAnswers([])
      setTime(30)
      setSelectedAnswer('')
    }
  
    // after 10 seconds the useeffect trigger next questiom 
    useEffect(()=>{
      let timer =   setInterval(() => {
        setTime((prevTime) => prevTime - 1);
    
        if (time === 0) {
          incrementValue();
          setTime(30)
        }
      }, 1000);
      return () => clearTimeout(timer);

    },[incrementValue])

  const handleChoices = (data,index) =>{
      setSelectedAnswer(index)
      setCheckedAnswers(data)
  }

  console.log(checkedAnswers,)
   console.log(decodedCorrect_anwser)

  return (
    <>
    {/* ===================== Quiz Test =========================  */}
    <section id='test-background'>
  <Row className='d-flex align-items-center min-vh-100 g-0'>
    <Col lg={7} className='mx-auto'>
      <Card className='shadow py-2 h-100'>
        <div className='adjust-card d-flex flex-column justify-content-between pb-0 h-100'>
          
          {/* ============ showing Test Question =========== */}
          {showTest && 
          <Container className='h-100'>
            <Stack className='h-100'>
              <h1 className='text-primary text-center py-3'>Quiz Test</h1>
              <div className='d-flex justify-content-between fs-5 py-2'>
                <p className='my-2'><b>Category</b> : {decodedCateory}</p>
                <p className='my-2'><b className='text-end'>Difficulty</b> : {decodedDifficulty}</p>
              </div>
              <h4>{questionNum}.{decodedQuestion}</h4>
              
              <Row className='py-3 flex-grow-1'>
                <Col lg={8}>
                  <Stack gap={3} className='mx-3 '>
                    {/* mapping the shuffled choices */}
                    {shuffledChoices.length > 0 && 
                      shuffledChoices.map((data, index) => (
                        <Button variant={selectedAnswer === index ? 'outline-success ' : 'outline-warning'} onClick={()=>handleChoices(data,index)} className={selectedAnswer === index ? 'active' : null} key={index}>
                          <Form.Check name='choices' className='text-dark text-start fw-bold' checked={selectedAnswer === index ? true : false }  label={data} />
                        </Button>
                      ))
                    }
                  </Stack>
                </Col>
              </Row>

              <div className=' position-absolute bottom-0 text-nowrap'>
              <p>Remaining Time: {time} Sec</p>
                    <p>Remaining Question: {questionNum}/{quizeQuestions.length}</p>
              </div>
              <div className='position-absolute bottom-0 end-0 m-3'>
                <Button type='submit' variant={questionNum === 50 ? 'success' : 'primary'} onClick={incrementValue}>
                      {questionNum === 50 ? 'Submit' : 'Next Question'}
                </Button>
                </div>
            </Stack>
          </Container>
          }

          {/* ============ showing Result Question =========== */}
          {showResult && 
          <Container className='text-center'>
            <h1 className='text-primary py-3'>Quiz Result</h1>
            <Stack gap={4} className='my-5 py-3 fs-4'>
              <p className='text-primary fw-bold'>Correct Answer : {resultsCatogory.correctAnswer}</p>
              <p className='text-danger fw-bold'>Wrong Answer : {resultsCatogory.wrongAnswer}</p>
              <p className='text-success fw-bolder'>Score : {resultsCatogory.score}</p>
              <div className=''>
                <Button onClick={() => navigate('/', { replace: true })}>Home</Button>
              </div>
            </Stack>
          </Container>
          }  
        </div>                
      </Card>
    </Col>  
  </Row>  
</section>

 
    </>
  )
}