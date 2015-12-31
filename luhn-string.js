'use strict';

var crypto = require('crypto');

function randomString(length, chars) {
  if (!chars) {
     throw new Error('Argument \'chars\' is undefined');
  }

  var charsLength = chars.length;
  if (charsLength > 256) {
    throw new Error('Argument \'chars\' should not have more than 256 characters, '+
                    'otherwise unpredictability will be broken');
  }

  var randomBytes = crypto.randomBytes(length);
  var result = new Array(length);

  var cursor = 0;
  for (var i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % charsLength];
  }

  return result.join('');
}

function randomAsciiString(length) {
  return randomString(length,
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
}

function randomValidString(length) {
  return randomString(length,
      'BCDFGHJKLMNPQRSTVWXZ0123456789');
}

function random(length, callback) {
  var k, r;
  if (length !== parseInt(length, 10)) {
    if (callback) {
      return callback(new Error('\'length\' must be a valid positive integer'), null);
    } else {
      throw new Error('\'length\' must be a valid positive integer');
    }
  }
  if (length <= 1) {
    if (callback) {
      return callback(new Error('The least checksumable string length is 2'), null);
    } else {
      throw new Error('The least checksumable string length is 2');
    }
  }

  if (callback) {
    return addChecksum(randomValidString(length - 1), callback);
  } else {
    return addChecksum(randomValidString(length - 1));
  }
}

function check(str, callback) {
  if (str.length <= 1) {
    // invalid as there is only one character, the check character?
    if (callback) {
      return callback(new Error(str + ' is too short to be checked.'), false);
    } else {
      return {error: new Error(str + ' is too short to be checked.'), result: false};
    }
  }
  str = str.toUpperCase();
  var letters = /^[0-9B-DF-HJ-NP-TV-XZ]+$/, k, l;
  if (!letters.test(str)) {
    // invalid as there is an invalid character!
    if (callback) {
      return callback(new Error(str + ' has invalid characters.'), false);
    } else {
      return {error: new Error(str + ' has invalid characters.'), result: false};
    }
  }
  var stringwithoutcheck = str.substring(0, str.length - 1);
  if (callback) {
    return checksumDigit(stringwithoutcheck, function (errc, resc) {
      if (errc) {
        callback(errc, null);
      }
      k = aordinal(str[str.length - 1]);
      if (k.error) {
        callback(k.error, null);
      }
      return callback(null, k.result === resc);

    });
  } else {
    k = checksumDigit(stringwithoutcheck);
    l = aordinal(str[str.length - 1]);
    if (k.error) {
      return {error: k.error, result: null};
    }
    if (l.error) {
      return {error: l.error, result: null};
    }
    return {error: null, result: (k.result === l.result)};
  }
}

function reverse(s) {
  // the reverser below is bad generally
  // Ref: http://stackoverflow.com/a/16776621/1636522
  // but good enough for our range
  return s.split("").reverse().join("");
}

function aordinal(str) {
  var val;
  if (isNaN(str)) {
    val = {B: 10, C: 11, D: 12, F: 13, G: 14,
      H: 15, J: 16, K: 17, L: 18, M: 19,
      N: 20, P: 21, Q: 22, R: 23, S: 24,
      T: 25, V: 26, W: 27, X: 28, Z: 29}[str];
  } else {
    val = parseInt(str);
  }
  return {error: typeof val === 'undefined' ? new Error(str + ' is not a valid digit.') : null, result: val};
}

function bordinal(inte) {
  var val = {B: 10, C: 11, D: 12, F: 13, G: 14,
    H: 15, J: 16, K: 17, L: 18, M: 19,
    N: 20, P: 21, Q: 22, R: 23, S: 24,
    T: 25, V: 26, W: 27, X: 28, Z: 29}, i;
  if (isNaN(inte) || parseInt(inte) !== inte || parseInt(inte) > 29) {
    throw new Error('Invalid Ordinal');
  } else {
    if (inte < 10) {
      return inte;
    } else {
      for (i in val) {
        if (val.hasOwnProperty(i)) {
          if (val[i] === inte) {
            return i.toUpperCase();
          }
        }
      }
    }
  }
}

function checksumDigit(stringwithoutcheck, callback) {
  var xar, sum = 0, str, x1, cd, k; // k holds intermediate results colecting error info
  var string = reverse(stringwithoutcheck);
  for (var x = 0; x < string.length; x++) {
    k = aordinal(string[x]);
    if (k.error) {
      if (callback) {
        return callback(k.error, null);
      }
      return {error: k.error, result: null} ;
    }
    xar = k.result;
  }
  x1 = xar * Math.pow(2, (x + 1) % 2);
  str = x1.toString();
  for (var i = 0; i < str.length; i++) {
    sum += parseInt(str.charAt(i), 10);
  }
  cd = (sum * 29) % 30;
  if (callback) {
    return callback(null, cd);
  } else {
    return {error: null, result: cd};
  }
  //  $cd = strtoupper(dechex(($sum * 35) % 36));
  //   echo $stringwithoutcheck . $cd;
}

function addChecksum(r, callback) {
  var k;
  if (r.length <= 0) {
    // invalid as there is no character!
    if (callback) {
      return callback(new Error('"'+r + '" is too short to be checksummed.'), false);
    } else {
      return null;
    }
  }
  r = r.toUpperCase();
  var letters = /^[0-9B-DF-HJ-NP-TV-XZ]+$/, l;
  if (!letters.test(r)) {
    // invalid as there is an invalid character!
    if (callback) {
      return callback(new Error(r + ' has invalid characters.'), false);
    } else {
      return null;
    }
  }
  if (callback) {
    checksumDigit(r, function (error, result) {
      if (error) {
        callback(error, null);
      }
      callback(null, r + bordinal(result));
    });
  } else {
    k = checksumDigit(r);
    if (k.error) {
      return null;
    }
    return r + bordinal(k.result);
  }
}

module.exports = {
  check: check,
  addChecksum: addChecksum,
  cryptoRandomAsciiString: randomAsciiString,
  cryptoRandomString: randomString,
  random: random
};
