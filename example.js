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
  console.log(construct);
};

Speechy.init(verbs, entities, attributes, cancelPhrase);