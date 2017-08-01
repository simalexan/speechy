# Speachy

What does Speachy mean? - https://www.youtube.com/watch?v=uo2wWB7cYk4

_Speachy_ helps you connect your application entities and their pages to your users voice. It simplifies the recognition workflows, as it focuses you on basic sentence constructs - **verbs**, **nouns** and **attributes**. Using sentence constructs, you can easily lead the user to the wanted page, product or even product list without typing and clicking -- in Minority Report style.

## How does the user interact

Example request:

Double press the button **S** on your keyboard

`Open a user with id 45`

Example response: 

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

You can now lead the user to your frontend app - to page `/users/5`

In case of a wrong pronunciation, you would just get
```javascript
{ 
  isConstructed: false
}
```

## Usage