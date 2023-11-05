import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios if not already done

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  table: {
    borderCollapse: 'collapse',
    width: '80%',
    margin: '20px',
  },
  cell: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  selectedCell: {
    background: 'lightblue',
  },
  image: {
    height: '30px',
    width: '30px', // Adjust the size of the images
  },
  message: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'green',
  },
};

const App = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [congratulations, setCongratulations] = useState(false);
  const [images, setImages] = useState([]);

  // Make an HTTP request to fetch the images when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5038/fruitbingoapp/GetImages')
      .then((response) => {
        setImages(response.data.map(item => item.image));
      })
      .catch((error) => {
        console.error('Error fetching images from the server:', error);
      });
  }, []);

  //select image
  const handleCellClick = (rowIndex, colIndex) => {
    const cell = { row: rowIndex, col: colIndex };
    const cellIndex = selectedCells.findIndex(
      (selectedCell) =>
        selectedCell.row === rowIndex && selectedCell.col === colIndex
    );

    if (cellIndex !== -1) {
      setSelectedCells((prevSelectedCells) =>
        prevSelectedCells.filter((_, index) => index !== cellIndex)
      );
    } else {
      setSelectedCells((prevSelectedCells) => [...prevSelectedCells, cell]);
    }
  };

  //check if 3 apples images are selected
  useEffect(() => {
    if (selectedCells.length > 0) {
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const row = grid[rowIndex].map((cell) => cell.props.alt);
        if (row.join('').includes('AppleAppleApple')) {
          setCongratulations(true);
          break;
        }
      }
    }
  }, [grid, selectedCells]);

  // Update the grid generation code to use the fetched images
  useEffect(() => {
    const newGrid = Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () =>
        Math.random() < 0.5 ? (
          <img src={images[0]} alt="Apple" style={styles.image} />
        ) : (
          <img src={images[1]} alt="Car" style={styles.image} />
        )
      )
    );

    setGrid(newGrid);
  }, [images]);

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    ...styles.cell,
                    ...(selectedCells.some(
                      (selectedCell) =>
                        selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex
                    ) && styles.selectedCell),
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {congratulations && selectedCells.length === 3 && (
        <div style={styles.message}>Congratulations! You won!</div>
      )}
    </div>
  );
};

export default App;
