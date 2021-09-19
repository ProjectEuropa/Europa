describe('google search', () => {
  it('should work', () => {
    cy.visit('https://project-europa.herokuapp.com/');
    cy.get('h1').should('have.text', 'Welcome to Europa')
  });
});
