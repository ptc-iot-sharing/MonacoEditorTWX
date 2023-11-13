# [1.26.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.6...v1.26.0) (2023-11-13)


### Features

* enable remote json schema requests for json objects. See https://json-schema.org/understanding-json-schema/reference/schema ([03bfbf4](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/03bfbf49c4afeeaac0234f633266d9959f684eff))

## [1.25.6](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.5...v1.25.6) (2023-11-13)


### Bug Fixes

* **pipeline:** resolve issue where the production release was not attached to the release ([7efef88](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/7efef88fe61a295add1f31a347bb4272036928c3))

## [1.25.5](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.4...v1.25.5) (2023-11-13)


### Bug Fixes

* if prettier config was missing the editor would not be initialized ([aa72a5e](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/aa72a5e789e64e4f342ffd0f8659e8dce2b1c2cc))

## [1.25.4](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.3...v1.25.4) (2023-09-13)


### Bug Fixes

* **deps:** update monaco to 0.43.0 ([05053a4](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/05053a4a3a897e19e66ce8cfac8fbf77144b0e72))

## [1.25.3](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.2...v1.25.3) (2023-09-10)


### Bug Fixes

* autocompletion for all thingworx types not working. This was due to the ThingWorx type definitions being incorrectly imported ([1c8c822](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/1c8c822741384eaafad6a1204ff7ad40307eb0a7))

## [1.25.2](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.1...v1.25.2) (2023-08-22)


### Bug Fixes

* resolve prettier (format document) no longer working ([a5b5394](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a5b539417b876f7484132cf0ed1b90a11ac5ac1a))

## [1.25.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.25.0...v1.25.1) (2023-08-22)


### Bug Fixes

* Update dependencies, update monaco to 0.39.0. Improve upload to thingworx ([91dcf52](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/91dcf52afa15300cef2d4edf52c11b6d98c1b20f))

# [1.25.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.24.2...v1.25.0) (2023-05-28)


### Features

* Update monaco to 0.38.0 ([1d2487f](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/1d2487fa02f36be5a108f8f04497d5808e2e7320))

## [1.24.2](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.24.1...v1.24.2) (2022-03-16)


### Bug Fixes

