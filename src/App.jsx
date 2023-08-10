import { useEffect } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";

// reordering an array randomly
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

function App() {
  const [images, setImages] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [count, setCount] = useState([""]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          headers: {
            Authorization:
              "Client-ID 5c3Oqk6IPEjEQCoslGF_jKPZyNodVyl8aqbdCTAhepI",
          },
          // search key
          params: {
            query: "DOG",
          },
        }
      );
      // save images on state
      setImages(data.results);
    };

    // run fetch
    fetchData();
  }, []); // runs once

  const handleClick = (id) => {
    if (count[id]) {
      if (score > bestScore) {
        setBestScore(score);
      }

      setScore(0);
      setCount([""]);
    } else {
      setCount((prevCount) => ({
        ...prevCount,
        [id]: 1,
      }));
      setScore((prevScore) => prevScore + 1);
    }

    console.log(count);
    // saving in a variable the new array order
    const shuffledImages = shuffleArray(images);
    // uploading state
    setImages(shuffledImages);
  };

  // loading text while fetching images
  if (images.length === 0) return <h1>Loading....</h1>;

  return (
    <div>
      <h1>Memory game</h1>
      <Typography variant="h4">Score: {score}</Typography>
      <Typography variant="h4">Best Score: {bestScore}</Typography>
      {images.map((image) => (
        <Box
          component="img"
          sx={{
            width: "200px", // Set the desired width
            height: "150px", // Set the desired height
            objectFit: "cover", // Maintain aspect ratio
            margin: "10px", // Add spacing between images
            cursor: "pointer", // Add cursor property to make it look clickable
            borderRadius: "8px", // Add rounded corners for a button-like look
            transition: "background-color 0.3s", // Smooth transition for hover effect
            "&:hover": {
              backgroundColor: "#006aff", // Change background color on hover
            },
          }}
          src={image.urls.small}
          key={image.id}
          onClick={() => handleClick(image.id)}
        />
      ))}
    </div>
  );
}

export default App;
