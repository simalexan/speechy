var language = 'en-US';

var verbs = [
  'open',
  'get',
  'show',
  'give',
  'want',
  'need'
];

var entities = [
  'user',
  'product'
];

var attributes = [
  { name: 'id', type: 'number' },
  { name: 'list' }
];

var cancelPhrase = 'stop';

Speechy.onConstructParsed = function (construct){
  if (!construct.isConstructed) return;

  // from here goes your custom code
  if (!construct.attribute) return;

  var commandString = construct.verb + ' ' + construct.noun + ' ' + construct.attribute.name;
  if (construct.attribute.value) commandString += ' ' + construct.attribute.value;

  document.getElementById('construct-result').innerHTML = commandString;
};

Speechy.init(language, verbs, entities, attributes, cancelPhrase);