var Luhn = require('./luhn-string');
var assert = require('assert');
var chars='UYSHO*(EKJDGuihsdk8aBAzZ', len;

len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
console.log(Luhn.cryptoRandomString(len, chars));

var str = Luhn.cryptoRandomAsciiString(len);

for(var i=0;i<10;i++){
len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
  console.log(Luhn.random(len));
}