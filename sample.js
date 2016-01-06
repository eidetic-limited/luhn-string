/* jshint expr: false */
/* globals require */
'use strict';

var Luhn = require('./luhn-string');
var chars='UYSHO*(EKJDGuihsdk8aBAzZ', len;

// Now you can validate against a LuhnObject created by calling
// the module with a string including the sequence you want.
// Examples are below

var vowelsLuhn = new Luhn('AEIOUY');
var sample = vowelsLuhn.check('092');
if(sample.error){
  console.log( sample.error) ; //this should show a message telling you that there is an invalid digit encountered
}

var cardLuhn = new Luhn('0123456789');
var sample2 = cardLuhn.check('BABA');
if(sample2.error){
  console.log( sample2.error) ; //this should show a message telling you that there is an invalid digit encountered
}

// to generate a 16-digit checksummed string with 0123456789 as sequence
// Method 1
var res = Luhn.random(16, '0123456789');
console.log(res);
console.log(Luhn.check(res, '0123456789'));

// Method 2
var creator = new Luhn('0123456789');
res = creator.random(16);
console.log(res);
console.log(Luhn.check(res, '0123456789'));

// Method 1 requires that you send the validchar array every time, however, with Method 2, 
// you may call it along with the require or for each random string generator you need

try{
  Luhn.addChecksum('Baba70!');
} catch (err){
  console.log(err);
}

// or call back
Luhn.addChecksum('522340230007083', '0123456789', function(err, res){
  console.log(err);
  console.log(res);
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