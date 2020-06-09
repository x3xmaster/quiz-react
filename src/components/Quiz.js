import React, { useState, useEffect } from 'react'
import { quizData } from "./quizData";

export default () => {
    //initialState
    const [questions, setQuestions] = useState([])
    const [score, setScore] = useState(0)
    const [answer, setAnswer] = useState(0)
    const [answerList, setAnswerList] = useState([])
    const [current, setCurrent] = useState(0)
    const [currentPair, setCurrentPair] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [win, setWin] = useState(false)
    const [isEnd, setIsEnd] = useState(false)
    const [isSettings, setIsSettings] = useState(false)
    const [temp, setTemp] = useState("celsiu")

    //refresh only if [questions] update
    useEffect(() => {
        setQuestions(quizData)
    }, [questions])

    useEffect(() => {
        getPair();
    })

    //get pair of cities
    const getPair = () => {
        questions.map((value, i) => {
            if(current === i) {
                setCurrentPair(
                    value.options
                )
            }
        })
    }

    const checkAnswer = name => {
        if(disabled || current === questions.length) {
            return false
        }
        if(name === questions[current].answer){
            setScore(score +1)
            setWin(true)
        }
        setDisabled(true)
        setAnswer(name)  
    }

    const nextQuestion = () => {
        if(current === questions.length -1) {
            setIsEnd(true)
        }
        setWin(false)
        setCurrent(current +1)
        setAnswerList([...answerList, answer])
        getPair()
        setDisabled(false)
    }

    const Results = () => {
        const getFahrenheTemp = (t) =>{
           return (t * 9/5) + 32
        }
        return (
            <>
                <SettingsButton />
                <h1>Results</h1>
                {questions.map((item, i) => (
                    <div className="questionWrapper resultWrapper" key={i}>
                         {item.options.map((option, j) => (
                            <div key={j}>
                                {option.name}
                                <p>{(temp === "celsiu") ? option.temperature + "°C" : getFahrenheTemp(option.temperature) +"°F"}</p>
                            </div>
                        ))}
                        {(answerList.includes(item.answer))? <img src="../icons/yes.svg" /> : <img src="../icons/no.svg" />}
                    </div>
                ))}
            </>
        );
    }   

    const SettingsButton = () => {
        return ( 
            <button className="btn-grey" onClick={() => setIsSettings(!isSettings)}>{(isSettings) ? "Back" : "Settings"}</button>
        )
    }

    const onValueChange = (e) => {
        setTemp(e.target.value)
    }

    const Settings = () => {
        return (
            <div className="settings">
                <SettingsButton />
                <h2>Settings</h2>
                <div className="setting-inner">
                    <span>Units</span>
                    <label forhtml="celsiu">
                        <input type="radio" value="celsiu" id="celsiu" checked={temp === "celsiu"} onChange={onValueChange} />
                        Celsiu
                    </label>
                    <label forhtml="fahrenhe">
                        <input type="radio" value="fahrenhe" id="fahrenhe" checked={temp === "fahrenhe"} onChange={onValueChange} />
                        Fahrenhe
                    </label>
                </div>
            </div>
        )
    }

    const Main = () => {
        return (
            <>
                <h1>Which city is hotter?</h1>
                {disabled && win && (<div><b>You win!</b></div>)}
                {disabled && !win && (<div><b>You lost!</b></div>)}

                <div>Scores: {score}</div>
                <div className="questionWrapper">
                    {currentPair.map((item, i) => (
                        <div key={i} className={`${answer === item.name ? "selected" : ""}`} onClick={() => checkAnswer(item.name)}>
                            {item.name}
                        </div>
                    ))}
                </div>
                {disabled && current < questions.length - 1 &&  (
                    <button onClick={() => nextQuestion()}>Next cities</button>
                )}

                {disabled && current === questions.length - 1 && (
                    <button onClick={() => nextQuestion()}>Finish</button>
                )}
            </>
        );
    }

    if (isEnd && !isSettings)  return (<Results />)
    else if (isSettings) return (<Settings />) 
    else return ( <Main />)
}


