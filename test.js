/* jshint expr: true */
/* globals describe, it, require */
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
    var i = 0, len, str, j;
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
      Luhn.random(1);
    }).to.throw();
    expect(function() {
      Luhn.random('p');
    }).to.throw();
    expect(function() {
      Luhn.random('8');
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
    var chk = Luhn.check('KDL6ZR8JLBJM9DJ');
    expect(chk.result).to.be.true;
    chk = Luhn.check('3RPQ75F4J');
    expect(chk.result).to.be.true;
    chk = Luhn.check('6DH051HT0VBQQDX');
    expect(chk.result).to.be.true;
    chk = Luhn.check('KPJD27SM');
    expect(chk.result).to.be.true;

  });

  it('should be true for validly checksummed strings when a callback is supplied', function (done) {
    Luhn.check('KDL6ZR8JLBJM9DJ', function (error, result) {
      expect(result).to.be.true;
      Luhn.check('3RPQ75F4J', function (error, result) {
        expect(result).to.be.true;
        Luhn.check('KPJD27SM', function (error, result) {
          expect(result).to.be.true;
          done();
        });
      });
    });
  });

});

describe('addChecksum', function() {
  it('should fail for a string that is too short or has invalid characters', function() {
    expect(function(){Luhn.addChecksum('BABA70!');}).to.throw();
    expect(function(){Luhn.addChecksum('uyete86');}).to.throw();
    expect(function(){Luhn.addChecksum('');}).to.throw();
  });

  it('should fail for a string that is too short or has invalid characters '+
     'when a string is used to specify the characters we want', function() {
    expect(function(){Luhn.addChecksum('PCZ8W3HQ4N0XK', '01234567890');}).to.throw();
    expect(function(){Luhn.addChecksum('uyete86', 'PCZ8W3HQ4N0XK');}).to.throw();
    expect(function(){Luhn.addChecksum('', 'PCZ8W3HQ4N0XK');}).to.throw();
  });

  it('should return a string for strings with valid characters', function() {
    var chk = Luhn.addChecksum('DW9S91FJLR24V5Z');
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum('MTV3B5BR');
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum(Luhn.cryptoRandomString(10));
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum(Luhn.cryptoRandomString(10, '0123456789'), '0123456789');
    expect(chk).to.be.a('string');
    chk = Luhn.addChecksum('L449V3SKXQFP6ZQ515');
    expect(chk).to.be.a('string');

  });

});

