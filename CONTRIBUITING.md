# Contributing & Maintaining

This repository contains the code for adding monaco editor into thingworx, both the new composer and the old composer, as well as the widget that can be used during runtime.

This project uses the normal, upstream version of [monaco-editor](https://github.com/microsoft/monaco-editor/), but replaces the standard [monaco-typescript](https://github.com/microsoft/monaco-typescript/) with a forked version [@placatus/monaco-typescript](https://github.com/stefan-lacatus/monaco-typescript/).

The forked version of `monaco-typescript` adds necessary methods to the typescript worker for parsing the code and more.
## Updating the used monaco version

1. Sync the [@placatus/monaco-typescript](https://github.com/stefan-lacatus/monaco-typescript) repository to the upstream at [monaco-typescript](https://github.com/microsoft/monaco-typescript/). Following the guide [here](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork) is recommended. Make sure that the changes in `tsWorker.ts` are preserved.
2. Publish a new version of _@placatus/monaco-typescript_ to npm. 
    _Note:_ If no changes were done in the upstream version of `monaco-typescript`, steps 1 and 2 can be skipped.
3. In this project, update the version number of the `monaco-editor` to the latest released version in the `package.json`.
4. If a new version of `monaco-typescript` was published, make sure to change the that version number as well.
5. Run 
    ```bash
    yarn install
    yarn run build
    ```
6. In the zip folder, you should have the built version of the extension.

## Publishing a new release to github

The widget uses [semantic-release](https://semantic-release.gitbook.io/) and GitHub Actions for automatic version management and package publishing. This automates the whole widget release workflow including: determining the next version number, generating the release notes, updating the _CHANGELOG.MD_ and publishing a release. Please read through the *semantic-release* official documentation to better understand how it works.

Because we are using *semantic-release* the commit messages must follow a specific format called [Angular commit conventions or Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). It is mandatory that this is followed. To help with this, the project is also setup with [commitizen](https://commitizen.github.io/cz-cli/) as a dev-dependency. So, you can use `git cz` instead of `git commit` to create a new commit.

The repository has two branches:

* **master**: This is where the main development takes place. 
* **release**: The branch containing the latest release of the widget. Pushing to this branch triggers the `semantic-release`, updating the *CHANGELOG.MD* file, and creating a new GitHub release.

To create a new release, simply merge **master** into **release** and push the changes to github. An action will automatically be triggered.