* JSON service output is not correctly displayed after multiple executions. Fix [#37](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/37) ([94cc92b](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/94cc92ba3d382178d660f3e806f6f961ec779402))
* Set the editor property `fixedOverflowWidgets` to true so hints appear on top of composer elements ([579b604](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/579b60485f3e91d2d871be53d57247952f5813ed))

## [1.24.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.24.0...v1.24.1) (2022-03-13)


### Bug Fixes

* Resolve issue where JSON/XML editors would not display correctly if opened quickly ([719ba1e](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/719ba1e482dc9fbf69b3c486ab7cd3c079de5422))
* Specify the custom typescript worker on initial initialization, to get around issues with the CodeHost not loading correctly ([a13934f](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a13934faf721f1162d9f14dea0bf65fef01bcf4a))
* Update monaco-editor to 0.33.0 ([e7abaec](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/e7abaecb06f8cdcdfe961e97e665be8216af8592))
* Update snippets to use `let` instead of `var` ([3e00849](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/3e00849c31600b16a007adf71c5750b159f81f56))

# [1.24.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.23.1...v1.24.0) (2022-02-27)


### Bug Fixes

* Drop emmet related code, since it wasn't working even before. Will be added back once upstream is fixed ([42820cb](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/42820cb846ae6764564e0e44ff1bf72be566bd85))
* Resolve issue where reopeing a subscribtion editor, or re-executing a service that returns a JSON would lead to a white screen. Fix [#34](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/34) ([849dfdb](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/849dfdb1a71c76be5a3a243c4f22b92b993bb22b))


### Features

* Code can be formatted using prettier instead of the default formatter. Formatting options can be configured through the config screen. ([90fd73d](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/90fd73d481fe757acc194746babc3e0acaaad286))
* Package editor as ES2020. ([4e861f4](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/4e861f4c855bd826c719fbb091099a334a291cee))
* The configuration editor now displays all configuration using their nested format. Add configuration options for `prettier`, and document all configuration in schemas. Set the schema to apply only to the configuration editor model, and not other JSON models. ([73aaac7](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/73aaac7d0efe0c918275de3afab2bfb61181f553))
* Update `monaco-editor` to 0.32.1 ([79f1a3a](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/79f1a3a551a7754a5799b897106b98702e0fa44a))
* Use a custom typescript worker rather than using a custom `monaco-typescript` package. ([5eeb7a4](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/5eeb7a42c741fec157c4b45d7e516c4c9dd063c9))

## [1.23.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.23.0...v1.23.1) (2022-01-13)


### Bug Fixes

* Resolve compatibility issues with ThingWorx 9.3 where autocomplete information is not correctly displayed on services ([9a1d615](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/9a1d61582ddbbfb5acea6c575dbf83c93544c8e9))

# [1.23.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.22.2...v1.23.0) (2021-11-05)


### Features

* Bump monaco editor to 0.30.0. ([a39cbfa](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a39cbfa98834f249a89867ac5f34ef2a85ebaf78))
* Inlay hints for types are default enabled can can be configured using `editor.inlayHints` option. Added configuration option to enable `bracketPairColorization`. This is only applied when the editor first loads ([fe4ccb6](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/fe4ccb6036115d8c3af4e1019ca1870b9a583664))

## [1.22.2](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.22.1...v1.22.2) (2021-09-23)


### Bug Fixes

* Update depedencies, including bumping monaco to 0.28.0 ([829e292](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/829e292d6b9dd2850936134cdac9b3e69b1f2fb1))
* Widget now has an icon in the composer and does not block the display of other widgets ([5f23cd7](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/5f23cd79734e5d2a6e666621671edd38c1b7a025))

## [1.22.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.22.0...v1.22.1) (2021-09-21)


### Bug Fixes

* Fix issue loading font file from CDN by removing deprecated loaders, and upgrade to webpack 5. ([0ac4b79](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/0ac4b799303abce496319bd4e150eafdef3350a4))

# [1.22.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.21.1...v1.22.0) (2021-09-21)


### Bug Fixes

* **Internal Change:** Adopt the usage of the new monaco-typescript, without and alias `monaco-editor-core` to `monaco-editor` ([979f93b](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/979f93b99eb655ce58509db38bd04a824b4cc6e7))
* Properly dispose of all global monaco listeners and configurations when the editor is disposed ([0ab50a1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/0ab50a19f67f57c59561b5e359f832e052b6648f))


### Features

* Replace usage of a forked `monaco-editor` with the upstream one. Import only a custom version of `monaco-typescript` that has the worker methods needed ([27f2d08](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/27f2d08f6df8a120109810496b81028bf0202240))

## [1.21.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.21.0...v1.21.1) (2021-08-12)


### Bug Fixes

* Resolve issue where the text in the find widget of the service editor was hidden ([00bec2e](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/00bec2e801f329180edd246d3020f77ed8b3924b))

# [1.21.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.20.1...v1.21.0) (2021-08-09)


### Features

* Generate the Resource definitions on demand, rather than preloading them ([1182162](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/118216285eeaf6a126314827cbda512172bdba55))
* Remove the need for any imported entity used to make the editor function. Only native thingworx endpoints are used now ([3dacb2c](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/3dacb2c963a362df6366fd35a8ddc84228906a67))
* use the native ThingWorx export endpoint to get information about all datashapes ([3d14462](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/3d14462cbb6344f977a2a533f12cefa4c25afff3))

## [1.20.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.20.0...v1.20.1) (2021-08-08)


### Bug Fixes

* Make sure the npm publish is done on the latest tag ([2cb0704](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/2cb0704f88ab3db2174d8e5f42c54b3f1cd2beda))

# [1.20.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.19.3...v1.20.0) (2021-08-08)


### Features

* Added description about how to use monaco editor without importing the extension, but rather loading it from a CDN ([8580d2e](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/8580d2e9bbfd6a75a0485668ede57ccd25affa31))

## [1.19.3](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.19.2...v1.19.3) (2021-08-07)


### Bug Fixes

* Try again a publish that hopefully includes build dir ([417925c](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/417925c51350e8095ef3b7b052c6372ebaf2eaf7))

## [1.19.2](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.19.1...v1.19.2) (2021-08-07)


### Bug Fixes

* Force release, with the included built files ([e400736](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/e40073607870a06fe7155ae147f420a37be1aaca))

## [1.19.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.19.0...v1.19.1) (2021-08-07)


### Bug Fixes

* Force re-release of npm package ([a19c417](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a19c417c5980434c8c8fcc4b56dc9ddcd2cb9fc9))

# [1.19.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.18.0...v1.19.0) (2021-08-07)


### Features

* Enable publishing to npm, and include the build folder in the published result ([4bd687e](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/4bd687ee7ca8e065ba87a4eabd33f2d6ed9c87ef))
* Reduce the number of imported entities into ThingWorx to only one Thing, no datashapes ([a7da156](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a7da156b2cccd1eb4e2ffc2bf854ef9100f4b4fa))
* Support loading the new composer bundle from cross-origin sources by setting the webpack public path to auto ([e8242b1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/e8242b10b5caf12300db15c5f17203b7bdff5bc0))

# [1.18.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.17.0...v1.18.0) (2021-07-09)


### Bug Fixes

* **types:** Services with no parameters should be callable without providing an empty object. ([0ca5574](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/0ca557408001ca8980efcbd7d48eab98d2dbb654))
* **types:** Services with no required inputs can be called without providing any object as parameter ([592a5aa](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/592a5aad3720a7fed914dd5b0b9407a14dd05655))
* Remove all deprecated code for supporting the old composer ([a2d4c26](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a2d4c26665168fb4415fa8f0fe6430ea41247ad4))


### Features

* **types:** Generate GenericThing template definition on startup, rather than bundling it in. Fix issue where GenericThing services would appear on templates, shapes or other entity types ([a36d0ce](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/a36d0ceebe3887aabc89862ca901345a96e884ce))
* **types:** Improve types of the `rows` property of infotables. ([cdc76f1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/cdc76f138dc25079a785717b60fbefa61999b89a))

# [1.17.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.16.0...v1.17.0) (2021-06-25)


### Bug Fixes

* Fix widget loading on TWX 9 ([8ddae49](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/8ddae49979a9f0fc473add00bb815ddc6f528e74))
* Resolve issue dispalying json widget property editors. Fix [#24](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/24) ([08d395d](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/08d395dbdf4e0c497a1370d1bca2f1c83318ed78))


### Features

* Adopt external webpack config and update to webpack 5.0 from https://github.com/ptc-iot-sharing/ThingworxDemoWebpackWidget ([76b5395](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/76b5395e8ea40c40ddfbca6e984c773137486cf9))
* Update to upstream monaco-editor v0.25.x ([6edd661](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/6edd6615b72937f36daf571d0b4d06e66260093c))

# [1.16.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.15.1...v1.16.0) (2020-09-26)


### Features

* Adopt the latest monaco 0.21.1. Fixes [#7](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/7). Take a look at https://github.com/microsoft/monaco-editor/blob/master/CHANGELOG.md[#0211](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/0211)-24092020 for more details ([0d4481a](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/0d4481a71c8a97c2ffff6fccf0ad0f9eb235e1b7)), closes [/github.com/microsoft/monaco-editor/blob/master/CHANGELOG.md#0211-24092020](https://github.com//github.com/microsoft/monaco-editor/blob/master/CHANGELOG.md/issues/0211-24092020)

## [1.15.1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.15.0...v1.15.1) (2020-09-05)


### Bug Fixes

* **compatibility:** Resolve compatiblity issues with Thingworx 9. Fix [#12](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/12). Updated deps ([6fdd873](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/6fdd873ce309857fea398f7c9e9a9346637a7d30))

# [1.15.0](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.14.4...v1.15.0) (2020-04-05)


### Features

* Save view state and restore on load ([ae7c8f1](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/ae7c8f10388d7992979627d6680256e21cba6426)), closes [#8](https://github.com/ptc-iot-sharing/MonacoEditorTWX/issues/8)

## [1.14.4](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.14.3...v1.14.4) (2020-04-01)


### Bug Fixes

* Editor being very small in new composer. ([2790345](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/2790345ac895dd0a4d93a1822225e326de7a2942))
* **docs:** added publishing info ([77f4ff2](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/77f4ff259c23a8eb1e94700ddcfa4189be172754))

## [1.14.3](https://github.com/ptc-iot-sharing/MonacoEditorTWX/compare/v1.14.2...v1.14.3) (2020-03-20)


### Bug Fixes

* **ci:** Added semantic-release ([1089083](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/10890830f26c74d38629161d826380cb0f15eed6))
* **ci:** Use yarn ([e01f3c5](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/e01f3c534a90463b4f6997abc591f8c46fc729c3))
* **ci:** Use yarn install ([6bb2fa7](https://github.com/ptc-iot-sharing/MonacoEditorTWX/commit/6bb2fa751ad44e4edee18b3481e9862e577345e6))
