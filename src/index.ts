import { MonacoCodeEditor } from "./basicCodeEditor";
import { DEFAULT_EDITOR_SETTINGS } from "./constants";

window.onload = function () {
  // Program starts here. Creates a sample graph in the
  // DOM node with the specified ID. This function is invoked
  // from the onLoad event handler of the document (see below).

  new MonacoCodeEditor(document.getElementById("container"), DEFAULT_EDITOR_SETTINGS, {
    onClose: () => {
      console.log("close action")
    },
    onSave: () => {
      console.log("save action")
    }, onDone: () => {
      console.log("done action")
    }, onTest: () => {
      console.log("test action")
    }, onPreferencesChanged: (preferences) => {
      console.log("preferences action " + preferences)
    }
  }, "test123", "javascript");
};
