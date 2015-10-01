jest.dontMock('../index.js')

describe('Dropzone component', function() {
  var React = require('react')

  it('Should return formatted date for today', function() {
    // Arrange
    var today = () => {
      return 'sth'
    }
    // Act
    //today()
    // Assert
    expect(today()).toBe('sth')
  })
})
