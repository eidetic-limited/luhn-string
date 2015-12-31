var Luhn = require('./luhn-string');
var assert = require('assert');
var chars='UYSHO*(EKJDGuihsdk8aBAzZ', len;

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