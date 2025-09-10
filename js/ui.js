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
