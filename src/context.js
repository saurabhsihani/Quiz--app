// import axios from 'axios'
import React, { useState, useContext } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy'
  });

  const fetchQuestions = async () => {
    setLoading(true);
    setWaiting(false);
    const url = `${API_ENDPOINT}amount=${quiz.amount}&category=${table[quiz.category]}&difficulty=${quiz.difficulty}&type=multiple`;

    try {
      const response = await fetch(url);
      const jsonData = await response.json();

      if(jsonData.response_code === 0) {
        setQuestions(jsonData.results);
        setError(false);
      }
      else {
        setError(true);
        setWaiting(true);
      }
    }
    catch(err) {
      console.log(err);
      setError(true);
      setWaiting(true);
    }
    setLoading(false);
  }

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setQuiz(oldVal => {
      return { ...oldVal, [name]: value };
    });
  }

  const handleSubmit = event => {
    event.preventDefault();
    fetchQuestions();
  }

  const restart = () => {
    setWaiting(true);
    setCorrect(0);
    setModalOpen(false);
  }

  const nextQuestion = () => {
    setIndex(i => {
      if(i === questions.length - 1) {
        setModalOpen(true);
        return 0;
      }
      return i + 1;
    });
  }

  const checkAnswer = value => {
    if(value) {
      setCorrect(c => c + 1);
    }
    nextQuestion();
  }

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        quiz,
        handleChange,
        handleSubmit,
        questions,
        index,
        correct,
        isModalOpen,
        error,
        restart,
        nextQuestion,
        checkAnswer
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
