var test = require('tap').test
var toml = require('toml')
var toTOMLString = require('../').toTOMLString

test('arrays to TOML', function (t) {
  t.test('with an empty array', function (t) {
    var input = { irie: [] }

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'empty array successfully converted')

      if (!er) {
        t.equals(output, 'irie = [  ]\n')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.test('with a type-consistent array of primitive values', function (t) {
    var input = {irate: [0, 1, 2]}

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'integer array successfully converted')

      if (!er) {
        t.equals(output, 'irate = [ 0, 1, 2 ]\n')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.test('with a type-inconsistent array of primitive values', function (t) {
    var input = {irksome: [0, false, 2]}

    toTOMLString(input, function (er, output) {
      t.equal(
        er && er.message,
        'for array with path irksome, expected number but got boolean',
        'got expected error message'
      )
      t.notOk(output, "shouldn't have gotten any output from the stream")

      t.end()
    })
  })

  t.test('with an array of arrays of primitive values', function (t) {
    var input = {
      airy: [
        [ 1, 2 ],
        [ 'buckle', 'my', 'shoe' ],
        [ 3, 4 ],
        [ 'open', 'the', 'door' ]
      ]
    }

    var expected = [
      'airy = [',
      '  [ 1, 2 ],',
      '  [ "buckle", "my", "shoe" ],',
      '  [ 3, 4 ],',
      '  [ "open", "the", "door" ]',
      ']'
    ].join('\n') + '\n'

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'array of arrays successfully converted')

      if (!er) {
        t.equals(output, expected, 'serialized array properly')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.test('with an array of arrays of inconsistent values', function (t) {
    var input = {
      eerie: [
        [ 1, 'ham', true ]
      ]
    }

    toTOMLString(input, function (er, output) {
      t.equal(
        er && er.message,
        'for array with path eerie, expected number but got string',
        'got expected error message'
      )
      t.notOk(output, "shouldn't have gotten any output from the stream")

      t.end()
    })
  })

  t.test('with an array of arrays with values of unknown type', function (t) {
    var input = {
      eerie: [
        [ true, false, true ],
        [ undefined, undefined, undefined ]
      ]
    }

    toTOMLString(input, function (er, output) {
      t.equal(
        er && er.message,
        'unexpected type: \'undefined\'',
        'got expected error message'
      )
      t.notOk(output, "shouldn't have gotten any output from the stream")

      t.end()
    })
  })

  t.test('with an array of arrays of dates', function (t) {
    var input = {
      airy: [
        [ new Date('2017-08-10T08:34:12.666Z') ],
        [ new Date('2012-09-06T12:34:00Z') ],
        [ new Date('1999-04-16T18:11:58.123Z') ]
      ]
    }

    var expected = [
      'airy = [',
      '  [ 2017-08-10T08:34:12.666Z ],',
      '  [ 2012-09-06T12:34:00.000Z ],',
      '  [ 1999-04-16T18:11:58.123Z ]',
      ']'
    ].join('\n') + '\n'

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'array of arrays successfully converted')

      if (!er) {
        t.equals(output, expected, 'serialized array properly')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.test('with an array of arrays of arrays', function (t) {
    var input = {
      aerie: [
        [
          [ 1, 2 ],
          [ 3, 4 ]
        ],
        [
          [ 5, 6 ],
          [ 7, 8 ]
        ],
        [
          [ 'a', 'b', 'c' ],
          [ 'd', 'e', 'f' ],
          [ 'g', 'h', 'i', 'j' ]
        ]
      ]
    }

    var expected = [
      'aerie = [',
      '  [',
      '    [ 1, 2 ],',
      '    [ 3, 4 ]',
      '  ],',
      '  [',
      '    [ 5, 6 ],',
      '    [ 7, 8 ]',
      '  ],',
      '  [',
      '    [ "a", "b", "c" ],',
      '    [ "d", "e", "f" ],',
      '    [ "g", "h", "i", "j" ]',
      '  ]',
      ']'
    ].join('\n') + '\n'

    toTOMLString(input, function (er, output) {
      t.ifError(er, 'array of arrays of arrays successfully converted')

      if (!er) {
        t.equals(output, expected, 'serialized array properly')
        t.same(toml.parse(output), input, 'round trip test worked')
      }
      t.end()
    })
  })

  t.end()
})
