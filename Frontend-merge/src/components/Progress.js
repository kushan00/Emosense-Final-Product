import React from 'react';

const Progress = ({ stressLevel }) => {
  return (
    <div className="progress-container">
      <h2>Employee Stress Level</h2>
      <p>Stress Level: {stressLevel}%</p>
    </div>
  );
};

export default Progress;
