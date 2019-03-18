// https://docs.cypress.io/api/introduction/api.html

describe('Create a project', () => {
  

  before(() => {
    cy.visit('/variamosweb/')
  })

  it('Touches the create new project button and creates a feature model', () => {
    cy.get('[data-test="newprojectbutton"]').click();

    cy.get('[data-test="newprojectmodalinput"]').type('123');

    cy.get('[data-test="newprojectmodal"]').find('button').first().next().click();

    cy.get('[data-test="projectFolder"]').click();
    cy.get('[data-test="modelFolder"]').first().click();
    cy.contains('binding_feature_component').click();

    cy.contains('Domain - 123').trigger('contextmenu');
    cy.contains('New Diagram').click();

    cy.get('[data-test="newdiagramname"]').type('Model1');
    cy.get('[data-test="newdiagramtype"]').click();
    cy.contains('Feature').click();
    cy.get('[data-test="newdiagrammodal"]').find('button').first().next().click();
  })

  it('Interacts with the feature model and creates two elements and links them',() => {

    cy.get('#tabs').contains('Model1').click();
    cy.get('[title="Root Feature"]').trigger('mousedown', { which: 1 })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})

    cy.get('[data-test="graphcontainer"]').contains('root').trigger('mousedown', { which: 1 })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', 500, 80, {force: true}).trigger('mouseup', {force: true})

    cy.get('[title="Leaf Feature"]').trigger('mousedown', { which: 1 })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove').trigger('mouseup', {force: true})

    cy.get('[data-test="graphcontainer"]').contains('leaf').trigger('mousemove').trigger('mousedown', 10, 5, { which: 1 })
    cy.get('[data-test="graphcontainer"]').contains('root').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})

  })

  it('Creates a new model', () => {
    cy.contains('Domain - 123').trigger('contextmenu');
    cy.contains('New Diagram').click();

    cy.get('[data-test="newdiagramname"]').type('Model2');
    cy.get('[data-test="newdiagramtype"]').click();
    cy.contains('Component').click();
    cy.get('[data-test="newdiagrammodal"]').find('button').first().next().click();
  })

  it('Interacts with the component model and creates one element', () => {
    cy.get('#tabs').contains('Model2').click();

    cy.get('[src="/variamosweb/images/models/component/component.png"]').trigger('mousedown', { which: 1 })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
  })

  it('Checks that within the binding model both exist and links the leaf to the component', () => {
    cy.get('#tabs').contains('binding_feature_component').click();
    cy.get('[data-test="graphcontainer"]').contains('component').trigger('mousedown', { which: 1 })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', 500, 80, {force: true}).trigger('mouseup', {force: true})
    
    cy.get('[data-test="graphcontainer"]').contains('leaf').trigger('mousemove').trigger('mousedown', 10, 5, { which: 1 })
    cy.get('[data-test="graphcontainer"]').contains('component').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
  })
})
