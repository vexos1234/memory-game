import { useEffect, useMemo } from "react";
import "./App.css";
import { useState } from "react";
import axios from "axios";
import { Box, Button, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";

// reordering an array randomly
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "rgba(13, 10, 10, 0.57);", // Slightly transparent white background
  border: "1px solid #eeeeee",
  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Slightly stronger shadow
  borderRadius: 10,
  padding: 20,
  color: "#444444",
};

const queries = ["dog", "cat", "cactus", "hedgehogs grass", "chainsaw", ""];

function App() {
  const [images, setImages] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    parseInt(localStorage.getItem("bestScore")) || 0
  );
  const [count, setCount] = useState([""]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const bestScoreMemoized = useMemo(() => {
    return Math.max(bestScore);
  }, [bestScore]);

  useEffect(() => {
    // randomly pick one of the queries inside queries const
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];

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
            query: randomQuery,
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
        localStorage.setItem("bestScore", score);
      }

      setScore(0);
      setCount([""]);
      // open lose modal
      handleOpen2();
    } else if (score === 9) {
      // open win modal
      handleOpen();
    } else {
      setCount((prevCount) => ({
        ...prevCount,
        [id]: 1,
      }));
      setScore((prevScore) => prevScore + 1);
    }

    console.log(score);
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
      <Typography variant="h4">Best Score: {bestScoreMemoized}</Typography>
      {/* win modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            sx={{ color: "white" }}
            id="modal-modal-title"
            variant="h6"
            component="h2">
            YOU WIN
          </Typography>
          {/* could add chance to play with another thematic */}
          {/* and changing params on the fetch */}
          <Button variant="outlined">Try Again</Button>
        </Box>
      </Modal>
      {/* lose modal */}
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            sx={{ color: "white" }}
            id="modal-modal-title"
            variant="h6"
            component="h2">
            YOU LOSE
          </Typography>
          {/* could add a restart button  */}
          <Button
            onClick={() => {
              window.location.reload();
            }}>
            Try Again
          </Button>
        </Box>
      </Modal>
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
