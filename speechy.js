var Speechy = (function Speechy(){

  var Speechy = {},
    recognition,
    recognizing = false,
    hasButtonTappedOnce = false,
    finalTranscript = '', interimTranscript = '';


  Speechy.cancelPhrase = 'cancel';
  Speechy.verbs = [];
  Speechy.nouns = [];
  Speechy.attributes = [];
  Speechy.language = 'en-US';

  Speechy.onConstructParsed;

  Speechy.init = function (speechLanguage, verbs, nouns, attributes, cancelPhrase){
    if (!('webkitSpeechRecognition' in window)) {
      throw 'no speech recognition in this browser';
    } else {

      if (!Array.isArray(verbs) || typeof verbs[0] !== 'string') {
        throw 'You need a list of verb strings for Speechy to work';
      }
      if (!Array.isArray(nouns) || typeof nouns[0] !== 'string') {
        throw 'You need a list of nouns strings for Speechy to work';
      }
      if (!Array.isArray(attributes)) {
        throw 'You need a list of attribute objects { name: \'\', value: \'\'} for Speechy to work';
      }

      if (typeof Speechy.onConstructParsed !== 'function') {
        throw 'You need to set a parsed speech handler function for Speechy to work';
      }

      if (speechLanguage && typeof speechLanguage === 'string' && speechLanguage.length == 5) {
        Speechy.language = speechLanguage;
      }

      if (typeof cancelPhrase === 'string' && cancelPhrase.length > 2) Speechy.cancelPhrase = cancelPhrase;

      Speechy.verbs = verbs;
      Speechy.nouns = nouns;
      Speechy.attributes = attributes;

      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      hasButtonTappedOnce = false;

      window.addEventListener('keyup', function(e) {

        if ((e.keyCode || e.which) == 83) {
          if (!hasButtonTappedOnce) {
            hasButtonTappedOnce = true;
            return;
          }
          Speechy.startRecognizing(e);
        }
      }, true);


      recognition.onstart = function() {
        recognizing = true;
      };
      recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
          alert('web speech err');
          ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
          alert('web speech audio capture');
          ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
          if (event.timeStamp - start_timestamp < 100) {
            alert('web speech blocked');
          } else {
            alert('web speech denied');
          }
          ignore_onend = true;
        }
      };
      recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
          return;
        }

        if (!finalTranscript || finalTranscript.length < 1) {
          return;
        }
      };
      recognition.onresult = function(event) {
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            console.log('final')
            finalTranscript += event.results[i][0].transcript;
            if (finalTranscript.indexOf(Speechy.cancelPhrase) != -1) {
              finalTranscript = '';
            } else {
              var parsedSpeech = parseConstruct(finalTranscript);
              Speechy.onConstructParsed(parsedSpeech);
            }
          } else {
            console.log('interim')
            interimTranscript += event.results[i][0].transcript;
            if (interimTranscript.indexOf(Speechy.cancelPhrase) != -1) {
              interimTranscript = '';
            }
          }
        }
      };
    }
  };

  Speechy.startRecognizing = function (event){
    if (recognizing) {
      console.log('SHUTTING RECOGNITION')
      recognition.stop();
      hasButtonTappedOnce = false;
      return;
    }
    console.log('STARTING RECOGNITION')
    finalTranscript = '';
    recognition.lang = Speechy.language;
    recognition.start();
    ignore_onend = false;
    start_timestamp = event.timeStamp;
    hasButtonTappedOnce = false;
  };

  function parseConstruct(sentence) {
    var constructResult = { isConstructed: false };
    for (var i = 0; i < Speechy.verbs.length; i++){
      if (sentence.toLowerCase().indexOf(Speechy.verbs[i]) !== -1) {
        constructResult.verb = Speechy.verbs[i];
        break;
      }
    }

    for (var i = 0; i < Speechy.nouns.length; i++){
      if (sentence.toLowerCase().indexOf(Speechy.nouns[i]) !== -1) {
        constructResult.noun = Speechy.nouns[i];
        break;
      }
    }

    for (var i = 0; i < Speechy.attributes.length; i++){
      if (sentence.toLowerCase().indexOf(Speechy.attributes[i].name) !== -1) {
        constructResult.attribute = Speechy.attributes[i];
      }
    }

    if (!constructResult.verb || !constructResult.noun) return { isConstructed: false };

    if (constructResult.attribute && constructResult.attribute.type) {
      var regexNumbers = /\d+/;
      var foundAttributeValue = sentence.match(regexNumbers);
      if (foundAttributeValue.length && foundAttributeValue.length > 0) constructResult.attribute.value = foundAttributeValue[0];
    }

    constructResult.isConstructed = true;
    finalTranscript = '';
    return constructResult;
  }


  return Speechy;
})();