# Thingworx Monaco Code Editor

 The purpose of this project is to replace the script editor in Thinworx Composer with a better one.
 The new code editor is based on [Monaco Editor](https://microsoft.github.io/monaco-editor/index.html), the same editor used in [Visual Studio Code](https://code.visualstudio.com/). 

## Features
### Basic code editor features

As it's based on the Visual Studio Code, most basic code editor features are inherited from there. See the [official page](https://code.visualstudio.com/docs/editor/codebasics) for a list of keyboard shortcuts, as well as detailed explanations of other features like:
#### Multiple selections (multi-cursor)

VS Code supports multiple cursors for fast simultaneous edits. You can add secondary cursors (rendered thinner) with `Alt+Click`. Each cursor operates independently based on the context it sits in. A common way to add more cursors is with `Ctrl+Alt+Down` or `Ctrl+Alt+Up` that insert cursors below or above.

![Multi-cursor](https://code.visualstudio.com/images/editingevolved_multicursor.gif)

`Ctrl+D` selects the word at the cursor, or the next occurrence of the current selection.

![Multi-cursor-next-word](https://code.visualstudio.com/images/editingevolved_multicursor-word.gif)

> **Tip:** You can also add more cursors with `kb(editor.action.selectHighlights)`, which will add a selection at each occurrence of the current selected text.
#### Column (box) selection

Hold `Shift` and `Alt` while dragging to do column selection:

![Column text selection](https://code.visualstudio.com/images/editingevolved_column-select.gif)
#### Folding

You can fold regions of source code using the folding icons on the gutter between line numbers and line start. Move the mouse over the gutter to fold and unfold regions. The folding regions are evaluated based on the indentation of lines. A folding region starts when a line has a smaller indent than one or more following lines, and ends when there is a line with the same or smaller indent.
### IntelliSense

IntelliSense is a general term for a variety of code editing features including: code completion, parameter info, quick info, and member lists. IntelliSense features are sometimes called by other names such as "code completion", "content assist", and "code hinting."

You can trigger IntelliSense in any editor by typing `Ctrl+Space` or by typing a trigger character (such as the dot character (.) in JavaScript).

#### Function autocompletion

All the function definitions are availbe for autocomplete. For example:
![Function Completion](http://i.imgur.com/SCS4W1s.gif)

#### Entity autocompletion
Metadata about the current entity is used in autocompletion. 
![Me Completion](http://i.imgur.com/8qyrRaY.gif)

We also autocomplete entity names for all entity collections, as well as service parameters. The completion also includes the descriptions available.
![Service Completion](http://i.imgur.com/YhoaOoJ.gif)

In the case of services that return infotables, or infotable properties with known datashapes, we offer advanced intellisense for the datashape fields
![Infotable Completion](http://i.imgur.com/3pNrEC1.gif)

### Keyboard Shortcuts
* Quick actions: Save (CTRL+S), Cancel (CTRL+Q), Test (CTRL+Y), Save and Close (CTRL+ENTER)
* Diff editor: view changes since you started editing (CTRL+K)
![DiffEditor](http://i.imgur.com/1DywhM7.png)

### Other Features
* Thingworx snippets (iterate infotable, create infotable, iterate infotable fields)
![Snippets](http://i.imgur.com/qAn3CwY.gif)
* Theme support (F1 -> select "Change Theme" option )
* Support for SQL services

## Known issues:
 * Intellisense sometimes fails when multiple editors are open at the same time. 

## Download the latest prebuild binary from here:
ftp://rostorage.ptcnet.ptc.com/SHARE/Petrisor/monaco/MonacoEditor_widget.zip (guest1:guest for auth)
