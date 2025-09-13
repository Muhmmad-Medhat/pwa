const recipesContainer = document.querySelector('.recipes');

document.addEventListener('DOMContentLoaded', function () {
  /**
   * Initializes side navigation menus.
   * @param {NodeListOf<Element>} menus - The NodeList of elements to initialize as side menus.
   * @param {object} options - Options for the M.Sidenav.init function.
   */
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });
  // add recipe form
  /**
   * Initializes side forms.
   * @param {NodeListOf<Element>} forms - The NodeList of elements to initialize as side forms.
   * @param {object} options - Options for the M.Sidenav.init function.
   */
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });
});

const renderRecipe = (recipe, id) => {
  const recipeEl = `
  <div class="card-panel recipe white row" data-id="${id}">
        <img src="/img/dish.png" alt="recipe thumb" />
        <div class="recipe-details">
          <div class="recipe-title">${recipe.title}</div>
          <div class="recipe-ingredients">${recipe.ingredients
            .split(',')
            .join(', ')}</div>
        </div>
        <div class="recipe-delete" data-id="${id}">
          <i class="material-icons">delete_outline</i>
        </div>
  </div>
  `;
  recipesContainer.innerHTML += recipeEl;
};

// Expose renderRecipe to the global window so other non-module scripts can call it
window.renderRecipe = renderRecipe;
