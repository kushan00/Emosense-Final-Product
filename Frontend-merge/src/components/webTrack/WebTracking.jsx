import { Box, Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Swal from 'sweetalert2';

const WebTracking = () => {
  const [websiteUrl, setWebsiteUrl] = useState(''); // Store the URL input
  const [websiteCategory, setWebsiteCategory] = useState(''); // Store the API response
  const [showCategory, setShowCategory] = useState(false); // To control whether to display the category
  const apiUrl = 'http://localhost:5050/classify'; 

  useEffect(() => {
    // Function to fetch website category
    const fetchWebsiteCategory = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: websiteUrl, text: "Some random text" }),
        });
        const data = await response.json();
        setWebsiteCategory(data.category);

        // Check if the category is not "education" and show an alert
        if (data.category !== 'education') {
          // alert('This website is not categorized as education.');
          Swal.fire({
            icon: "error",
            title: "Oh NO",
            text: "You Should Get Back To Work",
          });
        }
      } catch (error) {
        console.error('Error fetching website category:', error);
      }
    };

    // Call the API when the website URL changes and show the category
    if (websiteUrl && showCategory) {
      fetchWebsiteCategory();
    }
  }, [websiteUrl, showCategory]);

  const handleInputChange = (event) => {
    setWebsiteUrl(event.target.value);
  };

  const handleButtonClick = () => {
    setShowCategory(true); // Show the category when the button is clicked
  };

  return (
    <div>
      <Box m="20px">
        <Header title="Website Category Tracker" subtitle="Check your web category" />
        {/* <input
        type="text"
        placeholder="Enter website URL"
        value={websiteUrl}
        onChange={handleInputChange}
      /> */}
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <TextField
            type="text"
            label="Website URL"
            name="WebURL"
            variant="filled"
            value={websiteUrl}
            onChange={handleInputChange}
            // fullWidth
            margin="normal"
            required
          />
          <Button
            sx={{ m: 1 }}
            variant="contained"
            color="secondary"
            onClick={handleButtonClick}
          >
            Check Category
          </Button>
        </Box>
        {showCategory && <p>Website Category: {websiteCategory}</p>}
      </Box>
    </div>
  );
};

export default WebTracking;
