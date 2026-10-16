import React, { useState } from 'react';
import { soundHaptics } from '../../utils/haptics';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    soundHaptics.playClick(900, 0.05);
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    soundHaptics.playClick(900, 0.05);
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    soundHaptics.playClick(750, 0.05);
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    soundHaptics.playClick(850, 0.05);
    setDisplay((prev) => (parseFloat(prev) * -1).toString());
  };

  const inputPercent = () => {
    soundHaptics.playClick(850, 0.05);
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const performOperation = (nextOperator: string) => {
    soundHaptics.playClick(1000, 0.06);
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      let newValue = currentValue;

      if (operator === '+') newValue = currentValue + inputValue;
      else if (operator === '-') newValue = currentValue - inputValue;
      else if (operator === '×') newValue = currentValue * inputValue;
      else if (operator === '÷') newValue = currentValue / inputValue;

      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator === '=' ? null : nextOperator);
  };

  return (
    <div className="w-full h-full bg-black text-white pt-14 pb-16 px-5 flex flex-col justify-end select-none">
      {/* Calculator Display */}
      <div className="text-right pb-4 px-2 overflow-hidden">
        <span
          className={`font-light font-mono tracking-tight tabular-nums block truncate ${
            display.length > 7 ? 'text-5xl' : 'text-7xl'
          }`}
        >
          {display}
        </span>
      </div>

      {/* Button Grid (Classic Apple Round Calculator) */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button
          onClick={clear}
          className="h-16 rounded-full bg-neutral-400 text-black font-semibold text-xl active:bg-neutral-300"
        >
          {display !== '0' ? 'C' : 'AC'}
        </button>
        <button
          onClick={toggleSign}
          className="h-16 rounded-full bg-neutral-400 text-black font-semibold text-xl active:bg-neutral-300"
        >
          ±
        </button>
        <button
          onClick={inputPercent}
          className="h-16 rounded-full bg-neutral-400 text-black font-semibold text-xl active:bg-neutral-300"
        >
          %
        </button>
        <button
          onClick={() => performOperation('÷')}
          className={`h-16 rounded-full text-white font-semibold text-2xl active:bg-amber-300 ${
            operator === '÷' ? 'bg-white text-amber-500' : 'bg-amber-500'
          }`}
        >
          ÷
        </button>

        {/* Row 2 */}
        {['7', '8', '9'].map((d) => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className="h-16 rounded-full bg-neutral-800 text-white font-medium text-2xl active:bg-neutral-700"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('×')}
          className={`h-16 rounded-full text-white font-semibold text-2xl active:bg-amber-300 ${
            operator === '×' ? 'bg-white text-amber-500' : 'bg-amber-500'
          }`}
        >
          ×
        </button>

        {/* Row 3 */}
        {['4', '5', '6'].map((d) => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className="h-16 rounded-full bg-neutral-800 text-white font-medium text-2xl active:bg-neutral-700"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('-')}
          className={`h-16 rounded-full text-white font-semibold text-2xl active:bg-amber-300 ${
            operator === '-' ? 'bg-white text-amber-500' : 'bg-amber-500'
          }`}
        >
          -
        </button>

        {/* Row 4 */}
        {['1', '2', '3'].map((d) => (
          <button
            key={d}
            onClick={() => inputDigit(d)}
            className="h-16 rounded-full bg-neutral-800 text-white font-medium text-2xl active:bg-neutral-700"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => performOperation('+')}
          className={`h-16 rounded-full text-white font-semibold text-2xl active:bg-amber-300 ${
            operator === '+' ? 'bg-white text-amber-500' : 'bg-amber-500'
          }`}
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 h-16 rounded-full bg-neutral-800 text-white font-medium text-2xl text-left pl-7 active:bg-neutral-700"
        >
          0
        </button>
        <button
          onClick={inputDot}
          className="h-16 rounded-full bg-neutral-800 text-white font-medium text-2xl active:bg-neutral-700"
        >
          .
        </button>
        <button
          onClick={() => performOperation('=')}
          className="h-16 rounded-full bg-amber-500 text-white font-semibold text-2xl active:bg-amber-400"
        >
          =
        </button>
      </div>
    </div>
  );
};
