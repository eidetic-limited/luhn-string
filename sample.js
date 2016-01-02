/* jshint expr: false */
/* globals require */
'use strict';

var Luhn = require('./luhn-string');
var chars='UYSHO*(EKJDGuihsdk8aBAzZ', len;

console.log('On zero to nine');
// to generate a 16-digit checksummed string
var res = Luhn.random(16, '0123456789');
console.log(res);
console.log(Luhn.check(res, '0123456789'));

try{
  Luhn.addChecksum('Baba70!');
} catch (err){
  console.log(err);
}

// or call back
Luhn.addChecksum('Baba70!', function(err, res){
  console.log(err);
});

// create a random length between 7 and 18
len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
// print a Luhn checksummed random string of 'len' 
// characters to the console
console.log(Luhn.cryptoRandomString(len, chars));

// create a random ascii string of length len 
// (this is not Luhn Checksummed!, and may even be invalid Luhn)
var str = Luhn.cryptoRandomAsciiString(len);

// generate 10 sample Luhn Numbers of 
// varying lengths between 7 and 18 characters
for(var i=0;i<10;i++){
  len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
  console.log(Luhn.random(len));
}

// to test a string for checksum validity
var chk = Luhn.check('DW9S91FJLR24V5Z');
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

Luhn.check('DW9S91FJLR24V5Z', function(error, result){
  if(error){
    // do something with error...
    return;
  }
  console.log(result); // true or false
});