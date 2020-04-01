declare const ThingworxInvoker: any;
async function initializeMonaco() {
    // this will also add monaco on the window object
    const constants = await import("./constants");
    const { DEFAULT_EDITOR_SETTINGS, Languages, MONACO_EDITOR_SETTINGS_KEY } = constants;
    const ServiceEditor = await (await import("./editors/serviceEditor/serviceEditor")).ServiceEditor;
    const TypescriptCodeEditor = await (await import("./editors/typescript/typescriptCodeEditor")).TypescriptCodeEditor;
    // load the editor in the old composer
    if (TW && TW.jqPlugins && TW.jqPlugins.twCodeEditor) {
        // automatically import the css file
        require('./styles/oldComposerMonacoEditor.css');
        require("./typescriptCodeSupport");
        /**
         * Called when the extension is asked to insert a code snippet via the snippets.
         * We make sure that we also have an undo stack here
         * @param  {string} code code to be inserted into the editor
         */
        TW.jqPlugins.twCodeEditor.prototype.insertCode = function (code) {
            this.monacoEditor.insertText(code);
        };
    
        /**
         * Build the html for the code editor. Called by other thingworx widgets.
         * Only returns a div where the monaco editor goes
         */
        TW.jqPlugins.twCodeEditor.prototype._plugin_afterSetProperties = function () {
            // if the user clicks on cancel edit on the parent entity, we don't get back any event.
            // force it by listening for mutation events
            let observer = new MutationObserver((mutations) => {
                // check for removed target
                mutations.forEach((mutation) => {
                    if (!this.jqElement) return;
                    let nodes = Array.from(mutation.removedNodes);
                    let directMatch = nodes.indexOf(this.jqElement[0]) > -1
                    let parentMatch = nodes.some(parent => parent.contains(this.jqElement[0]));
                    // check if the element still exists in the DOM because it might just be reattached somewhere else
                    // this happens when we expand/collapse the code editor
                    let reatacched = document.getElementById(this.jqElement[0].id);
                    if (reatacched == null) {
                        if (directMatch) {
                            this._plugin_cleanup();
                            observer.disconnect();
                        } else if (parentMatch) {
                            this._plugin_cleanup();
                            observer.disconnect();
                        }
                    }
    
                });
            });
    
            observer.observe(document.body, {
                subtree: true,
                childList: true
            });
    
            this._plugin_cleanup();
            this.jqElement.html(
                "<div class=\"editor-container\" >" +
                "</div>"
            );
        };
    
        TW.jqPlugins.twCodeEditor.prototype.convertHandlerToMonacoLanguage = function (language: string): string {
            let mapping = {
                "SQLCommand": 'sql',
                'SQLQuery': 'sql',
                'TypeScript': Languages.TwxTypescript,
                'Script': Languages.TwxJavascript,
                'Python': 'python',
                'R': 'r'
            }
            return mapping[language];
        }
        /**
         * Properly dispose the editor when needed. This is called by the thingworx editor when the editor closes or opens
         */
        TW.jqPlugins.twCodeEditor.prototype._plugin_cleanup = function () {
            try {
                if (this.monacoEditor !== undefined) {
                    window.removeEventListener("resize", this.updateContainerSize.bind(this));
                    this.monacoEditor.dispose();
                }
            } catch (err) {
                TW.log.error("Monaco: Failed to destroy the monaco editor", err);
            }
            this.monacoEditor = undefined;
            this.jqElement.off(".twCodeEditor");
        };
    
        /**
         * Called when move from fullscreen or to fullscreen.
         * @param {int} height The height of the editor.
         */
        TW.jqPlugins.twCodeEditor.prototype.setHeight = function (height) {
            const container = this.jqElement.find(".editor-container");
            container.height(height);
            this.updateContainerSize();
        };
    
        /**
         * Overridden method from the twServiceEditor. We do this because in our version, the footer has absolute positioning.
         * Because of this, it does not need to be taken into consideration when calculating sizes for the editor
         * Also, we must increase the size of the targetBodyHt from 360 to 580
         */
        TW.jqPlugins.twServiceEditor.prototype.resize = function (includeCodeEditor) {
            var thisPlugin = this;
            var serviceDefinitionBody;
            var detailsEl;
            var targetBodyHt = 580;
    
            if (thisPlugin.properties.isFullScreen) {
                detailsEl = thisPlugin.detachedExpandCollapseContent;
                var fullscreenContainer = thisPlugin.detachedExpandCollapseContent.closest(".full-tab-div");
                var fullscreenTitle = fullscreenContainer.find(".popover-title");
                if (fullscreenContainer.length > 0) {
                    targetBodyHt = (fullscreenContainer.innerHeight() - fullscreenTitle.outerHeight() - 10);
                }
                if (thisPlugin.properties.readOnly) {
                    targetBodyHt = (fullscreenContainer.innerHeight() - fullscreenTitle.outerHeight() - 10);
                }
            } else {
                detailsEl = thisPlugin.detailsElem;
            }
            serviceDefinitionBody = detailsEl.find(".inline-body");
            serviceDefinitionBody.height(targetBodyHt);
            serviceDefinitionBody.css({ overflow: "visible" });
    
            var serviceTabContent = detailsEl.find(".script-editor-tab-content");
            var inlineServiceTabHeight = detailsEl.find(".io-code-tabs");
    
            serviceTabContent.outerHeight(targetBodyHt - inlineServiceTabHeight.outerHeight());
    
            var navTabsHt;
            var navTabs = detailsEl.find(".nav-tabs");
            if (navTabs.length > 0) {
                navTabsHt = navTabs.outerHeight(true);
            }
            var bodyHt = serviceDefinitionBody.innerHeight();
            if (includeCodeEditor) {
                thisPlugin.scriptCodeElem.twCodeEditor("setHeight", bodyHt - serviceDefinitionBody.find(".script-editor-header").outerHeight() - 10);
            }
        };
    
        /**
         * Makes the monaco editor layout again, filling all the space
         */
        TW.jqPlugins.twCodeEditor.prototype.updateContainerSize = function () {
            if (this.monacoEditor) {
                this.monacoEditor.containerWasResized();
            }
        };
    
        TW.jqPlugins.twCodeEditor.prototype.updateLanguage = function (language: string, code: string) {
            this.properties.handler = language;
    
            if (this.monacoEditor) {
                const mode = this.convertHandlerToMonacoLanguage(language);
                this.monacoEditor.changeLanguage(mode, code);
                if (this.monacoEditor instanceof TypescriptCodeEditor && mode == Languages.TwxTypescript) {
                    this.monacoEditor.onEditorTranspileFinished((code) => {
                        this.properties.javascriptCode = code;
                    });
                }
            }
        }
    
        /**
         * Scrolls code to a certain location. This is not really used, but we implement it anyhow
         */
        TW.jqPlugins.twCodeEditor.prototype.scrollCodeTo = function (x, y) {
            if (this.monacoEditor) {
                this.monacoEditor.scrollCodeTo(x, y);
            }
        };
    
        /**
         * Checks the syntax of the underlying code using a server based method
         */
        TW.jqPlugins.twCodeEditor.prototype.checkSyntax = function (showSuccess, callback, btnForPopover) {
            var thisPlugin = this;
            var jqEl = thisPlugin.jqElement;
            var btn = jqEl.find("button[cmd=\"syntax-check\"]");
            if (btnForPopover !== undefined) {
                btn = btnForPopover;
            }
            var invoker = new ThingworxInvoker({
                entityType: "Resources",
                entityName: "ScriptServices",
                characteristic: "Services",
                target: "CheckScriptWithLinesAndColumns",
                apiMethod: "post",
                parameters: {
                    script: thisPlugin.properties.handler === "TypeScript" ? thisPlugin.properties.javascriptCode : thisPlugin.properties.code
                }
            });
    
            invoker.invokeService(
                function (invoker) {
                    var resultInfo = invoker.result.rows[0];
                    if (resultInfo.status === true) {
                        if (showSuccess) {
                            TW.IDE.twPopoverNotification("info", btn, TW.IDE.I18NController.translate("tw.code-editor.editor.syntax-check-passed"));
                        }
                        if (callback !== undefined) {
                            callback(true);
                        }
                    } else {
                        // 	"missing ( before condition at line 6 column 2 source: [if]"
                        TW.IDE.twPopoverNotification("warning", btn, TW.IDE.I18NController.translate("tw.code-editor.editor.syntax-check-failed", { syntaxCheckFail: resultInfo.message }));
                        thisPlugin.monacoEditor.scrollCodeTo(resultInfo.lineNumber, resultInfo.columnNumber);
                        thisPlugin.monacoEditor.focus();
                        if (callback !== undefined) {
                            callback(false);
                        }
    
                    }
                },
                function (invoker, xhr) {
                    TW.IDE.twPopoverNotification("error", btn, TW.IDE.I18NController.translate("tw.code-editor.editor.syntax-evaluation-error", { syntaxEvalError1: xhr.status, syntaxEvalError2: xhr.responseText }));
                    TW.log.error("Monaco: CheckScript failed unexpectedly status:" + xhr.status + ", message: " + xhr.responseText);
                    if (callback !== undefined) {
                        callback(false);
                    }
                }
            );
        };
    
        /**
         * Initializes a new code mirror. This takes care of the condition that 
         * we must create the monaco editor only once.
         */
        TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
            var thisPlugin = this;
            var jqEl = thisPlugin.jqElement;
            var codeTextareaElem = jqEl.find(".editor-container");
    
            // make sure that the key events stay inside the editor.
            codeTextareaElem.on("keydown.twCodeEditor keypress.twCodeEditor keyup.twCodeEditor", function (e) {
                e.stopPropagation();
            });
            // make sure the textArea will strech, but have a minimum height
            codeTextareaElem.height("100%");
            codeTextareaElem.css("min-height", (thisPlugin.height || 540) + "px");
            if (codeTextareaElem.find(".monaco-editor").length > 0 && thisPlugin.monacoEditor !== undefined) {
                // already done, don't init the editor again
                return;
            }
            // handle the different modes. For sql, we also need to hide the syntax check button
            var mode = thisPlugin.convertHandlerToMonacoLanguage(thisPlugin.properties.handler);
    
            // begin to init the editor
    
            // get the service model from the parent twService editor
            var parentServiceEditorJqEl = jqEl.closest("tr").prev();
            if (!parentServiceEditorJqEl) {
                return;
            }
            var parentPluginType = parentServiceEditorJqEl.attr("tw-jqPlugin");
            // if the parent service editor is not available then don't go further
            if (!parentServiceEditorJqEl[parentPluginType]) {
                return;
            }
            var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
            // there are cases where showCodeProperly is called, but no properties are yet set.
            // there are cases where the parent twServiceEditor doesn't have a model set
            // just exit in those cases
            if (!thisPlugin.properties || !serviceModel || !serviceModel.model) {
                return;
            }
            // the code comes from the plugin properties
            let codeValue = thisPlugin.properties.code;
            let editorSettings;
            try {
                editorSettings = JSON.parse(TW.IDE.synchronouslyLoadPreferenceData(MONACO_EDITOR_SETTINGS_KEY));
            } catch (e) {
                TW.log.warn("Monaco: Failed to load settings from preferences. Using defaults...", e);
                editorSettings = DEFAULT_EDITOR_SETTINGS;
            }
    
            let modelName = `${serviceModel.model.entityType}/${serviceModel.model.id}/${serviceModel.isNew ? Math.random().toString(36).substring(7) : serviceModel.serviceDefinition.name}`;
    
            var editor;
            // if we already have an editor (mostly because showCode properly is called too often by twx), then update it
            if (thisPlugin.monacoEditor) {
                editor = thisPlugin.monacoEditor;
            } else {
                let editorClass;
                if (mode == Languages.TwxTypescript || mode == Languages.TwxJavascript) {
                    editorClass = TypescriptCodeEditor;
                } else {
                    editorClass = ServiceEditor;
                }
                // else create a new one
                editor = new editorClass(codeTextareaElem[0], editorSettings, {
                    onSave: () => {
                        // fake a click on the saveEntity button
                        // this is hacky... there is no other way of executing the saveService on the twServiceEditor
                        // if the service is new, click the done button instead
                        if (serviceModel.isNew) {
                            var doneButton = findEditorButton(".done-btn");
                            doneButton.click();
                        } else {
                            var saveEntityButton = findEditorButton(".save-entity-btn");
                            saveEntityButton.click();
                        }
                    },
                    onClose: () => {
                        var cancelButton = findEditorButton(".cancel-btn");
                        cancelButton.click();
                    },
                    onDone: () => {
                        // fake a click on the done button
                        // this is hacky... there is no other way of executing the saveService on the twServiceEditor
                        var doneButton = findEditorButton(".done-btn");
                        doneButton.click();
                    },
                    onPreferencesChanged: (preferences) => {
                        TW.IDE.savePreferenceData(MONACO_EDITOR_SETTINGS_KEY, JSON.stringify(preferences));
                    },
                    onTest: () => {
                        if (serviceModel.isNew) {
                            alert("This service has not been saved yet. Please save and then test.");
                        } else {
                            serviceModel.testService();
                            // if we have no input parameters, just focus the execute button
                            if ($.isEmptyObject(serviceModel.serviceDefinition.parameterDefinitions)) {
                                var executeButton = TW.IDE.CurrentTab.contentView.find(".twPopoverDialog").find(".execute-btn");
                                // hacky here, but a service should never have more than 20 inputs
                                executeButton.attr({
                                    "role": "button",
                                    "tabindex": "20"
                                });
                                executeButton.keydown(function (e) {
                                    var code = e.which;
                                    // 13 = Return, 32 = Space
                                    if ((code === 13) || (code === 32)) {
                                        $(this).click();
                                    }
                                });
                                executeButton.focus();
                            } else {
                                // focus the first input in the popup that opens
                                TW.IDE.CurrentTab.contentView.find(".twPopoverDialog").find(".std-input-container").find("input").first().focus();
                            }
                        }
                    }
                },
                    {
                        code: codeValue,
                        language: mode,
                        modelName: modelName,
                        readonly: !thisPlugin.properties.editMode
                    });
            }
    
            // make the editor layout again on window resize
            window.addEventListener("resize", thisPlugin.updateContainerSize.bind(thisPlugin));
    
    
            // whenever the model changes, we need to also push the changes up to the other plugins
            editor.onEditorContentChange((code) => {
                thisPlugin.properties.code = code;
                thisPlugin.properties.change(thisPlugin.properties.code);
            });
    
    
    
            if (editor instanceof TypescriptCodeEditor) {
                const typescriptCodeEditor = editor;
                const serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
                typescriptCodeEditor.refreshMeDefinitions({
                    id: serviceModel.model.id,
                    entityType: serviceModel.model.entityType,
                    effectiveShape: serviceModel.model.attributes.effectiveShape,
                    propertyData: serviceModel.model.propertyData,
                    serviceDefinition: serviceModel.serviceDefinition
                });
                editor.onEditorFocused(() => {
                    const serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
                    typescriptCodeEditor.refreshMeDefinitions({
                        id: serviceModel.model.id,
                        entityType: serviceModel.model.entityType,
                        effectiveShape: serviceModel.model.attributes.effectiveShape,
                        propertyData: serviceModel.model.propertyData,
                        serviceDefinition: serviceModel.serviceDefinition
                    });
                    TypescriptCodeEditor.codeTranslator.generateDataShapeCode();
                });
    
                if (mode == Languages.TwxTypescript) {
                    typescriptCodeEditor.onEditorTranspileFinished((code) => {
                        thisPlugin.properties.javascriptCode = code;
                    });
                }
            }
    
            thisPlugin.monacoEditor = editor;
    
            /**
             * Returns a button on the button toolbar with a certain name.
             * If the button is not found, it returns null
             */
            function findEditorButton(buttonName) {
                // find the visible button
                var button = thisPlugin.jqElement.closest("tr").find(buttonName + ":visible");
                // we must be in fullscreen, try to find the button elsewhere
                if (button.length === 0) {
                    button = thisPlugin.jqElement.closest(".inline-body").next().find(buttonName + ":visible");
                }
                return button;
            }
    
        };
    }
};
initializeMonaco();
