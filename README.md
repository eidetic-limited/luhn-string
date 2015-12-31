# LUHN-STRING
A library to generate alphanumeric strings that end with a checksum _"digit"_. _Digits_ in the string are in the range _0-9B-DF-HJ-NP-TV-XZ_. All uppercase.

Advantage is that these strings have a checksum character at the end.

## Installation
```terminal
npm install 'luhn-string' -save
```

## Usage
```javascript
var Luhn = require('luhn-string');

// to generate a 16-digit checksummed string
var res = Luhn.random(16);
var str = res.result;
var generationerror = res.error;

// to test a string for checksum validity
var chk = Luhn.check('LH989002BW3P');
var valid = chk.result;
var validityerror = chk.error;

// Take advantage of asynchrous processing!
// Use callbacks
Luhn.random(16, function(error, result){
  if(error){
    // do something with error...
    return;
  }
  console.log(result);
});

Luhn.check('LH989002BW3P', function(error, result){
  if(error){
    // do something with error...
    return;
  }
  console.log(result); // true or false
});


```

## Extras
The library uses a crypto function to generate random strings. This is Exposed for your use in 2 forms:
### 1. cryptoRandomAsciiString(length)
returns a truly random ascii string of length _length_

### 2 cryptoRandomString(length, chars)
returns a truly random ascii string of length _length_, picking characters in string _chars_

### 3 addChecksum(str, callback)
checks that str contains valid characters and appends a checksum character at its end. Should be used in callback fashion. Returns *null* if there is an error otherwise.