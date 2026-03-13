import './Main.css'
import { languages } from '../languages'
import { useState } from 'react'
import clsx from 'clsx'
import {getFarewellText, getRandomWord} from '../utils.js'

export default function Main(){

    const [currentWord, setCurrentWord] = useState(getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([])

    let wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length
    let isGameWon = currentWord.split('').every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost
    const lastGuessedLetter = guessedLetters[guessedLetters.length -1]
    const isLastGuessedIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
    let numGuessesLeft = languages.length - 1 - wrongGuessCount

    function addGuessedLetter(letter){
        setGuessedLetters(prevLetters => 
            prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
        )}

    const alphabet = "abcdefghijklmnopqrstuvwxyz"



    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letters"
        )
        return(
        <span key = {index} className={letterClassName} >{shouldRevealLetter ? letter.toUpperCase() : ""}</span>
        )
})
    let languagesList = languages.map( (lang, index) => 
        {
            const isLanguageLost = index < wrongGuessCount
            const styles = {  
                backgroundColor : lang.backgroundColor,
                color: lang.color
            }    
        return(
        <span key={lang.name} className={`chip ${isLanguageLost ? "lost" : ""}`} style={styles }>{lang.name}</span>
            )
        }
    )

    let keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })

        return(
            <button 
                onClick={() => addGuessedLetter(letter)} 
                key={letter}
                disabled = {isGameOver} 
                aria-disabled = {guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                className={className}
            >
                {letter.toUpperCase()}
            </button>
        )
})

    function renderGameStatus(){
        if(!isGameOver && isLastGuessedIncorrect){
            return (
                    <p 
                        className='farewell-message'
                    >
                        {getFarewellText(languages[wrongGuessCount - 1].name)}
                    </p>
            )
        }

        
        
        if(isGameWon){
            return(
                <>
                    <h2>You win!</h2>
                    <p>Well done!</p>
                </>
            )
        }if (isGameLost){
            return(
                <>
                    <h2>Game over!</h2>
                    <p>You lost! Start a new game and test your luck!</p>
                </>
            )
        }
        return null
    }

    function startNewGame(){
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessedIncorrect
    })



    return(
        <main>
            <header>
                <h1>Assembly: The Game</h1>
                <p>Guess the word within 8 attempts like in Wordle game!</p>
            </header>
            <section aria-live='polite' role="status" className={gameStatusClass}>
                {renderGameStatus()}
            </section>
            <section className='language-chips'>
                {languagesList}
            </section>
            <section  className='word'>
                {letterElements}
            </section>

            <section className='sr-only' aria-live='polite' role='status'>
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                    `Correct! The letter ${lastGuessedLetter} is in the word` : 
                    `Sorry, the letter ${lastGuessedLetter} is not in the word`    
                    }
                    You have {numGuessesLeft} attempts left.  
                </p>
                <p>Current word: {currentWord.split('').map(letter => 
                    guessedLetters.includes(letter) ? letter + '.' : "blank.")
                    .join(" ")
                    }
                </p>
            </section>

            <section className='keyboard'>
                {keyboardElements}
            </section>
            {isGameOver && <button onClick={startNewGame} className='new-game'>New Game</button>}
        </main>
    )
}