const fs = require('fs');
const path = require('path');
const fse = require('fs-extra'); // Plus robuste

const sourceDir = path.resolve(__dirname, '../test');
const targetDir = path.resolve(__dirname, '../back/public/test');

fse.copy(sourceDir, targetDir)
  .then(() => {
    console.log('✅ Dossier "test" copié avec succès dans public !');
  })
  .catch(err => {
    console.error('❌ Erreur lors de la copie du dossier test :', err);
  });