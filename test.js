'use strict';

var Luhn = require('./luhn-string');
var expect = require('chai').expect;
var assert = require('assert');
var chars = 'UYSHO*(EKJDGuihsdk8aBAzZ';

describe('cryptoRandomAsciiString', function() {
  it('should return a string that has a length that equals length sent', function() {
    var i = 0, len;
    for (i; i < 10; i++) {
      // length will be between 7 and 18
      len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
      expect(Luhn.cryptoRandomAsciiString(len)).to.have.length(len);
    }
  });
});

describe('cryptoRandomString', function() {
  it('should return a string that has only characters that are in chars array', function() {
    var i = 0, len, str, j, reducedstr;
    for (i; i < 10; i++) {
      // length will be between 7 and 18
      len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
      str = Luhn.cryptoRandomString(len, chars);
      j = 0;
      for (j; j < len; j++) {
        if (chars.indexOf(str[j]) === -1) {
          assert(false, 'found invalid character' + chars[j]);
        }
      }
    }
  });
});

describe('random', function() {
  it('should fail for non positive integers below 2', function() {
    expect(function() {
      Luhn.random(1)
    }).to.throw();
    expect(function() {
      Luhn.random('p')
    }).to.throw();
    expect(function() {
      Luhn.random('8')
    }).to.throw();
  });

  it('should return a string that has a length that equals length sent', function() {
    var i = 0, len;
    for (i; i < 10; i++) {
      // length will be between 7 and 18
      len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
      expect(Luhn.random(len)).to.have.length(len);
    }
  });

  it('should return a string that passes the check', function() {
    var i = 0, len, str, chk;
    for (i; i < 10; i++) {
      // length will be between 7 and 18
      len = Math.floor(Math.random() * (18 - 7 + 1)) + 7;
      str = Luhn.random(len);
      chk = Luhn.check(str);
      assert(chk.result, 'there was no error in the string but the match returned false');
    }
  });
});

describe('check', function() {
  it('should fail for a string that is too short or has invalid characters(A,E,I,O,U,Y)', function() {
    var chk = Luhn.check('BABA70!');
    expect(chk.error).to.exist;
    chk = Luhn.check('Baba70!');
    expect(chk.error).to.exist;
    chk = Luhn.check('uyete86');
    expect(chk.error).to.exist;
    chk = Luhn.check('2');
    expect(chk.error).to.exist;
    chk = Luhn.check('');
    expect(chk.error).to.exist;
  });

  it('should return true for validly checksummed strings', function() {
    var chk = Luhn.check('27QNZBVKCLJK5X');
    expect(chk.result).to.be.true;
    chk = Luhn.check('LH989002BW3P');
    expect(chk.result).to.be.true;
    chk = Luhn.check('8S0JX31CCVD7Q8R');
    expect(chk.result).to.be.true;
    chk = Luhn.check('NCGWVQ79B4899SV');
    expect(chk.result).to.be.true;

  });

  it('should be true for validly checksummed strings when a callback is supplied', function (done) {
    Luhn.check('27QNZBVKCLJK5X', function (error, result) {
      expect(result).to.be.true;
      Luhn.check('41ML4W5V', function (error, result) {
        expect(result).to.be.true;
        Luhn.check('9MBTBP42PL2W80P', function (error, result) {
          expect(result).to.be.true;
          done();
        });
      });
    });
  });

});

describe('addChecksum', function() {
  it('should fail for a string that is too short or has invalid characters(A,E,I,O,U,Y)', function() {
    var chk = Luhn.addChecksum('BABA70!');
    expect(chk).to.not.exist;
    chk = Luhn.addChecksum('Baba70!');
    expect(chk).to.not.exist;
    chk = Luhn.addChecksum('uyete86');
    expect(chk).to.not.exist;
    chk = Luhn.addChecksum('');
    expect(chk).to.not.exist;
  });

  it('should return a string for strings with valid characters', function() {
    var chk = Luhn.addChecksum('27QNZBVKCLJK5X');
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum('LH989002BW3P');
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum('8S0JX31CCVD7Q8R');
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum('NCGWVQ79B4899SV');
    expect(chk).to.be.a('string');

  });

});


