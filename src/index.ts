import * as monaco from '../node_modules/monaco-editor/esm/vs/editor/editor.api';

window.onload = function () {
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).
  
  monaco.editor.create(document.getElementById('container'), {
    value: 'console.log("Hello, world")',
    language: 'javascript'
  });
};
