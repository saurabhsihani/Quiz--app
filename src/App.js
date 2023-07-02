import React from 'react'
import { useGlobalContext } from './context'

import SetupForm from './SetupForm'
import Loading from './Loading'
import Modal from './Modal'

function App() {
  const { waiting, loading, correct, questions, index, nextQuestion, checkAnswer } = useGlobalContext();

  if(waiting) {
    return <SetupForm />;
  }
  if(loading) {
    return <Loading />;
  }

  const { question, correct_answer, incorrect_answers } = questions[index];

  const answers = [...incorrect_answers];
  const correctIndex = Math.floor(Math.random() * 4);
  if(correctIndex === 3) {
    answers.push(correct_answer);
  }
  else {
    answers.push(answers[correctIndex]);
    answers[correctIndex] = correct_answer;
  }

  return (
    <main>
      <Modal />
      <section className='quiz'>
        <p className='correct-answers'>
          correct answers : {correct} / {index}
        </p>
        <article className='container'>
          <h2 dangerouslySetInnerHTML={{ __html: question}} />
          <div className='btn-container'>
            {answers.map((answer, index) => {
              return (
                <button 
                  key={index} 
                  className='answer-btn' 
                  onClick={() => checkAnswer(index === correctIndex)}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              )
            })}
          </div>
        </article>
        <button className='next-question' onClick={nextQuestion}>
          next question
        </button>
      </section>
    </main>
  )
}

export default App
