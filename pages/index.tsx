import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Cohete from "../public/img/cohete.gif";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Calculator = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    setHistory(storedHistory);

    const handleKeyPress = (e) => {
      const key = e.key;

      if ("0123456789".includes(key)) {
        updateInput(key);
      } else if (key === "Backspace") {
        deleteLastDigit();
      } else if (key === "Enter") {
        calculateResult();
      } else if (["+", "-", "*", "/"].includes(key)) {
        handleOperator(key === "*" ? "x" : key === "/" ? "÷" : key);
      } else if (key === "Escape") {
        clearCalculator();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [input, history]);

  const handleClick = (btn) => {
    switch (btn) {
      case "C":
        clearCalculator();
        break;
      case "⌫":
        deleteLastDigit();
        break;
      case "=":
        calculateResult();
        break;
      case "+":
      case "-":
      case "x":
      case "÷":
        handleOperator(btn);
        break;
      default:
        updateInput(btn);
        break;
    }
  };

  const clearCalculator = () => {
    setInput("");
    setLastResult(null);
  };

  const deleteLastDigit = () => {
    setInput(input.slice(0, -1));
  };

  const handleOperator = (operator) => {
    if (input && !["+", "-", "x", "÷"].includes(input.slice(-1))) {
      setInput((prevInput) => prevInput + operator);
    }
  };

  const updateInput = (btn) => {
    if (lastResult !== null) {
      setInput(btn);
      setLastResult(null);
    } else {
      setInput((prevInput) => prevInput + btn);
    }
  };

  const calculateResult = () => {
    try {
      let expression = input
        .replace(/x/g, "*")
        .replace(/÷/g, "/");

      const result = eval(expression);

      if (result === Infinity || result === -Infinity) {
        throw new Error("Error: División por cero");
      }

      setInput(result.toString());
      setLastResult(result);
      saveHistory(input, result);
    } catch (error) {
      setInput(error.message);
      setLastResult(null);
    }
  };

  const saveHistory = (expression, result) => {
    const newHistory = [
      ...history,
      { calculation: expression, result },
    ];
    setHistory(newHistory);
    localStorage.setItem("calcHistory", JSON.stringify(newHistory));
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("calcHistory");
  };

  return (
    <div className="relative w-full max-w-md p-6 bg-slate-100 rounded-lg shadow-lg sm:mt-20">
      {showHistory && (
        <div className="absolute top-0 left-0 w-full flex-col bg-slate-100 bg-opacity-70 flex items-center justify-center z-10 p-4 h-full">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-xl font-bold">Historial</h3>
            {history.length === 0 ? (
              <div></div>
            ) : (
              <button
                onClick={clearHistory}
                className="text-blue-400 flex justify-center items-center text-center font-bold text-2xl"
              >
                <span className="icon-[tdesign--clear-formatting-1-filled]"></span>
              </button>
            )}
            <button
              onClick={toggleHistory}
              className="text-red-600 flex justify-center items-center text-center font-bold text-2xl"
            >
              <span className="icon-[solar--close-square-bold]"></span>
            </button>
          </div>
          <div className="bg-slate-100 p-2 rounded-lg overflow-y-auto w-full h-full">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <img src={Cohete.src} alt="Cohete" />
                <h6 className="font-extrabold text-3xl">No hay historial</h6>
              </div>
            ) : (
              <ul>
                {history.map((entry, index) => (
                  <li key={index} className="mb-2">
                    <div>{entry.calculation}</div>
                    <div className="text-green-500">= {entry.result}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div className={`relative z-20 ${showHistory ? "opacity-0 pointer-events-none" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Calculadora</h1>
          <button
            className="p-2 text-2xl"
            onClick={toggleHistory}
          >
            <span className="icon-[material-symbols--history]"></span>
          </button>
        </div>

        <div className="bg-slate-200 flex justify-end items-center w-full h-20 rounded-xl px-4 text-4xl">
          <input
            type="text"
            value={input}
            readOnly
            className="w-full bg-transparent text-right text-4xl outline-none"
          />
        </div>

        <div className="grid grid-cols-4 grid-rows-5 gap-4 mt-4">
          {["C", "⌫", "÷", "x", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "=", "0", "."].map((btn, index) => (
            <button
              key={index}
              onClick={() => handleClick(btn)}
              className={`flex justify-center items-center text-xl font-medium rounded-xl p-4 transition-all ${btn === "C" || btn === "⌫"
                  ? "bg-red-300"
                  : btn === "="
                    ? "bg-green-300 row-span-2"
                    : "bg-slate-200"
                }`}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
