import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import '../Styles/model.css';

const StressGraph = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const getUserStress = async ()=>{
    try {
      const res = await axios.get(`http://localhost:5000/chatbotinput/last-five-days-stress-levels/${localStorage.getItem("userID")}`);
      const stressData = res?.data?.data?.stress_data;
      // console.log("stressData",stressData)

      if (chartRef.current) {
        // Destroy the previous chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy(); 
        }
  
        const labels = ['1 day', '2 days', '3 days', '4 days', '5 days'];

        var day1 , day2, day3,day4,day5;
        stressData.map((day,index)=>{
          console.log(index,day?.stress_level)
          if(index === 0)
          {
            if(day?.stress_level === "low-normal")
            {
              day1 = 0;
            }
            if(day?.stress_level === "medium low")
            {
              day1 = 1;
            }
            if(day?.stress_level === "medium") 
            {
              day1 = 2;
            }
            if(day?.stress_level === "medium high")
            {
              day1 = 3;
            }
            if(day?.stress_level === "high")
            {
              day1 = 4;
            }
          }
          if(index === 1)
          {
            if(day?.stress_level === "low-normal")
            {
              day2 = 0;
            }
            if(day?.stress_level === "medium low")
            {
              day2 = 1;
            }
            if(day?.stress_level === "medium")
            {
              day2 = 2;
            }
            if(day?.stress_level === "medium high")
            {
              day2 = 3;
            }
            if(day?.stress_level === "high")
            {
              day2 = 4;
            }
          }
          if(index === 2)
          {
            if(day?.stress_level === "low-normal")
            {
              day3 = 0;
            }
            if(day?.stress_level === "medium low")
            {
              day3 = 1;
            }
            if(day?.stress_level === "medium")
            {
              day3 = 2;
            }
            if(day?.stress_level === "medium high")
            {
              day3 = 3;
            }
            if(day?.stress_level === "high")
            {
              day3 = 4;
            }
          }
          if(index === 3)
          {
            if(day?.stress_level === "low-normal")
            {
              day4 = 0;
            }
            if(day?.stress_level === "medium low")
            {
              day4 = 1;
            }
            if(day?.stress_level === "medium")
            {
              day4 = 2;
            }
            if(day?.stress_level === "medium high")
            {
              day4 = 3;
            }
            if(day?.stress_level === "high")
            {
              day4 = 4;
            }
          }
          if(index === 4)
          {
            if(day?.stress_level === "low-normal")
            {
              day5 = 0;
            }
            if(day?.stress_level === "medium low")
            {
              day5 = 1;
            }
            if(day?.stress_level === "medium")
            {
              day5 = 2;
            }
            if(day?.stress_level === "medium high")
            {
              day5 = 3;
            }
            if(day?.stress_level === "high")
            {
              day5 = 4;
            }
          }
        });
        
        console.log( day1 , day2 , day3 , day4 , day5 )

        // Define your hardcoded stress levels
        const stressLevels = [ day1 , day2 , day3 , day4 , day5 ];
  
        chartInstance.current = new Chart(chartRef.current, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Stress Levels',
                data: stressLevels,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 5,
                ticks: {
                  callback: function (value, index, values) {
                    // Map the numeric values to custom labels
                    const labels = ['low-normal', 'medium low', 'medium', 'medium high', 'high'];
                    return labels[value];
                  },
                },
              },
            },
          },
        });
  
        // Set a fixed width and height for the chart
        chartRef.current.style.width = '100%'; // Adjust as needed
        chartRef.current.style.height = '200px'; // Adjust as needed
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserStress();
  }, []);

  return (
    <div style={{ width: '90%', height: '200px' }}>
      <p style={{fontSize:"12px"}} className="paragraph-1">Your stress looking in the past 5 Days</p>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default StressGraph;
