import React from 'react';
import Card from 'react-bootstrap/Card';

const SystemStatus = ({ data }) => {
  const { valveOpeningLevel, state, waterLevel } = data;

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
          <Card >
            <Card.Body>
              <Card.Title className="mb-4 display-7">Monitoring Data</Card.Title> {/* Increased text size */}
              <Card.Text>
                <div className="mb-3 display-9"><strong>Valve Opening Level:</strong> {valveOpeningLevel}</div>
                <div className="mb-3 display-9"><strong>State:</strong><div className={stateColor}>{state}</div> </div>
                <div className="mb-3 display-9"><strong>Water Level:</strong> {waterLevel}</div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
