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
