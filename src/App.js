import React, { useRef, useEffect, useState } from "react";

const App = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60; // Account for navbar height

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial blank state
    setActions([canvas.toDataURL()]);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    setActions((prevActions) => [...prevActions, canvas.toDataURL()]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    // Center coordinates for symmetry
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
  
    // Randomized color for silky effects
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
  
    // Create a gradient for flowing strokes
    const gradient = ctx.createRadialGradient(x, y, 5, x, y, 50);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    gradient.addColorStop(1, `rgba(${r - 50}, ${g - 50}, ${b - 50}, 0.2)`);
  
    ctx.fillStyle = gradient;
  
    // Symmetrical Drawing: Mirror points
    const symmetricalPoints = [
      [x, y], // Original
      [canvas.width - x, y], // Horizontal symmetry
      [x, canvas.height - y], // Vertical symmetry
      [canvas.width - x, canvas.height - y], // Both axes symmetry
    ];
  
    symmetricalPoints.forEach(([symX, symY]) => {
      // Draw flowing arcs
      ctx.beginPath();
      ctx.arc(symX, symY, Math.random() * 30 + 10, 0, Math.PI * 2);
      ctx.fill();
    });
  
    // Silky Trails: Smooth bezier curves
    ctx.strokeStyle = gradient;
    ctx.lineWidth = Math.random() * 4 + 2; // Random line width
    ctx.lineCap = "round";
  
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.bezierCurveTo(
      x,
      y, // Control point 1
      centerX + (x - centerX) * 0.5,
      centerY + (y - centerY) * 0.5, // Control point 2
      x,
      y // Endpoint
    );
    ctx.stroke();
  };
  
  
  

  const handleNew = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setActions([canvas.toDataURL()]);
  };

  const handleUndo = () => {
    if (actions.length === 0) return; // No actions to undo

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (actions.length === 1) {
      // If it's the last action, clear the canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Load the second-to-last action
      const lastAction = actions[actions.length - 2];
      const img = new Image();

      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.src = lastAction;
    }

    // Remove the last saved action
    setActions((prevActions) => prevActions.slice(0, -1));
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "generative_art.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = () => {
    alert("Sharing functionality can be implemented using social media APIs!");
  };

  return (
    <div>
      {/* Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg, #4b6cb7, #182848)",
          color: "white",
          padding: "15px 30px",
          position: "fixed",
          width: "100%",
          zIndex: 10,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ fontSize: "22px", fontWeight: "600", margin: 0 }}>Generative Art</h1>
        <div>
          <button
            style={{
              margin: "0 8px",
              padding: "10px 25px",
              background: "#6a11cb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2575fc")}
            onMouseLeave={(e) => (e.target.style.background = "#6a11cb")}
            onClick={handleNew}
          >
            New
          </button>
          <button
            style={{
              margin: "0 8px",
              padding: "10px 25px",
              background: "#6a11cb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2575fc")}
            onMouseLeave={(e) => (e.target.style.background = "#6a11cb")}
            onClick={handleShare}
          >
            Share
          </button>
          <button
            style={{
              margin: "0 8px",
              padding: "10px 25px",
              background: "#6a11cb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2575fc")}
            onMouseLeave={(e) => (e.target.style.background = "#6a11cb")}
            onClick={handleUndo}
          >
            Undo
          </button>
          <button
            style={{
              margin: "0 8px",
              padding: "10px 25px",
              background: "#6a11cb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#2575fc")}
            onMouseLeave={(e) => (e.target.style.background = "#6a11cb")}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        style={{
          display: "block",
          marginTop: "60px",
          border: "2px solid #444",
          borderRadius: "12px",
          margin: "auto",
        }}
      />
    </div>
  );
};

export default App;
