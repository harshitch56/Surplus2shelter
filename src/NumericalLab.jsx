import React, { useState } from "react";

export default function NumericalLab() {
  const [method, setMethod] = useState("trapezoidal");
  const [times, setTimes] = useState("10,12,14,16");
  const [rates, setRates] = useState("5,8,6,4");
  const [a, setA] = useState("1");
  const [b, setB] = useState("2");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function calculate() {
    setLoading(true);
    setResult(null);

    try {
      const endpoint = method === "trapezoidal"
        ? "trapezoidal"
        : "bisection";

      const body = method === "trapezoidal"
        ? {
            times: times.split(",").map(Number),
            rates: rates.split(",").map(Number)
          }
        : {
            a: Number(a),
            b: Number(b),
            tolerance: 0.0001
          };

      const response = await fetch(
        `http://127.0.0.1:5001/api/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Calculation failed");
      }

      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }

    setLoading(false);
  }

  return (
    <section style={{
      padding: "60px 6%",
      color: "#294b5c",
      background: "rgba(255,255,255,.35)",
      borderRadius: 25
    }}>
      <h1>Numerical Methods Lab</h1>
      <p>Python-powered numerical calculations</p>

      <div style={{ display: "flex", gap: 12, margin: "25px 0" }}>
        <button onClick={() => {
          setMethod("trapezoidal");
          setResult(null);
        }}>Trapezoidal Rule</button>

        <button onClick={() => {
          setMethod("bisection");
          setResult(null);
        }}>Bisection Method</button>
      </div>

      {method === "trapezoidal" ? (
        <>
          <h3>Food Collection Calculation</h3>
          <p>Enter time intervals (hours)</p>
          <input value={times}
            onChange={e => setTimes(e.target.value)}
            placeholder="10,12,14,16" />

          <p>Enter collection rates (kg/hour)</p>
          <input value={rates}
            onChange={e => setRates(e.target.value)}
            placeholder="5,8,6,4" />
        </>
      ) : (
        <>
          <h3>Bisection Method</h3>
          <p>Equation: f(x) = x³ − x − 2</p>
          <p>Lower limit (a)</p>
          <input value={a} onChange={e => setA(e.target.value)} />
          <p>Upper limit (b)</p>
          <input value={b} onChange={e => setB(e.target.value)} />
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={calculate} disabled={loading}>
          {loading ? "Calculating..." : "Calculate Result"}
        </button>
      </div>

      {result && (
        <div style={{
          marginTop: 25,
          padding: 20,
          borderRadius: 15,
          background: "rgba(255,255,255,.8)"
        }}>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <>
              <h3>Calculation Result</h3>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </>
          )}
        </div>
      )}
    </section>
  );
}