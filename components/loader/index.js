import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css'

export default function LoaderAntrian() {
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
        var row = 30
        let i = 0;
        while (row < 140) {
            const leftMargin = row + getRandom(7, 15)
            const widthR = getRandom(120, 180)
            const heightR = getRandom(70, 120)
            const zVar = getRandom(5, 30)

            const time = getRandom(1, 5)
            const data = {
                key: i + '',
                marginLeft: leftMargin + 'px',
                marginBottom: '40px',

                marginTop: '40px',
                zIndex: zVar + '',
                position: 'absolute',
                width: '10px',
                height: heightR + 'px',
                backgroundColor: randomGreyHex(),
                animationDuration: Math.round(time)+'s'
            }
            row = leftMargin
            styelJSList.push(data)
            i++;
        }

        const RedItem = getRandom(0, styelJSList.length - 3)
        styelJSList[Math.round(RedItem)].backgroundColor = '#ff0000'
        setBoxes(shuffle(styelJSList));

    }
    useEffect(() => {
        // Update the document title using the browser API
        generateRandom();
    }, []);
    return (
        <div className={styles.boxes_loader_antrian} style={{}}>
            <div className={styles.box_loader_antrian}>
                {boxes.map((box, index) => (
                    <div key={index} className={styles.boxloader} style={box}>
                    </div>
                ))}
                <div className={styles.loader_round}></div>
            </div>
        </div>);
}