import React, {useEffect, useState, useRef} from 'react';
import importText from '../../assets/new-composers'
import keyboard from '../../assets/keyboard.svg'
import info from '../../assets/information.svg'

const texts=[
    (importText.substring(0,1000)+"...").split(""),
    (importText.substring(1509, 2509)+"...").split(""),
    (importText.substring(3038, 4038)+"...").split(""),
    (importText.substring(4474, 5474)+"...").split(""),
    (importText.substring(6089, 7089)+"...").split(""),
]

let text = texts[0];
let ind;

const Home = ()=>{

    const [time, setTime] = useState(60);
    const [timer, setTimer] = useState(false);
    const [error, setError] = useState(0)
    const [correct, setCorrect] = useState(0);
    const [WPM, setWPM] = useState(null);
    const [curLetter, setCurLetter] = useState(0);
    const [textObj, setTextObj] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(()=>{
        if(time < 1){
            clearInterval(timer);
            setWPM(correct)
            setTimer(null);
        }
    },[time])

    const textRef = useRef(null);


    const startTimer = ()=>{
        if(timer) return;
        else{
            //increments the index or sets it to zero.
            ind = ind < texts.length - 1 ? ind+1 : 0;
            //makes new text to type from, resets everything.
            text = texts[ind];
            setTextObj(
                text.map(char=>{
                    return{
                        char:char,
                        checked:false,
                        invalid:false,
                    }
                })
            )
            setTimeout(()=>{setTime(60);},1000)
            setTimer(false);
            setError(0)
            setCorrect(0);
            setWPM(null);
            setCurLetter(0);
            setTimer(
                setInterval(()=>{
                    setTime(prevTime=>prevTime - 1);
                },1000)
            )
        }
    }

     //checks if what you are typing is correct
    function listenForStrokes(e){
       
        let curTime;
        setTime(prevTime=>{
            curTime = prevTime;
            return prevTime;
        })

        
        if(!curTime) return;

        let index;
        
        setCurLetter(prevLetter=>{
            index = prevLetter;
            return prevLetter;
        })

        let arr;

        setTextObj(prevObj=>{
            arr = [...prevObj];
            return prevObj;
        })

        if(!arr[index]) return;
        

        arr[index].checked = true;

        //incorrect
        if(arr[index].char != e.key){
            arr[index].invalid = true;
            setError(prevState=>prevState + 1);

        //correct
        }else{
            let inc = index % 3 ? 0 : 1;
            if(index > 50){
                textRef.current.scrollTop += inc;
            }
            
            arr[index].invalid = false;
            setCurLetter(prevLetter=>prevLetter + 1)
            if(
                !arr[index].char.match(/\w/i) && 
                arr[index - 1].char.match(/\w/i)
            ){
                setCorrect(prevState=>prevState+1)
            }
        }
        setTextObj(arr);
    }
    

    useEffect(()=>{
        ind = Math.floor(texts.length*Math.random())
        text = texts[ind];
        document.addEventListener('keypress',listenForStrokes);
        setTextObj(
            text.map(char=>{
                return{
                    char:char,
                    checked:true,
                    invalid:false,
                }
            })
        )
        const titleText = "Typing Speed Test"
        let i = 0;
        let interval = setInterval(()=>{
            if(i >= titleText.length){
                clearInterval(interval);
                return;
            }else{
                setTitle(prevTitle=>prevTitle+titleText.charAt(i))
                i++;
            }
        },25)
    },[])

    useEffect(() => {
        return () => {
            document.removeEventListener('keypress',listenForStrokes)
        }
    }, [])

    const styles = {
        checked:{
            background:"rgba(65, 165, 95,.5)",
            userSelect:"none"
        },
        invalid:{
            background:"rgba(201, 41, 41,.5)"
        },
        none:{
            background:"transparent",
            
        }
    }

    return(
        <div>
            <h1><img src={keyboard} alt=""/>{title}</h1>
            <em><img  src={info} alt=""/>  When typing, correct your errors before moving on to the next letter.</em>
            
            {!WPM && <div ref={textRef} style={{height:"250px", overflow: timer ? "scroll" : "hidden"}} className="paragraph-container scroll-y fade-in">
                <p
                style={{color: !timer ? "rgba(25,25,25,.0)" : "rgba(25,25,25)"}}
                >
                {textObj.map(char=>{
                    return(
                        <span
                            style={
                                char.checked && char.invalid ? styles.invalid
                                : char.checked && !char.invalid ? styles.checked
                                : styles.none
                            }
    
                        >{char.char}</span>
                    )
                })}
                </p>
                
            </div>}
            {WPM && <div className="paragraph-container">
                <h2>Your results</h2>
                <ul>
                    <li><strong>{WPM}</strong> words per minute</li>
                    <li><strong>{curLetter}</strong> characters typed</li>
                    <li><strong>{error}</strong> inaccurate characters</li>
                    <li><strong>{curLetter ? (Math.round((10000*(curLetter - error)/curLetter)))/100 : 0}% </strong> typing accuracy</li>
                    <li><strong> {curLetter ? Math.round(WPM*(Math.round((10000*(curLetter - error)/curLetter)))/10000) : 0}</strong> words per minute (adjusted) </li>
                    
                </ul>
                 
                </div>}
            {!timer && <button onClick={startTimer}>Start My Test</button>}
            {timer && <h3>{time}</h3>}
            {
                timer &&
                <div className="flex-container">
                <h4>Your errors: {error}</h4>
                <h4>Correct words: {correct}</h4>
                </div>
            }
           
        </div>
    )
}

export default Home;