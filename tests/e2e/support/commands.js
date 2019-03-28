// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

let LOCAL_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
    //console.log(key)
    //console.log(localStorage[key])
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  console.log(LOCAL_STORAGE_MEMORY)
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    //console.log(key)
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add("populateGraph", () => {
    //Create Project
    cy.get('[data-test="newprojectbutton"]').click({force: true});
    cy.get('[data-test="newprojectmodalinput"]').type('123');
    cy.get('[data-test="newprojectmodal"]').find('button').first().next().click({force: true});
    //Highlights current model and opens it
    cy.get('[data-test="projectFolder"]').click({force: true});
    cy.get('[data-test="modelFolder"]').first().click({force: true});
    cy.contains('binding_feature_component').click({force: true});
    //Creates a feature model
    cy.contains('Domain - 123').trigger('contextmenu', {force: true});
    cy.contains('New Diagram').click({force: true});
    cy.get('[data-test="newdiagramname"]').type('Model1');
    cy.get('[data-test="newdiagramtype"]').click({force: true});
    cy.contains('Feature').click({force: true});
    cy.get('[data-test="newdiagrammodal"]').find('button').first().next().click({force: true});
    //Populate feature model and saves
    //cy.get('#tabs').contains('Model1').click({force: true});
    cy.contains('Model1').click({force: true});
    cy.get('[title="Root Feature"]').trigger('mousedown', { which: 1, force: true }).trigger('mousedown', { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
    cy.get('[data-test="graphcontainer"]').contains('root').trigger('mousedown', { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', 500, 80, {force: true}).trigger('mouseup', {force: true})
    cy.get('[title="Leaf Feature"]').trigger('mousedown', { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
    cy.get('[data-test="graphcontainer"]').contains('leaf').trigger('mousemove', {force: true}).trigger('mousedown', 10, 5, { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').contains('root').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
    cy.get('#buttonSAVE > .btn-model-area').click({force: true})
    //Create component model
    cy.contains('Domain - 123').trigger('contextmenu', {force: true});
    cy.contains('New Diagram').click({force: true});
    cy.get('[data-test="newdiagramname"]').type('Model2');
    cy.get('[data-test="newdiagramtype"]').click({force: true});
    cy.contains('Component').click({force: true});
    cy.get('[data-test="newdiagrammodal"]').find('button').first().next().click({force: true});
    //Populate component model and saves
    cy.get('#tabs').contains('Model2').click({force: true});
    cy.get('[src="/variamosweb/images/models/component/component.png"]').trigger('mousedown', { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
    cy.get('#buttonSAVE > .btn-model-area')
    //Go to binding model and connect feature to model and save
    cy.get('#tabs').contains('binding_feature_component').click({force: true});
    cy.get('[data-test="graphcontainer"]').contains('component').trigger('mousedown', { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').trigger('mousemove', 500, 80, {force: true}).trigger('mouseup', {force: true})
    cy.get('[data-test="graphcontainer"]').contains('leaf').trigger('mousemove', {force: true}).trigger('mousedown', 10, 5, { which: 1, force: true })
    cy.get('[data-test="graphcontainer"]').contains('component').trigger('mousemove', {force: true}).trigger('mouseup', {force: true})
    cy.get('#buttonSAVE > .btn-model-area')
});