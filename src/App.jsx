import React from "react";
import { useRef, useState, useCallback, useEffect } from 'react';

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 0; i < length; i++) {
      const charIndex = Math.floor(Math.random() * str.length);
      pass += str.charAt(charIndex);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 999);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [password]);

  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (numberAllowed) score++;
    if (charAllowed) score++;
    if (password.length > 15) score++;
    return ["Weak", "Medium", "Strong", "Very Strong"][score] || "Very Weak";
  };

  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  return (
    <>
      <div className="w-full max-w-md mx-auto shadow-lg rounded-lg px-4 my-8 text-orange-500 bg-gray-800 py-6">
        <h1 className="text-white text-center text-2xl font-bold mb-4">
          🔐 Password Generator
        </h1>

        <div className="flex items-center shadow rounded-lg overflow-hidden mb-4 bg-white">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            className="outline-none w-full py-2 px-3 text-black"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex justify-between mb-3">
          <button
            onClick={passwordGenerator}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Refresh 🔁
          </button>
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded"
          >
            {showPassword ? "Hide 🙈" : "Show 👁️"}
          </button>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white">
          <div className="flex items-center gap-x-2">
            <label htmlFor="length">Length: {length}</label>
            <input
              type="range"
              id="length"
              min={6}
              max={32}
              value={length}
              className="w-full"
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              id="numbers"
              checked={numberAllowed}
              onChange={() => setNumberAllowed((prev) => !prev)}
            />
            <label htmlFor="numbers">Include Numbers</label>
          </div>

          <div className="flex items-center gap-x-2">
            <input
              type="checkbox"
              id="specialChars"
              checked={charAllowed}
              onChange={() => setCharAllowed((prev) => !prev)}
            />
            <label htmlFor="specialChars">Include Special Characters</label>
          </div>

          <div className="mt-3">
            <p>
              <span className="font-semibold text-white">Strength:</span>{" "}
              <span
                className={`font-bold ${
                  getStrength() === "Strong" || getStrength() === "Very Strong"
                    ? "text-green-400"
                    : getStrength() === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {getStrength()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
