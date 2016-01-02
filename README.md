# LUHN-STRING
A library to generate alphanumeric strings that end with a checksum _"digit"_. _Digits_ in the string are in the range _0-9B-DF-HJ-NP-TV-XZ_. All uppercase.

## Change log
1.1.0. All functions allow you specify a string of valid characters in case you do not want the default of 0-9A-Z excluding vowels and Y. Callbacks can still be sent. All results are still Uppercase.
Note that the characters must be in same order when you are validating. A random string generated with sequence '0123456789' will not validate correctly against sequence '9876543210'.

#### Advantages 
1. Strings have a checksum character at the end.
2. Avoid Bad words in generated string by removing A,E,I,O,U,Y
3. Random strings are cryptographically generated (dependent on node's crypto library)

## Installation
```terminal
npm install luhn-string -save
```

## Usage
```javascript
var Luhn = require('luhn-string');

// to generate a 16-digit checksummed string
var str = Luhn.random(16);
console.log(str);

// to generate a 16-digit checksummed string
// specifying 0-9A-F as valid strings
var str = Luhn.random(16, '01234567890ABCDEF');
console.log(str);

// to test a string for checksum validity
var chk = Luhn.check('30MFLRQDVCFQ9SK1');
var valid = chk.result;
var validityerror = chk.error;

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