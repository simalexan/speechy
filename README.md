# Speechy

_Speechy_ helps you connect your application entities and their pages to your users voice. It simplifies the recognition workflows, as it focuses you on basic sentence constructs - **verbs**, **nouns** and **attributes**. Using sentence constructs, you can easily lead the user to the wanted page, product or even product list without typing and clicking -- in Minority Report style.

### Important note!

Speechy is a wrapper around Web speech API -- to ease up building speech recognition for your frontend app. Currently, the only browsers which have implemented that feature, are Chrome, along with its Chrome Mobile and Samsung.

## How does it work

_Example request:_

1. Double press the button **S** on your keyboard
2. Say: 

`Open a user with id 45`
 

_Example response:_ 

```javascript
{ 
  verb: 'open'
  noun: 'user',
  attribute: {
    name: 'id',
    type: 'number',
    value: '5'
  },
  isConstructed: true
}
```

With this response, you can, for example, lead the user to your to page `/users/5`

In case of a wrong pronunciation or undetected verbs/nouns, you would just get
```javascript
{ 
  isConstructed: false
}
```

## Usage

Setup is easy! Its just 4 easy steps

1. Include `speechy.js` as a dependency (whichever way you want)
2. Set the *language*, *verbs*, *noun* and *attributes* you want to detect:

```javascript
var language = 'en-US';

var verbs = [
  'open',
  'get',
  'show',
  'give',
  'want',
  'need'
];

var nouns = [
  'user',
  'product'
];

var attributes = [
  { name: 'id', type: 'number' },
  { name: 'list' }
];

var cancelPhrase = 'stop';
```

3. Set the **required** handler for the construct before initializing Speechy

```javascript
Speechy.onConstructParsed = function (construct){
  console.log(construct); // do whatever you like with the received construct
};
```

4. Initialize Speechy with the constructs:

`Speechy.init(language, verbs, nouns, attributes, cancelPhrase);`

Double press S and voila!


### Supported languages

[Click to see supported languages](supported-languages.json)