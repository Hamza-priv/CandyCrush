import React, { useState, useEffect } from "react";
import blueCandy from '../images/blue.png'
import greenCandy from '../images/green.png'
import orangeCandy from '../images/orange.png'
import purpleCandy from '../images/purple.png'
import redCandy from '../images/red.png'
import yellowCandy from '../images/yellow.png'
import blank from '../images/blank.png'
import ScoreBoard from "./ScoreBoard";

const width = 8;
const height = 8;
const candyColors = [blueCandy, greenCandy, orangeCandy, purpleCandy, yellowCandy, redCandy];

function Board() {
    const [CurrentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [SquareReplaced, setSquareReplaced] = useState(null);
    const [SqaureDragged, setSqaureDragged] = useState(null);
    const [Score, setScore] = useState(0);

    const checkForColumnOfFour = () => {
        //Stopping at 39 because we cant further loop
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + height, i + height * 2, i + height * 3];
            const decidedColor = CurrentColorArrangement[i];
            const isBlank = CurrentColorArrangement[i] === blank

            if (
                columnOfFour.every(
                    (square) => CurrentColorArrangement[square] === decidedColor
                    && !isBlank
                )
            ) {
                setScore(Score+4)
                columnOfFour.forEach(
                    (square) => (CurrentColorArrangement[square] = blank)
                );

                return true;
            }
        }
    };

    const checkForRowOfFour = () => {
        for (let i = 0; i <= 64; i++) {
            const RowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = CurrentColorArrangement[i];
            const invalidIndex = [
                5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
                54, 55, 62, 63, 64,
            ];
            const isBlank = CurrentColorArrangement[i] === blank

            if (invalidIndex.includes(i)) continue;
            if (
                RowOfFour.every(
                    (square) => CurrentColorArrangement[square] === decidedColor
                    && !isBlank
                )
            ) {
                setScore(Score+4)
                RowOfFour.forEach((square) => (CurrentColorArrangement[square] = blank));
                return true;
            }
        }
    };

    const checkForRowOfThree = () => {
        for (let i = 0; i <= 64; i++) {
            const RowOfThree = [i, i + 1, i + 2];
            const decidedColor = CurrentColorArrangement[i];
            const invalidIndex = [
                6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
            ];
            const isBlank = CurrentColorArrangement[i] === blank

            if (invalidIndex.includes(i)) continue;
            if (
                RowOfThree.every(
                    (square) => CurrentColorArrangement[square] === decidedColor &&
                    !isBlank
                )
            ) {
                setScore(Score+3)
                RowOfThree.forEach((square) => (CurrentColorArrangement[square] = blank));
                return true;
            }
        }
    };

    const checkForColumnOfThree = () => {
        //Stopping at 47 because we cant further loop
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + height, i + height * 2];
            const decidedColor = CurrentColorArrangement[i];
            const isBlank = CurrentColorArrangement[i] === blank
            if (
                columnOfThree.every(
                    (square) => CurrentColorArrangement[square] === decidedColor && 
                    !isBlank
                )
            ) {
                setScore(Score+3)
                columnOfThree.forEach(
                    (square) => (CurrentColorArrangement[square] = blank)
                );
                return true;
            }
        }
    };

    const dragStart = (e) => {
        console.log("DS");
        setSqaureDragged(e.target);
        console.log(e.target);
    };

    const dragDrop = (e) => {
        console.log("DD");
        setSquareReplaced(e.target);
        console.log(e.target);
    };

    const dragEnd = (e) => {
        const sqaureDraggedID = parseInt(SqaureDragged.getAttribute("data-id"));
        const sqaureReplacedID = parseInt(SquareReplaced.getAttribute("data-id"));

        CurrentColorArrangement[sqaureReplacedID] =
            SqaureDragged.getAttribute("src")
        CurrentColorArrangement[sqaureDraggedID] =
            SquareReplaced.getAttribute("src")

        console.log("R" + sqaureReplacedID);
        console.log("D" + sqaureDraggedID);

        const validMoves = [
            //for left movement
            sqaureDraggedID - 1,
            //for upper movement
            sqaureDraggedID - width,
            //for RM
            sqaureDraggedID + 1,
            //for LM
            sqaureDraggedID + width,
        ];
        console.log(validMoves);
        const isValidMove = validMoves.includes(sqaureReplacedID);
        console.log("move" + isValidMove);
        const isRowThree = checkForRowOfThree();
        const isRowFour = checkForRowOfFour();
        const isColumnThree = checkForColumnOfThree();
        const isColumnFour = checkForColumnOfFour();

        if (
            isValidMove &&
            (isRowFour || isColumnFour || isColumnThree || isRowThree)
        ) {
            setSqaureDragged(null);
            setSquareReplaced(null);
        } else {
            CurrentColorArrangement[sqaureReplacedID] =
                SquareReplaced.getAttribute("src")
            CurrentColorArrangement[sqaureDraggedID] =
                SqaureDragged.getAttribute("src")
        }
    };

    const CreateBoard = () => {
        const randomColorArrangment = [];
        for (let index = 0; index < width * height; index++) {
            const randomColor =
                candyColors[Math.floor(Math.random() * candyColors.length)];
            randomColorArrangment.push(randomColor);
        }
        setCurrentColorArrangement(randomColorArrangment);
    };

    const moveIntoSquareBelow = () => {
        //looping till 2nd last row
        for (let i = 0; i <= 55; i++) {
            const FirstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = FirstRow.includes(i);

            if (isFirstRow && CurrentColorArrangement[i] === blank) {
                let newColorNumber = Math.floor(Math.random() * candyColors.length);
                CurrentColorArrangement[i] = candyColors[newColorNumber];
            }
            if (CurrentColorArrangement[i + width] === blank) {
                //set lower to upper one
                CurrentColorArrangement[i + width] = CurrentColorArrangement[i];
                //set upper to lower
                CurrentColorArrangement[i] = blank;
            }
        }
    };

    useEffect(() => {
        CreateBoard();
        setScore(0);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour();
            checkForRowOfFour();
            checkForColumnOfThree();
            checkForRowOfThree();
            moveIntoSquareBelow();
            setCurrentColorArrangement([...CurrentColorArrangement]);
        }, 100);
        return () => clearInterval(timer);
    }, [
        checkForColumnOfFour,
        moveIntoSquareBelow,
        checkForRowOfFour,
        checkForColumnOfThree,
        checkForRowOfThree,
        CurrentColorArrangement,
    ]);

    console.log(CurrentColorArrangement);

    return (
        <>
        <ScoreBoard score={Score}/>
        <div className="GameContainer">
            <div className="GameBoard">
                {CurrentColorArrangement.map((CandyColor, index) => (
                    <img
                        key={index}
                        src = {CandyColor}
                        alt={CandyColor}
                        data-id={index}
                        draggable={true}
                        
                        onDragStart={dragStart}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnd={dragEnd}
                        onDrop={dragDrop}
                    />
                ))}
            </div>
        </div>
    </>
    );
}

export default Board;
