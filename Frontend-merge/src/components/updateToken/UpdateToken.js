import React, { useState } from 'react';
import axios from 'axios';

function UpdateToken() {
  const [token, setToken] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(token)
    try {
      const u_id = localStorage.getItem("_id");

      const response = await axios.put(`http://localhost:5000/emosense/user/update-token/${u_id}`, {
        accessToken: token,
      });
      console.log(response)
      // Handle the API response here (e.g., set it in state)
      setResponse(response.data.data.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Token Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Token:
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Token</button>
      </form>

      {response && (
        <div>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default UpdateToken;
