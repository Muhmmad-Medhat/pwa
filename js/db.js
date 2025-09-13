// enable offline data
db.enablePersistence().catch(function (err) {
  if (err.code == 'failed-precondition') {
    // probably multible tabs open at once
    console.log('persistance failed');
  } else if (err.code == 'unimplemented') {
    // lack of browser support for the feature
    console.log('persistance not available');
  }
});

// real-time listener
db.collection('recipes').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === 'removed') {
      // remove the document data from the web page
      deleteRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value,
  };
  db.collection('recipes')
    .add(recipe)
    .catch((err) => {
      console.log(err);
    });
  form.title.value = '';
  form.ingredients.value = '';
});

// delete recipe using event delegation
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', (event) => {
  console.log(`🚀 ~ event =>`, event);
  if (event.target.parentElement.classList.contains('recipe-delete')) {
    const id = event.target.parentElement.getAttribute('data-id');
    db.collection('recipes')
      .doc(id)
      .delete()
      .catch((err) => {
        console.log(err);
      });
  }
});

