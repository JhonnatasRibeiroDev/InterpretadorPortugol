import React, { useState } from "react";
import "./App.css";

function App() {
  const [codigo, setCodigo] = useState(`inicio
   escreva("Olá, mundo!")
fimalgoritmo`);
  const [resultado, setResultado] = useState("");

  const executarCodigo = async () => {
    try {
      const res = await fetch("http://localhost:5000/executar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      if (res.ok) {
        setResultado(data.saida);
      } else {
        setResultado(`Erro: ${data.erro}`);
      }
    } catch (error) {
      setResultado(`Erro de conexão: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Interpretador Portugol</h1>
        <textarea
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Digite seu código em Portugol aqui..."
        />
        <button onClick={executarCodigo}>Executar</button>
        <h2>Resultado:</h2>
        <pre>{resultado}</pre>
      </div>
    </div>
  );
}

export default App;
