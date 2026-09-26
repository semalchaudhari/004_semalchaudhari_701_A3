import { useState } from 'react';
import axios from 'axios';

function App() {
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);

  const convertCurrency = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/currency?from=USD&to=INR&amount=${amount}`
      );

      setResult(response.data.rates.INR);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Currency Converter</h2>

      <input
        type="number"
        placeholder="Enter USD"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={convertCurrency}>
        Convert to INR
      </button>

      {result && (
        <h3>INR: ₹{result}</h3>
      )}
    </div>
  )
}

export default App
