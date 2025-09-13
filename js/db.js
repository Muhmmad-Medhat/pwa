import {
  collection,
  onSnapshot,
  getFirestore,
} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import { renderRecipe } from './ui.js';

const db = getFirestore();

const recipesRef = collection(db, 'recipes');
onSnapshot(
  recipesRef,
  (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        // console.log('New recipe added: ', change.doc.data());
        renderRecipe(change.doc.data(), change.doc.id);
      } else if (change.type === 'modified') {
        // console.log('Recipe modified: ', change.doc.data());
      } else if (change.type === 'removed') {
        // console.log('Recipe removed: ', change.doc.data());
      }
    });
  },
  (err) => {
    console.error('Error listening to recipes collection:', err);
  }
);
