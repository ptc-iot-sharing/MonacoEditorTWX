# Contributing & Maintaining

This repository contains the code for adding monaco editor into thingworx, both the new composer and the old composer, as well as the widget that can be used during runtime.

This project does not have a direct dependency on [monaco-editor](https://github.com/microsoft/monaco-editor/) but rather on a forked version [@placatus/monaco-editor](https://github.com/stefan-lacatus/monaco-editor). The only change in this forked version the change that replaces the standard  [monaco-typescript](https://github.com/microsoft/monaco-typescript/) with a forked version [@placatus/monaco-typescript](https://github.com/stefan-lacatus/monaco-typescript/).

The forked version of monaco-typescript adds support for declaring new languages based on the typescript worker.

## Updating the used monaco version

1. Sync the [@placatus/monaco-typescript](https://github.com/stefan-lacatus/monaco-typescript) repository to the upstream at [monaco-typescript](https://github.com/microsoft/monaco-typescript/). Following the guide [here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork) is recommended. Make sure to preserve all the changes enable the named workers, as well as the new package name.
2. Publish a new version of _@placatus/monaco-typescript_ to npm. 
3. Sync the [@placatus/monaco-editor](https://github.com/stefan-lacatus/monaco-editor) repository to the upstream at [monaco-editor](https://github.com/microsoft/monaco-editor/). The only changes that need to be preserved are `package.json`. Remember to update the version number of _monaco-typescript_ to the one you published in step _2_.
4. Publish a new version of _@placatus/monaco-editor_ to npm. You can use the following commands
    ```bash
    npm run release
    cd release
    npm publish --access public
    ```
5. In this project, update the version number of the _@placatus/monaco-editor_ to the one published in step _4_.
6. Run 
    ```bash
    yarn install
    yarn run build
    ```
7. In the zip folder, you should have the built version of the extension.
