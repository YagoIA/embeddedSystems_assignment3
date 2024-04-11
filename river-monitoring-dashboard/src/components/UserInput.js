import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const UserInput = ({ mode }) => {
  const [sliderValue, setSliderValue] = useState(0);

  const handleSliderChange = (e) => {
    setSliderValue(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    sendOverwriteSignal();

  };

  const sendSliderRequest = (value) => {
    var postData = {
      value: value
    }

    fetch(`http://localhost:3001/valveOpeningLevel`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => {
        return response;
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  const sendOverwriteSignal = () => {
    fetch(`http://localhost:3001/overwrite`, {
      method: 'GET',
      mode: 'cors'
    })
      .then(response => {
        return response;
      })
      .catch(function (err) {
        console.log("Fetch Error :-S", err);
      });
  }

  return (
    <div className="container">
      <div className='row justify-content-center'>
        <div className="col-sm-4 ">
          <Card >
            <Card.Body>
              <Card.Title className="mb-4 display-7">Settings</Card.Title>
              <Card.Text>
                Set valve opening level to: {sliderValue}
                <Form.Range
                  disabled={mode !== 'overwrite'}
                  onChange={handleSliderChange}
                  min={0}
                  max={100}
                ></Form.Range>
              </Card.Text>
              <Button
                onClick={() => sendSliderRequest(sliderValue)}
                disabled={mode !== "overwrite"}
              >
                Send
              </Button>
              <Card.Text>
                <strong>Overwrite System:</strong>
                <Form.Check
                  type="checkbox"
                  checked={mode === "overwrite"}
                  onChange={handleCheckboxChange}
                />
              </Card.Text>

            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserInput;
