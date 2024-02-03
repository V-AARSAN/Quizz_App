import { faHandPointRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import { Button, Card, Col, Row, Stack } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getQuizeQuestions } from '../Redux/QuizSlice/QuizeActions'

export default function QuizStart() {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {quizeQuestions} = useSelector(((state)=>state && state.Quiz))

  const gotoTest = () =>{
    if(quizeQuestions.length > 0){
      navigate('/quizTest')
    }else{
      alert("Refresh the page ")
    }
  }

  useEffect(() => {
    dispatch(getQuizeQuestions())
  }, []);

  return (
    <>
      <section id='quize-background'>
        <Row className='d-flex align-items-center vh-100 g-0'>
          <Col lg={6} className='mx-auto'>
              <Card className='text-center shadow py-4'>
                <Stack gap={5}>
                <h3>Welcome to Quiz Competition</h3>
                <div>
                  <Button onClick={gotoTest}><FontAwesomeIcon icon={faHandPointRight} className='fs-5 pe-2' />Start Quiz</Button>
                </div>
                </Stack>
              </Card>
          </Col>  
        </Row>  
      </section>      
    </>
  )
}
