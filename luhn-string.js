/* jshint expr: false */
/* globals require, module */
'use strict';

var crypto = require('crypto');
var luhnValidChars = '0123456789BCDFGHJKLMNPQRSTVWXZ';

function reverse(s) {
  // the reverser below is bad generally
  // Ref: http://stackoverflow.com/a/16776621/1636522
  // but good enough for the range we expect to work with
  return s.split("").reverse().join("");
}

function aordinal(str, validChars) {
  var val = validChars.indexOf(str);
  
  return {error: (val===-1) ? new Error(str + ' is not a valid digit.') : null, result: val};
}

function bordinal(inte, validChars) {
  if (isNaN(inte) || parseInt(inte) !== inte || inte > (validChars.length - 1)) {
    throw new Error('Invalid Ordinal');
  } else {
    return validChars[inte].toUpperCase();
  }
}

// this function picks the argument of functions as a callback or string
function charsAndCallback(callbackOrChars, callback){
  // callbackOrChars can be a callback or the chars 
  if(typeof callbackOrChars === 'string'){
    return {validChars: callbackOrChars.toUpperCase(), callback: callback};
  } else if(typeof callbackOrChars === typeof (function(){})){
    return {validChars: luhnValidChars, callback: callbackOrChars};
  } else {
    return {validChars: luhnValidChars, callback: null};
  }
}

function randomString(length, chars) {
  // if a set of valid characters is sent
  chars = ((typeof chars === 'string') ? chars : luhnValidChars);
  
  var charsLength = chars.length, /* characters length */
      randomBytes = crypto.randomBytes(length), /* random bytes supplied by crypto library */
      result = new Array(length), /* Array to hold characters in string to send */
      cursor = 0, /* cursor to hold increasing index of characters to pick */
      i = 0; /* iterator for byte picking loop */
      
      
  // check the length of the chars sent, above 256 shouldn't be entertained
  if (charsLength > 256) {
    throw new Error('Argument \'chars\' should not have more than 256 characters, '+
                    'otherwise unpredictability will be broken');
  }

  for (i ; i < length; i++) {
    // increase cursor
    cursor += randomBytes[i];
    // add a character to array based on cursor
    result[i] = chars[cursor % charsLength];
  }

  return result.join('');
}

function randomAsciiString(length) {
  return randomString(length,
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
}

function randomValidString(length, validChars) {
  // if a set of valid charatcers is sent
  validChars = ((typeof validChars === 'string') ? validChars : luhnValidChars);
  return randomString(length,
      validChars);
}

function random(length, callbackOrChars, callback) {
  var validChars, cc;
  // second argument can be a callback or the chars that 
  // are to be seen as valid in final result
  cc = charsAndCallback(callbackOrChars, callback);
  validChars = cc.validChars;
  callback = cc.callback;
  
  // length must be a positive integer
  if (length !== parseInt(length, 10)) {
    if (callback) {
      return callback(new Error('\'length\' must be a positive integer'), null);
    } else {
      throw new Error('\'length\' must be a positive integer');
    }
  }
  
  // length must be above 1 or where will the checksum digit be?
  if (length <= 1) {
    if (callback) {
      return callback(new Error('The least checksumable string length is 2'), null);
    } else {
      throw new Error('The least checksumable string length is 2');
    }
  }

  // 
  if (callback) {
    return addChecksum(randomValidString(length - 1, validChars), validChars, callback);
  } else {
    return addChecksum(randomValidString(length - 1, validChars), validChars);
  }
}

function check(str, callbackOrChars, callback) {
  var validChars, cc, k, l, j=0, stringWithoutCheck;
  cc = charsAndCallback(callbackOrChars, callback);
  validChars = cc.validChars;
  callback = cc.callback;
  
  if (str.length <= 1) {
    // invalid as there is only one character, the check character?
    if (callback) {
      return callback(new Error(str + ' is too short to be checked.'), false);
    } else {
      return {error: new Error(str + ' is too short to be checked.'), result: false};
    }
  }
  str = str.toUpperCase();
  
  // check has invalid chars
  for (j; j < str.len; j++) {
    if (validChars.indexOf(str[j]) === -1) {
      // invalid as there is an invalid character!
      if (callback) {
        return callback(new Error(str + ' has invalid character: ' + str[j] + ' at index: ' + j), false);
      } else {
        return {error: new Error(str + ' has invalid character: ' + str[j] + ' at index: ' + j), result: false};
      }
    }
  }  
  
  // take out the string minus its checksum character
  stringWithoutCheck = str.substring(0, str.length - 1);
  if (callback) {
    return checksumDigit(stringWithoutCheck, validChars, function (errc, resc) {
      if (errc) {
        return callback(errc, null);
      }
      
      k = aordinal(str[str.length - 1], validChars);
      if (k.error) {
        return callback(k.error, null);
      }
      return callback(null, k.result === resc);

    });
  } else {
    k = checksumDigit(stringWithoutCheck, validChars);
    l = aordinal(str[str.length - 1], validChars);
    if (k.error) {
      return {error: k.error, result: null};
    }
    if (l.error) {
      return {error: l.error, result: null};
    }
    return {error: null, result: (k.result === l.result)};
  }
}

function checksumDigit(stringWithoutCheck, callbackOrChars, callback) {
  var validChars, cc, xar, sum = 0, str, x1, cd, k; // k holds intermediate results colecting error info

  cc = charsAndCallback(callbackOrChars, callback);
  validChars = cc.validChars;
  callback = cc.callback;

  var string = reverse(stringWithoutCheck);
  for (var x = 0; x < string.length; x++) {
    k = aordinal(string[x], validChars);
    if (k.error) {
      if (callback) {
        return callback(k.error, null);
      }
      return {error: k.error, result: null} ;
    }
    xar = k.result;

    x1 = xar * Math.pow(2, (x + 1) % 2);
    str = x1.toString();
    for (var i = 0; i < str.length; i++) {
      sum += parseInt(str.charAt(i), 10);
    }
  }
  cd = (sum * (validChars.length-1)) % validChars.length;
  if (callback) {
    return callback(null, cd);
  } else {
    return {error: null, result: cd};
  }
}

function addChecksum(r, callbackOrChars, callback) {
  var validChars, cc, k, j=0;
  if (r.length <= 0) {
    // invalid as there is no character!
    if (callback) {
      return callback(new Error('"'+r + '" is too short to be checksummed.'), false);
    } else {
      throw new Error('"'+r + '" is too short to be checksummed.');
    }
  }
  
  cc = charsAndCallback(callbackOrChars, callback);
  validChars = cc.validChars;
  callback = cc.callback;

  r = r.toUpperCase();
  // check has invalid chars
  for (j; j < r.len; j++) {
    if (validChars.indexOf(r[j]) === -1) {
      // invalid as there is an invalid character!
      if (callback) {
        return callback(new Error(r + ' has invalid character: "' + r[j] + '" at index: ' + j), false);
      } else {
        throw new Error(r + ' has invalid character: "' + r[j] + '" at index: ' + j);
      }
    }
  }  
  
  if (callback) {
    checksumDigit(r, validChars, function (error, result) {
      if (error) {
        return callback(error, null);
      }
      return callback(null, r + bordinal(result, validChars));
    });
  } else {
    k = checksumDigit(r, validChars);
    if (k.error) {
      throw k.error;
    }
    return r + bordinal(k.result, validChars);
  }
}

module.exports = {
  check: check,
  addChecksum: addChecksum,
  cryptoRandomAsciiString: randomAsciiString,
  cryptoRandomString: randomString,
  random: random
};
