import React from "react";
import Books from "./Component/Books";
import Loans from "./Component/Loans";
import Borrowers from "./Component/Borrowers";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1> Library Management System</h1>

      {/* Render Components */}
      <Books />
      <Loans />
      <Borrowers />
    </div>
  );
}

export default App;
