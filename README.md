

# Thingworx Monaco Code Editor

The purpose of this project is to replace the script editor in ThingWorx Composer with a better one.
The new code editor is based on [Monaco Editor](https://microsoft.github.io/monaco-editor/index.html), the same editor used in [Visual Studio Code](https://code.visualstudio.com/). 

This project offers compatibility with both the **Old Composer** and the **New Composer** (8.4 release only). Please refer to the installation guide for more information. A mashup builder widget is also available to display code in a mashup runtime.

##Installation

1. Download the zip package listed under the downloads section under [**Releases**](/placatus/MonacoScriptEditorWidget/releases). It should be the one named _MonacoScriptEditor-VERSION.zip_

2. Import the zip package into Thingworx as an extension. After importing the following changes should occur:

   * In the old composer, the Monaco Script Editor is being used when editing services and subscriptions.
   * In the Mashup Builder, a widget called _Monaco Code Editor_ appears.

3. If you are using ThingWorx 8.4.X and want to use Monaco Script Editor within the New Composer, also do the following steps.

   1. Navigate to the tomcat where thingworx is deployed, under `apache-tomcat/webapps/Thingworx/Composer`. 
   2. Edit the file `index.html`.
   3. After _line 9_, after the existing `<script>` tag, add the following: 

   ```html
   <script type="text/javascript" src="../Common/extensions/MonacoScriptEditor/ui/MonacoScriptEditor/newComposer.bundle.js" charset="UTF-8"></script>
   ```

Please note that in the New Composer, all editors will be replaced with the Monaco editor, including the script editor, subscription editor, CSS editor, expression editor and other JSON/XML editors.

## Features
### Basic code editor features

As it's based on the Visual Studio Code, most basic code editor features are inherited from there. See the [official page](https://code.visualstudio.com/docs/editor/codebasics) for a list of keyboard shortcuts, as well as detailed explanations of other features like:
#### Multiple selections (multi-cursor)

The editor supports multiple cursors for fast simultaneous edits. You can add secondary cursors (rendered thinner) with `Alt+Click`. Each cursor operates independently based on the context it sits in. A common way to add more cursors is with `Ctrl+Alt+Down` or `Ctrl+Alt+Up` that insert cursors below or above.

![Multi-cursor](https://code.visualstudio.com/assets/docs/editor/codebasics/multicursor.gif)

`Ctrl+D` selects the word at the cursor, or the next occurrence of the current selection.

![Multi-cursor-next-word](https://code.visualstudio.com/assets/docs/editor/codebasics/multicursor-word.gif)

> **Tip:** You can also add more cursors with `kb(editor.action.selectHighlights)`, which will add a selection at each occurrence of the current selected text.
#### Column (box) selection

Hold `Shift` and `Alt` while dragging to do column selection:

![Column text selection](https://code.visualstudio.com/assets/docs/editor/codebasics/column-select.gif)
#### Folding

You can fold regions of source code using the folding icons on the gutter between line numbers and line start. Move the mouse over the gutter to fold and unfold regions. The folding regions are evaluated based on the indentation of lines. A folding region starts when a line has a smaller indent than one or more following lines, and ends when there is a line with the same or smaller indent.
### Code intelligence

The code editor offers a lot of features related to code intelligence: code completion, parameter info, quick info, and member lists. 

You can trigger completions in any editor by typing `Ctrl+Space` or by typing a trigger character (such as the dot character (.) in JavaScript).

#### Thingworx Completions

The editor offers optimized completions for all of the JavaScript functions, as well as the ones that ThingWorx has:

![img](https://i.imgur.com/59jpwpZ.gif)

The script editor is fully aware of the context and all of the entities in the platform, allowing search and on demand generation of completions based on what the user has written

![Function Completion](https://i.imgur.com/oU0m2pc.gif)

In the case of services that return infotables, or infotable properties with known datashapes, it offers advanced intellisense for the datashape fields, including completion of methods on the value collection, as well as snippets to ease the work

![Infotable Completion](https://i.imgur.com/TJfJ5sx.gif)


### Keyboard Shortcuts
* Quick actions: Save (`CTRL+S`), Cancel (`CTRL+Q`), Test (`CTRL+Y`), Save and Close (`CTRL+ENTER`)

* Diff editor: view changes since you started editing (`CTRL+K`)
  ![DiffEditor](http://i.imgur.com/1DywhM7.png)

* Config editor: Configure themes and all aspects of the editor, and viewing the changes in realtime (``CTRL+```)

  ![Config Editor](https://i.imgur.com/sBCAPP0.png)

### Typescript support

The developer can also write ThingWorx services using [typescript](https://www.typescriptlang.org/), a typed superset of JavaScript that compiles to plain JavaScript. Whether you want to use all the features of typescript, or just the latest ECMAScript features, this allows you to write more concise and better code that is automatically transpiled to JavaScript. This feature does not rely on any serverside component. The editor automatically converts your code into JavaScript and that is what is being executed.

In the old composer, you can trigger this change similarly to how you would switch from JavaScript to SQL.

In the new composer, press F1, select _Switch to Typescript_. The reverse action is also available.

![Typescript](https://i.imgur.com/O8SmVih.gif)

### Other Features
* Thingworx snippets (iterate infotable, create infotable, iterate infotable fields)
* In the new composer, the expression editor is also replaced with a proper editor

## Reporting issues 

Issues and suggestions can be reported at [**Issues**](/placatus/MonacoScriptEditorWidget/issues)