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

## Publishing a new release to github

The widget uses [semantic-release](https://semantic-release.gitbook.io/) and GitHub Actions for automatic version management and package publishing. This automates the whole widget release workflow including: determining the next version number, generating the release notes, updating the _CHANGELOG.MD_ and publishing a release. Please read through the *semantic-release* official documentation to better understand how it works.

Because we are using *semantic-release* the commit messages must follow a specific format called [Angular commit conventions or Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). It is mandatory that this is followed. To help with this, the project is also setup with [commitizen](https://commitizen.github.io/cz-cli/) as a dev-dependency. So, you can use `git cz` instead of `git commit` to create a new commit.

The repository has two branches:

* **master**: This is where the main development takes place. 
* **release**: The branch containing the latest release of the widget. Pushing to this branch triggers the `semantic-release`, updating the *CHANGELOG.MD* file, and creating a new GitHub release.

To create a new release, simply merge **master** into **release** and push the changes to github. An action will automatically be triggered.