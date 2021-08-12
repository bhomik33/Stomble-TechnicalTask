import valid from 'card-validator';

const validateCard = (name, number,expiry, cvc) => {

    let creditCard = valid.number(number)
    creditCard.expirationDate = valid.expirationDate(expiry);
    creditCard.cvv = valid.cvv(cvc);
    creditCard.cardholderName = valid.cardholderName(name);
    let errors = {}

    errors.show = true;
    errors.variant = "danger";
    errors.message = "An unknown error occured. Please try again later"
    errors.name = false;
    errors.number = false;
    errors.exp = false;
    errors.cvc = false;



    // validate cardholder name
    if (name === null || !name.trim()) {
        errors.message = "Cardholder name is not complete";
    } else if (creditCard.cardholderName.isValid) {
        errors.name = true;
    } else {
        errors.message = "Cardholder name is invalid";
    }

     // validate cardholder number
     if (number === null || !number.trim()) {
        errors.message = "Cardholder number is not complete";
    } else if (creditCard.isValid) {
        errors.number = true;
    } else {
        errors.message = "Cardholder number is invalid";
    }

    // validate expiry date
    if (expiry === null || !expiry.trim()) {
        errors.message = "Cardholder expiry is not complete";
    } else if (creditCard.expirationDate.isValid) {
        errors.expiry = true;
    } else {
        errors.message = "Cardholder expiry is invalid";
    }
    
    // validate card cvv or cvc
    if (cvc === null || !cvc.trim()) {
        errors.message = "CVC is not complete";
    } else if (creditCard.cvv.isValid) {
        errors.cvc = true;
    } else {
        errors.message = "CVC is invalid";
    }

    if (
        errors.name &&
        errors.number &&
        errors.expiry &&
        errors.cvc
      ) {
        errors.variant = "success";
        errors.message = "Credit Card is valid";
      }
    return errors
}


export default validateCard;