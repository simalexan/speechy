var Speachy = (function Speachy(){

  var Speachy = {},
    recognition,
    recognizing = false,
    hasButtonTappedOnce = false,
    finalTranscript = '', interimTranscript = '';


  Speachy.cancelPhrase = 'cancel';
  Speachy.verbs = [];
  Speachy.nouns = [];
  Speachy.attributes = [];

  Speachy.init = function (verbs, nouns, attributes, cancelPhrase){
    if (!('webkitSpeechRecognition' in window)) {
      throw 'no speech recognition in this browser';
    } else {

      if (!verbs && verbs.length && verbs.length < 1) {
        throw 'You need a list of verb strings for Speachy to work';
      }
      if (!nouns && nouns.length && nouns.length < 1) {
        throw 'You need a list of nouns strings for Speachy to work';
      }
      if (!attributes && attributes.length && attributes.length < 1) {
        throw 'You need a list of attribute objects { name: \'\', value: \'\'} for Speachy to work';
      }

      if (cancelPhrase && cancelPhrase.length && cancelPhrase.length > 2) Speachy.cancelPhrase = cancelPhrase;

      Speachy.verbs = verbs;
      Speachy.nouns = nouns;
      Speachy.attributes = attributes;

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
          Speachy.startRecognizing(e);
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
            if (finalTranscript.indexOf(Speachy.cancelPhrase) != -1) {
              finalTranscript = '';
            } else {
              console.log(checkToConstruct(finalTranscript));
            }
          } else {
            console.log('interim')
            interimTranscript += event.results[i][0].transcript;
            if (interimTranscript.indexOf(Speachy.cancelPhrase) != -1) {
              interimTranscript = '';
            }
          }
        }
      };
    }
  };

  Speachy.startRecognizing = function (event){
    if (recognizing) {
      console.log('SHUTTING RECOGNITION')
      recognition.stop();
      hasButtonTappedOnce = false;
      return;
    }
    console.log('STARTING RECOGNITION')
    finalTranscript = '';
    recognition.lang = 'en-US';
    recognition.start();
    ignore_onend = false;
    start_timestamp = event.timeStamp;
    hasButtonTappedOnce = false;
  };

  function checkToConstruct(sentence) {
    var startVerbPos = -1, entityPos = -1, attributePos = -1, attributeVal = '';
    var constructResult = { isConstructed: false };
    for (var i = 0; i < Speachy.verbs.length; i++){
      if (sentence.toLowerCase().indexOf(Speachy.verbs[i]) !== -1) {
        startVerbPos = i;
        constructResult.verb = Speachy.verbs[i];
      }
    }

    for (var i = 0; i < Speachy.nouns.length; i++){
      if (sentence.toLowerCase().indexOf(Speachy.nouns[i]) !== -1) {
        entityPos = i;
        constructResult.noun = Speachy.nouns[i];
      }
    }

    for (var i = 0; i < Speachy.attributes.length; i++){
      if (sentence.toLowerCase().indexOf(Speachy.attributes[i].name) !== -1) {
        attributePos = i;
        constructResult.attribute = Speachy.attributes[i];
      }
    }

    if (startVerbPos == -1 || entityPos == -1) return { isConstructed: false };

    if (constructResult.attribute.type) {
      var regexNumbers = /\d+/;
      var foundAttributeValue = sentence.match(regexNumbers);
      console.log(foundAttributeValue);
      if (foundAttributeValue.length && foundAttributeValue.length > 0) constructResult.attribute.value = foundAttributeValue[0];
    }

    constructResult.isConstructed = true;
    return constructResult;
  }


  return Speachy;
})();