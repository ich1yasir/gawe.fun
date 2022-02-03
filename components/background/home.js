
import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css'

export default function BackgroundHome() {
    const [boxes, setBoxes] = useState([]);
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
      }
    function randomGreyHex() {
        var v = (Math.random() * (230) | 150).toString(16);//bitwise OR. Gives value in the range 0-255 which is then converted to base 16 (hex).
        return "#" + v + v + v;
    }
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
    const generateRandom = () => {
        var styelJSList = []
        var row = -45
        for (let i = 0; i < 40; i++) {
            const topMargin = row + getRandom(3, 8)
            const widthR = getRandom(120, 180)
            const heightR = getRandom(10, 25)
            const zVar = getRandom(5, 30)
            const data = {
                key: i + '',
                margin: topMargin + '% 20% 0px -100%',
                zIndex: zVar + '',
                position: 'fixed',
                width: widthR + '%',
                height: heightR + '%',
                backgroundColor: randomGreyHex()
            }
            row = topMargin
            styelJSList.push(data)
        }
        setBoxes(shuffle(styelJSList));
    }
    useEffect(() => {
        // Update the document title using the browser API
        generateRandom();
    }, []);
    return (
        <div className={styles.background_boxes}>
            {boxes.map((box, index) => (
                <div key={index} className={styles.box1} style={box}>

                </div>
            ))}
        </div>);
}