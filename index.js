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

Speachy.init(verbs, entities, attributes, cancelPhrase);