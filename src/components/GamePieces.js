import React, { useState, useEffect, useRef } from "react";

const GamePieces = ({ score, setScore, onGameOver }) => {
  const canvasRef = useRef();
  const [speed, setSpeed] = useState(10);
  const [apple, setApple] = useState({ x: 180, y: 100, size: 12 });
  const [pineapple, setPineapple] = useState({ x: -100, y: -100, size: 20 });
  const [snake, setSnake] = useState([
    { x: 100, y: 50 },
    { x: 85, y: 50 },
  ]);
  const [direction, setDirection] = useState(null);
  const [applesEaten, setApplesEaten] = useState(0);
  const [pineappleVisible, setPineappleVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth * 0.5;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const getBackgroundColor = () => {
      if (score < 5) return "#f0f8ff";
      if (score < 10) return "#faebd7";
      return "#ffebcd";
    };

    const drawSnake = () => {
      ctx.fillStyle = "#90EE90";
      snake.forEach((snakePart, index) => {
        if (index === 0) {
          ctx.font = "14px Arial";
          ctx.fillText('🐍', snakePart.x, snakePart.y);
        } else {
          ctx.fillRect(snakePart.x, snakePart.y, 14, 14);
        }
      });
    };

    const drawApple = () => {
      ctx.font = "12px Arial";
      ctx.fillText('🍎', apple.x, apple.y);
    };

    const drawPineapple = () => {
      if (pineappleVisible) {
        ctx.font = "20px Arial";
        ctx.fillText('🍍', pineapple.x, pineapple.y);
      }
    };

    const moveSnake = () => {
      if (direction) {
        setSnake((prevSnake) => {
          const newSnake = [...prevSnake];
          const snakeHead = { ...newSnake[0] };

          for (let i = newSnake.length - 1; i > 0; i--) {
            newSnake[i] = { ...newSnake[i - 1] };
          }

          switch (direction) {
            case "right":
              snakeHead.x += speed;
              break;
            case "left":
              snakeHead.x -= speed;
              break;
            case "up":
              snakeHead.y -= speed;
              break;
            case "down":
              snakeHead.y += speed;
              break;
            default:
              break;
          }

          newSnake[0] = snakeHead;

          handleAppleCollision(newSnake);
          handlePineappleCollision(newSnake);
          handleWallCollision(snakeHead);
          handleBodyCollision(newSnake);

          return newSnake;
        });
      }
    };

    const handleWallCollision = (snakeHead) => {
      if (snakeHead.x >= canvas.width || snakeHead.x < 0 || snakeHead.y >= canvas.height || snakeHead.y < 0) {
        onGameOver("wall");
      }
    };

    const handleBodyCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      for (let i = 1; i < newSnake.length; i++) {
        if (snakeHead.x === newSnake[i].x && snakeHead.y === newSnake[i].y) {
          onGameOver("self");
        }
      }
    };

    const handleAppleCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      const appleEndX = apple.x + apple.size;
      const appleEndY = apple.y + apple.size;
      const snakeHeadEndX = snakeHead.x + 14;
      const snakeHeadEndY = snakeHead.y + 14;

      if (
        snakeHead.x < appleEndX &&
        snakeHeadEndX > apple.x &&
        snakeHead.y < appleEndY &&
        snakeHeadEndY > apple.y
      ) {
        setScore((prevScore) => prevScore + 1);
        setApplesEaten((prevCount) => prevCount + 1);

        setApple({
          x: Math.floor((Math.random() * (canvas.width - apple.size)) / speed) * speed,
          y: Math.floor((Math.random() * (canvas.height - apple.size)) / speed) * speed,
          size: apple.size,
        });

        newSnake.push({ ...newSnake[newSnake.length - 1] });

        if (applesEaten >= 4) {
          setPineapple({
            x: Math.floor((Math.random() * (canvas.width - 20)) / speed) * speed,
            y: Math.floor((Math.random() * (canvas.height - 20)) / speed) * speed,
            size: 20,
          });
          setPineappleVisible(true);

          setTimeout(() => {
            setPineappleVisible(false);
          }, 6000);
        }
      }
    };

    const handlePineappleCollision = (newSnake) => {
      const snakeHead = newSnake[0];
      const pineappleEndX = pineapple.x + pineapple.size;
      const pineappleEndY = pineapple.y + pineapple.size;
      const snakeHeadEndX = snakeHead.x + 14;
      const snakeHeadEndY = snakeHead.y + 14;

      if (
        snakeHead.x < pineappleEndX &&
        snakeHeadEndX > pineapple.x &&
        snakeHead.y < pineappleEndY &&
        snakeHeadEndY > pineapple.y
      ) {
        setScore((prevScore) => prevScore + 5);
        setPineapple({ x: -100, y: -100, size: 20 });
        setPineappleVisible(false);
        setApplesEaten(0);
      }
    };

    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowRight":
          setDirection("right");
          break;
        case "ArrowLeft":
          setDirection("left");
          break;
        case "ArrowUp":
          setDirection("up");
          break;
        case "ArrowDown":
          setDirection("down");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const newIntervalId = setInterval(() => {
      ctx.fillStyle = getBackgroundColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawSnake();
      drawApple();
      drawPineapple();
      moveSnake();
    }, 100 - speed);

    return () => {
      clearInterval(newIntervalId);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [snake, direction, apple, pineapple, applesEaten, score, pineappleVisible, speed, onGameOver, setScore]);

  const increaseSpeed = () => {
    setSpeed((prevSpeed) => Math.min(prevSpeed + 2, 20));
  };

  const decreaseSpeed = () => {
    setSpeed((prevSpeed) => Math.max(prevSpeed - 2, 2));
  };

  return (
    <div className="relative w-full h-full">
      <div className="text-center">
        <button
          onClick={increaseSpeed}
          className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        >
          Increase Speed
        </button>
        <button
          onClick={decreaseSpeed}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition mt-2"
        >
          Decrease Speed
        </button>
      </div>
      <canvas className="border-2 border-gray-300 mx-auto w-1/2 h-full" ref={canvasRef} />
    </div>
  );
};

export default GamePieces;
