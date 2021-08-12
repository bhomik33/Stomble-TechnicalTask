import React, {useEffect, useState} from 'react';
import Cards from 'react-credit-cards';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Row, Col, Button, Alert, Card} from 'react-bootstrap';
import 'react-credit-cards/es/styles-compiled.css';
import validateCard from './validateCard';
import './App.css';

// AWS Amplify 
import Amplify, {Auth, API} from 'aws-amplify';
import awsconfig from './aws-exports';
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react';


Amplify.configure(awsconfig);


 const App = () => {
  // state variables
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [focus, setFocus] = useState('');
  const [errors, setErrors] = useState({})
  const [cards, setCards] = useState([]);


  // useEffect hook to load the saved cards details
  useEffect(() => {
    API.get( "creditAPI", "/credits/name")
    .then(cardRes => {
      setCards([...cards, ...cardRes]);
    })
  }, [])
  
    // const userId = currentUserId;
    // console.log(userId);
    const handleSubmit = (e) => {
    e.preventDefault()
    setErrors(validateCard(name,number,expiry,cvc));
    const errs = validateCard(name,number,expiry,cvc);

    if (errs.variant !== "success"){
      return 
    }
    else {
      API.post('creditAPI', '/credits', {
        body : {
        name : name,
        number : number,
        expiry : expiry,
        cvc : cvc
        }
      }
      ).then(fetchedDetails => 
        setCards([ { name: name, number:number,expiry:expiry,cvc:cvc}, ...cards]))
    }
  }
  return (
    <div className="container">
      <div className="justify-content-center align-items-center">
        <AmplifySignOut />
        <div className="formContainer">
          <Form onSubmit={handleSubmit}>
            <Cards 
              cvc={cvc}
              expiry={expiry}
              focused={focus}
              name={name}
              number={number}
            />
            <Form.Group className="mb-3 mt-3" controlId="formNumber">
              <Form.Label className="numberLabel">Card Number</Form.Label>
              <Form.Control 
                type="text" 
                name="number"
                placeholder="" 
                value={number}
                maxLength={16}
                onChange={e => setNumber(e.target.value)}
                onFocus={e => setFocus(e.target.name)}
                isValid={errors.number}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCardName">
              <Form.Label className="cardNameLabel">Card Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name"
                placeholder="" 
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={e => setFocus(e.target.name)}
                isValid={errors.name}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formCardExpiry">
                  <Form.Label className="expiryLabel">Expiration Date</Form.Label>
                  <Form.Control 
                  type="text" 
                  name="expiry"
                  placeholder="MM/YY" 
                  minLength = {5}
                  maxLength={5}
                  value={expiry}
                  onChange={e => setExpiry(e.target.value)}
                  onFocus={e => setFocus(e.target.name)}
                  isValid={errors.expiry}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formCvc">
                  <Form.Label className="cvcLabel">CVC</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="cvc"
                    placeholder="" 
                    value={cvc}
                    maxLength={3}
                    onChange={e => setCvc(e.target.value)}
                    onFocus={e => setFocus(e.target.name)}
                    isValid={errors.cvc}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className='button'>
            <Button type="submit" variant="primary" className="submitButton">Proceed</Button>
            </div>
          </Form>
          <Alert
            id="alertMessage"
            variant={errors.variant}
            show={errors.show}
          >
            {errors.message}
          </Alert>
          </div>

          <h1 className="savedCards">Saved Cards</h1>
          <ul>
          {cards.map(card =>  <Card className="text-center mb-4">
          <Card.Body>
          <Card.Header>Card Details</Card.Header>
          <Card.Title>{card.name}</Card.Title>
          <Card.Text>
            <p>Card Number : {card.number}</p>
           <p> Expiry : {card.expiry}</p>
          </Card.Text>
          <Button variant="primary">Proceed</Button>
           </Card.Body>
          </Card>)}
         </ul>
          </div>
    </div>
  );
}

export default withAuthenticator(App);
