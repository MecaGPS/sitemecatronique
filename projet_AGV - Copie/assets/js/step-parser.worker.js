const OCCT_BASE = new URL('../vendor/occt-import-js/', self.location.href).href;

importScripts(OCCT_BASE + 'occt-import-js.js');

self.onmessage = async (event) => {
  try {
    const occt = await occtimportjs({
      locateFile: (path) => OCCT_BASE + path
    });
    const result = occt.ReadFile(event.data.format, event.data.buffer, event.data.params);
    if (!result?.meshes?.length) {
      self.postMessage({ ok: false, error: 'Aucun maillage dans le fichier STEP.' });
      return;
    }
    self.postMessage({ ok: true, result });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error?.message || 'Erreur lors de la lecture du fichier STEP.'
    });
  }
};
