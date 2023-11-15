const { Storage } = require('@google-cloud/storage');
const User = require('../models/user');

const storage = new Storage({
  projectId: "hl-delivery",
  keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://hl-delivery.appspot.com");

async function eliminarArchivosNoNecesarios() {
  try {
      const dbUrls = (await User.eliminarImg()).map(item => item.image);

      const [files] = await bucket.getFiles();

      const archivosEliminados = [];

      for (const file of files) {
          const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${file.metadata.metadata.firebaseStorageDownloadTokens}`;

          if (!dbUrls.includes(fileUrl)) {
              await file.delete();
              archivosEliminados.push(fileUrl);
              // console.log(`Archivo ${file.name} eliminado.`);
          }
      }

      return archivosEliminados;
  } catch (error) {
      throw new Error(error);
  }
}

module.exports = { eliminarArchivosNoNecesarios };
