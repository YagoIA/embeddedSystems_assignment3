import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js
import Card from 'react-bootstrap/Card';

const WaterLevelChart = ({ waterLevels }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: waterLevels.map((_, index) => index + 1),
        datasets: [{
          label: 'Water Level',
          data: waterLevels,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 3
        }]
      },
      options: {
		elements: {
			point:{
				radius: 0
			}
		},
		
		animation: {
			duration: 0
		},
		scales: {
			y: {
			  min: 0,
			  max: 500,
			  grid: {
                display:false
			}  
			},
			x: {  
				ticks:{
					display: false // Hides only the labels of the x-axis 
				},
				grid: {
					display:false
				},
				title: {
					display: true,
					text: 'Last 30 sec'
				  }   
			}
		  }
        }
      },

    );

    return () => {
      chart.destroy();
    };
  }, [waterLevels]);

  return (
    <canvas ref={chartRef}></canvas>
  );
};

const SystemStatus = ({ data, waterLevelHistory }) => {
  const { valveOpeningLevel, state, waterLevel} = data;

  let stateColor = '';
  switch (state) {
    case 'too-high':
    case 'too-high-critical':
      stateColor = 'bg-danger text-white';
      break;
    case 'pre-too-high':
    case 'too-low':
      stateColor = 'bg-warning text-dark';
      break;
    case 'normal':
      stateColor = 'bg-success text-white';
      break;
    default:
      stateColor = 'bg-dark text-white';
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-sm-4">
          <Card>
            <Card.Body>
              <Card.Title className="mb-4 display-7">Monitoring Data</Card.Title>
              <Card.Text>
                <div className="mb-3 display-9"><strong>Valve Opening Level:</strong> {valveOpeningLevel}</div>
                <div className="mb-3 display-9"><strong>State:</strong><div className={stateColor}>{state}</div></div>
                <div className="mb-3 display-9"><strong>Water Level:</strong> {waterLevel}</div>
                <div className="mb-3">
                  <strong>Water Level History:</strong>
                  <WaterLevelChart waterLevels={waterLevelHistory} />
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
