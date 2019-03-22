// https://docs.cypress.io/api/introduction/api.html

describe('UI test', () => {

  before(() => {
    //cy.clearLocalStorage();
  });
  
  beforeEach(() => {
    //cy.restoreLocalStorage();
    //cy.wait(500)
    //console.log(localStorage)
    cy.visit('/')
  });

  it.skip('1.0 Succesfully sets up a set of models', () => {
    cy.populateGraph();
    //Persist a populated graph
    cy.saveLocalStorage();
  })

  it.skip('1.0.1 Autoload Diagram from storage', () => {
    cy.visit('/')
    cy.contains('Model2').click();
    /*
    //Create Project
    cy.get('[data-test="newprojectbutton"]').click();
    cy.get('[data-test="newprojectmodalinput"]').type('123');
    cy.get('[data-test="newprojectmodal"]').find('button').first().next().click();
    //Highlights current model and opens it
    cy.get('[data-test="projectFolder"]').click();
    cy.get('[data-test="modelFolder"]').first().click();
    cy.contains('binding_feature_component').click();
    //Assertions
    cy.get('[data-test="graphcontainer"]').contains('leaf').should('have.length', 1);
    cy.get('[data-test="graphcontainer"]').should('contain', 'component')
    */
  })

  it('1.5 Removing a model should delete all instances of leaves', () => {
    cy.populateGraph();
    //Deletes component model and checks for existence of component
    cy.contains('Model2').trigger('contextmenu')
    cy.get('#vue-contextmenuName-menu39 > :nth-child(2) > button').contains('delete').click();
    cy.get('[data-test="graphcontainer"]').should('not.contain', 'component')
    cy.get('#tabs').should('not.contain', 'Model2')
    //Deletes feature model and checks for existence of leaf
    cy.contains('Model1').trigger('contextmenu');
    cy.get('#vue-contextmenuName-menu38 > :nth-child(2) > button').contains('delete').click();
    cy.get('[data-test="graphcontainer"]').should('not.contain', 'leaf')
  })

  it('1.7 Check correct types are shown for each type of pallet', () => {
    //Create Project
    cy.get('[data-test="newprojectbutton"]').click();
    cy.get('[data-test="newprojectmodalinput"]').type('123');
    cy.get('[data-test="newprojectmodal"]').find('button').first().next().click();
    //Highlights current model and opens it
    cy.get('[data-test="projectFolder"]').click();
    cy.get('[data-test="modelFolder"]').first().click();
    cy.contains('binding_feature_component').click();
    //Creates a feature model
    cy.contains('Domain - 123').trigger('contextmenu');
    cy.contains('New Diagram').click();
    cy.get('[data-test="newdiagramname"]').type('Model1');
    cy.get('[data-test="newdiagramtype"]').click();
    cy.contains('Feature').click();
    cy.get('[data-test="newdiagrammodal"]').find('button').first().next().click();
    //Checks the presence of the feature model palette
    cy.contains('Model1').click();
    cy.get('.pallete-area')
      .should('contain', 'Root Feature')
      .should('contain', 'General Feature')
      .should('contain', 'Leaf Feature')
      .should('contain', 'Bundle')
    //Creates a feature model
    cy.contains('Domain - 123').trigger('contextmenu');
    cy.contains('New Diagram').click();
    cy.get('[data-test="newdiagramname"]').type('Model2');
    cy.get('[data-test="newdiagramtype"]').click();
    cy.contains('Component').click();
    cy.get('[data-test="newdiagrammodal"]').find('button').first().next().click();
    //Checks the presence of the component model palette
    cy.get('#tabs').contains('Model2').click();
    cy.get('.pallete-area')
      .should('contain', 'Component')
      .should('contain', 'File')
  })

  it('1.8 (& 1.6) All items must appear in the tree', () => {
    cy.populateGraph();
    //Assert that the features will exist in the tree
    cy.get('.naza-tree-inner').contains('Model1').parent().find('[data-test="modelFolder"]').click({force: true})
    cy.get(':nth-child(4) > .naza-tree-warp > .naza-tree-inner').should('contain', 'root')
    cy.get(':nth-child(4) > .naza-tree-warp > .naza-tree-inner').should('contain', 'leaf')
    //TODO: Assert that the components will exist in the tree
    //TODO: Assert that the binding model will contain both
  })

  it('1.9 Returning home clears models', () => {
    cy.populateGraph();
    cy.contains('Home').click({force: true});
    //Assert that the container will remain full
    cy.get('.naza-tree-inner').contains('Model1').click({force: true});
    cy.get('[data-test="graphcontainer"]').should('contain', 'leaf')
    cy.get('[data-test="graphcontainer"]').should('contain', 'root')
    //TODO: Assert that the components container will remain full
    //TODO: Assert that the binding model container will remain full
  })
})

