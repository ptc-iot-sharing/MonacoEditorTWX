TW.jqPlugins.twServiceEditor.prototype._plugin_afterSetProperties = function () {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    jqEl.addClass("twServiceEditor tw-jqPlugin todos-source");
    jqEl.attr("tw-jqPlugin", "twServiceEditor");

    var isNew = thisPlugin.properties.isNew;
    var newInputParameters = {};
    if (thisPlugin.properties.serviceDefinition !== undefined && thisPlugin.properties.serviceDefinition.parameterDefinitions !== undefined) {
        newInputParameters = thisPlugin.properties.serviceDefinition.parameterDefinitions;
    }
    var newId = TW.uniqueId();
    var editMode = thisPlugin.properties.editMode;
    var isMyProps = thisPlugin.properties.isMyProps;
    var isEditingServiceOverride = thisPlugin.properties.isEditingServiceOverride;
    var type = thisPlugin.properties.type;
    var model = thisPlugin.properties.model;
    var isThingTemplate = thisPlugin.properties.isThingTemplate === true;
    var isThingShape = thisPlugin.properties.isThingShape === true;
    var maxRows = 500;
    var svcTimeout = 60;
    var isAsync = false;
    var isAllowOverride = false;
    var timeoutInterval = 30;
    var enableQueue = false;
    var useDefaultTimeoutInterval = true;

    thisPlugin.properties.readOnly = true;

    var thisProp = thisPlugin.properties.serviceDefinition;
    var thisPropOriginal = JSON.parse(JSON.stringify(thisProp));
    var thisSvcImplOriginal = undefined;
    if (implOfThisSvc !== undefined) {
        thisSvcImplOriginal = JSON.parse(JSON.stringify(implOfThisSvc));
    }

    if (thisProp.aspects !== undefined && thisProp.aspects["isAsync"] === true) {
        isAsync = true;
    }

    if (thisProp.isAllowOverride === true) {
        isAllowOverride = true;
    }
    var idNew = "newTr" + TW.uniqueId();
    jqEl.after(
        // pjhtodo - need to know starting # cols for Property or Field editing
        "<tr class=\"\" id=\"" + idNew + "\">" +
        "</tr>"
    );

    thisPlugin.jqSecondElement = $("#" + idNew);
    var jqSecondEl = thisPlugin.jqSecondElement;

    var handlerName = "Script";
    if (!editMode) {
        handlerName = "";
    }
    if (isNew && thisPlugin.properties.isRemoteServiceManual) {
        svcTimeout = 0;
    }
    var serviceBindings = model.get("remoteServiceBindings");
    var thisSvcBinding = undefined;
    if (serviceBindings !== undefined) {
        thisSvcBinding = serviceBindings[thisProp.name];
    }
    if (thisSvcBinding !== undefined) {
        handlerName = "Remote";
        enableQueue = thisSvcBinding["enableQueue"];
        if (thisSvcBinding["timeout"] === 0) {
            useDefaultTimeoutInterval = true;
            svcTimeout = 0;
        } else {
            useDefaultTimeoutInterval = false;
            svcTimeout = thisSvcBinding["timeout"];
        }
    }

    jqEl.addClass("displaying-service");

    var scriptObjects = [];
    var scriptHtml = "";
    var implOfThisSvc = thisPlugin.properties.serviceImplementation;
    if (implOfThisSvc !== undefined) {
        handlerName = implOfThisSvc.handlerName;
        if (handlerName === "Script") {
            var scriptInfo = implOfThisSvc.configurationTables.Script;
            if (scriptInfo !== undefined) {
                if (scriptInfo.rows !== undefined && scriptInfo.rows.length > 0) {
                    var id = TW.uniqueId();
                    scriptHtml = "<div class=\"actual-script-code padded-container-white\" id=\"" + id + "\"></div>";
                    scriptObjects.push({
                        id: id,
                        code: scriptInfo.rows[0].code,
                        handler: handlerName,
                        handlers: (isThingShape ? [] : (thisPlugin.properties.model.thingPackageInfo === undefined ? [] : thisPlugin.properties.model.thingPackageInfo.handlerDefinitions)),
                        //configurationTables: implOfThisSvc.configurationTables,
                        name: implOfThisSvc.name
                    });
                }
            }
        } else if (handlerName === "SQLCommand" || handlerName === "SQLQuery") {
            var queryInfo = implOfThisSvc.configurationTables.Query;
            maxRows = 500;
            svcTimeout = 60;
            if (queryInfo !== undefined) {
                if (queryInfo.rows !== undefined && queryInfo.rows.length > 0) {
                    var id = TW.uniqueId();
                    maxRows = queryInfo.rows[0].maxItems;
                    svcTimeout = queryInfo.rows[0].timeout;
                    if (svcTimeout === undefined) {
                        svcTimeout = 60;
                    }
                    scriptHtml = "<div class=\"actual-script-code padded-container-white\" id=\"" + id + "\"></div>";
                    scriptObjects.push({
                        id: id,
                        code: queryInfo.rows[0].sql,
                        handler: handlerName,
                        handlers: (isThingShape ? [] : (thisPlugin.properties.model.thingPackageInfo === undefined ? [] : thisPlugin.properties.model.thingPackageInfo.handlerDefinitions)),
                        //configurationTables: implOfThisSvc.configurationTables,
                        name: implOfThisSvc.name
                    });
                }
            }
        }
    } else {
        // no implementation yet
        var id = TW.uniqueId();
        scriptHtml = "<div class=\"actual-script-code padded-container-white\" id=\"" + id + "\"></div>";
        scriptObjects.push({
            id: id,
            code: undefined,
            handler: (isThingShape ? "Script" : undefined),
            handlers: (isThingShape ? [] : (thisPlugin.properties.model.thingPackageInfo === undefined ? [] : thisPlugin.properties.model.thingPackageInfo.handlerDefinitions)),
            //configurationTables: implOfThisSvc.configurationTables,
            name: thisPlugin.properties.serviceDefinition.name
        });
    }

    var implHtml = "";
    var htmlSecondEl = "";
    var parameterDefsId = TW.uniqueId();
    var buildNameToShow = function () {
        var nameToShow = "";
        if (isNew) {
            nameToShow = "New Service";
        } else {
            nameToShow = thisPlugin.properties.serviceDefinition.name;
        }
        return nameToShow;
    };

    var channelName = "";
    if (model.isRemotable) {
        channelName = model.getDefaultChannel();
    }

    var nameToShow = buildNameToShow();
    implHtml =
        "<div class=\"expand-collapse-container\"><div id=\"inline-editor\">" +
        "<div class=\"popover-property bottom\">" +
        "<div class=\"popover-title clearfix\">" +
        "<ul>" +
        "<li class=\"pull-left\"><h4 class=\"service-definition-name\">" + nameToShow + "</h4></li>" +
        "<li class=\"service-component-handler pull-left\"></li>" +
        "<li class=\"pull-right\">" +
        "<button class=\"btn btn-inverse btn-small expand-script\"><i class=\"twicon-fullscreen\"></i> Fullscreen</button>" +
        "<span class=\"test-query2 btn btn-small\">Test</span>" +
        "<button class=\"btn btn-inverse btn-small collapse-script\" style=\"display:none;\"><i class=\"twicon-exitfullscreen\"></i> Exit Fullscreen</button>" +
        "</li>" +
        "</ul>" +
        "</div>" +
        "<div class=\"inline-body\">" +
        "<div class=\"col1\">" +
        "<ul class=\"nav nav-tabs io-code-tabs\">" +
        "<li class=\"service-info\" tab=\"service-info\">Service Info</li>" +
        "<li class=\"io-tab active\" tab=\"inputs-outputs\">Inputs/Outputs</li>" +
        "<li tab=\"code-snippets\">Snippets</li>" +
        "<li tab=\"me\">Me</li>" +
        "<li tab=\"other-entities\">Entities</li>" +
        "<li tab=\"tables-columns\">Tables/Columns</li>" +
        "</ul>" +
        "<div class=\"script-editor-tab-content tab-content\">" +
        "<div class=\"script-editor-tab\" tab=\"service-info\">" +
        "<div class=\"property-section-group\">" +
        "<div class=\"property-wrapper service-component-name filterable-text\">" + XSS.encodeHTML(thisProp.name) + "</div>" +
        "<div class=\"property-wrapper service-component-description\">" + XSS.encodeHTML(thisProp.description) + "</div>" +
        "<div class=\"property-wrapper service-component-category\">" + XSS.encodeHTML(thisProp.category) + "</div>" +
        "<div class=\"property-wrapper service-component-max-rows\" style=\"display:none;\"></div>" +
        "<div class=\"property-wrapper service-component-channel\" style=\"display:none;\"></div>" +
        "<div class=\"property-wrapper service-component-remote-service-name\" style=\"display:none;\"></div>" +
        "<div class=\"property-wrapper service-component-is-allow-override\"></div>" +
        "<div class=\"property-wrapper service-component-is-async\"></div>" +
        "<div class=\"property-wrapper service-component-remote-service-enable-queue\" style=\"display:none;\"></div>" +
        "<div class=\"property-wrapper service-component-remote-service-default-timeout\" style=\"display:none;\"></div>" +
        "<div class=\"property-wrapper service-component-remote-service-timeout-interval\" style=\"display:none;\"></div>" +
        "</div>" +
        "</div>" +
        "<div class=\"script-editor-tab\" tab=\"inputs-outputs\">" +
        "<div class=\"service-definition-description-inputs\" input-id=\"" + parameterDefsId + "\">" +
        "<div class=\"well-white input-field-definitions\" focus-item=\"1\" tw-jqplugin=\"twParameterDefinitionsView\">" +
        "</div>" +
        "</div>" +
        "<div class=\"well-white service-definition-description-outputs\">" +
        //outputsHtml +
        "</div>" +

        "</div>" +
        "<div class=\"script-editor-tab\" tab=\"code-snippets\">" +
        "<div class=\"code-snippets\" focus-item=\"1\" tw-jqplugin=\"twCodeSnippets\">" +
        "</div>" +
        "</div>" +
        "<div class=\"script-editor-tab\" tab=\"me\">" +
        "<div class=\"entity-snippet-helper-me\" focus-item=\"1\" tw-jqplugin=\"twEntitySnippetHelper\">" +
        "</div>" +
        "</div>" +
        "<div class=\"script-editor-tab\" tab=\"other-entities\">" +
        "<div class=\"entity-snippet-helper\" focus-item=\"1\" tw-jqplugin=\"twEntitySnippetHelper\">" +
        "</div>" +
        "</div>" +
        "<div class=\"script-editor-tab\" tab=\"tables-columns\">" +
        "<div class=\"tables-columns-helper\" focus-item=\"1\" tw-jqplugin=\"twTablesColumnsHelper\">" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "<div class=\"col2\">" +
        "<div class=\"service-definition-description-script\" " + (handlerName === "Reflection" ? " " : "") + ">" +
        "<div class=\"script-editor-header\">" +
        "<span class=\"title\">Script</span>" +
        "<span class=\"test-query btn btn-small\" style=\"display:none;\">Test</span>" +
        //                                                '<div class="pull-right">' +
        //                                                    '<span class="service-component-handler"></span>' +
        //                                                '</div>' +
        "</div>" +
        scriptHtml +
        "</div>" +
        "</div>" +
        "</div>" +
        (editMode && (isMyProps || isEditingServiceOverride) ? "<div class=\"inline-footer\"><span class=\"std-tooltip service-done-cancel\" style=\"display:none;\" /><button class=\"cancel-btn btn\" style=\"display:none;\">Cancel</button><button class=\"done-btn btn btn-info\" style=\"display:none;\">Done</button><span class=\"std-tooltip service-save\" style=\"display:none;\" /><button class=\"save-entity-btn btn btn-primary\" style=\"display:none;\">Save Entity</button></div>" : "") +
        "</div>" +
        "</div></div>";

    if (editMode && (isMyProps || isEditingServiceOverride)) {
        if (thisPlugin.properties.isThingTemplate || thisPlugin.properties.isThingShape || isEditingServiceOverride) {
            htmlSecondEl = "<td class=\"service-script-column service-script\" colspan=\"6\">" + implHtml + "</span>";
        } else {
            htmlSecondEl = "<td class=\"service-script-column service-script\" colspan=\"7\">" + implHtml + "</span>";
        }
    } else {
        htmlSecondEl =
            "<td class=\"service-script\" colspan=\"6\">" + implHtml + "</td>";
    }

    jqSecondEl.html(htmlSecondEl);

    var cancelSecondBtn = jqSecondEl.find(".cancel-btn");
    var doneSecondBtn = jqSecondEl.find(".done-btn");
    var saveEntitySecondBtn = jqSecondEl.find(".save-entity-btn");
    var expandBtn = jqSecondEl.find(".expand-script");
    var codeSnippetsEl = jqSecondEl.find(".code-snippets");
    var codeEl = jqSecondEl.find(".service-definition-description-script");
    var entitySnippetHelperEl = jqSecondEl.find(".entity-snippet-helper");
    var tablesColumnsHelperEl = jqSecondEl.find(".tables-columns-helper");
    var entitySnippetHelperMeEl = jqSecondEl.find(".entity-snippet-helper-me");
    var collapseBtn = jqSecondEl.find(".collapse-script");
    var extraTestBtn = jqSecondEl.find(".test-query2");
    var editBtn = jqEl.find(".edit-service");
    var editOverrideBtn = jqEl.find(".edit-service-override");
    var clearOverrideBtn = jqEl.find(".edit-clear-override");
    var fullscreenEditBtn = jqSecondEl.find(".edit-service");
    var doneCancelTooltip = jqSecondEl.find(".std-tooltip.service-done-cancel");
    var inputFieldDefinitionEl = jqSecondEl.find(".input-field-definitions");
    thisPlugin.inputFieldDefinitionEl = inputFieldDefinitionEl;
    var outputFieldDefinitionEl = jqSecondEl.find(".service-definition-description-outputs");
    thisPlugin.outputFieldDefinitionEl = outputFieldDefinitionEl;
    var ioSnippetTabsEl = jqSecondEl.find(".io-code-tabs");
    var ioSnippetTabs_SvcInfoTab = ioSnippetTabsEl.find("li[tab=\"service-info\"]");
    var ioSnippetTabs_IOTab = ioSnippetTabsEl.find("li[tab=\"inputs-outputs\"]");
    var ioSnippetTabs_TablesTab = ioSnippetTabsEl.find("li[tab=\"tables-columns\"]");
    var ioSnippetTabs_CodeSnippetsTab = ioSnippetTabsEl.find("li[tab=\"code-snippets\"]");
    var ioSnippetTabs_MeTab = ioSnippetTabsEl.find("li[tab=\"me\"]");
    var ioSnippetTabs_OtherEntitiesTab = ioSnippetTabsEl.find("li[tab=\"other-entities\"]");
    var ioSnippetTabContainerEl = jqSecondEl.find(".script-editor-tab-content");
    var nameEl = jqSecondEl.find(".service-component-name");
    var descriptionEl = jqSecondEl.find(".service-component-description");
    //			var tagsEl = jqSecondEl.find('.service-component-tags');
    var categoryEl = jqSecondEl.find(".service-component-category");
    var channelEl = jqSecondEl.find(".service-component-channel");
    var maxItemsEl = jqSecondEl.find(".service-component-max-rows");
    var isAsyncEl = jqSecondEl.find(".service-component-is-async");
    var isAllowOverrideEl = jqSecondEl.find(".service-component-is-allow-override");
    //			var remoteThingEl = jqSecondEl.find('.service-component-remote-thing');
    var remoteServiceNameEl = jqSecondEl.find(".service-component-remote-service-name");
    var useDefaultTimeoutIntervalEl = jqSecondEl.find(".service-component-remote-service-default-timeout");
    var svcTimeoutIntervalEl = jqSecondEl.find(".service-component-remote-service-timeout-interval");
    var svcEnableQueueEl = jqSecondEl.find(".service-component-remote-service-enable-queue");
    var handlerSecondEl = jqSecondEl.find(".service-component-handler");
    var testQueryBtn = jqEl.find(".test-query");
    var scriptEditorcol1El = jqSecondEl.find(".col1");
    var scriptEditorcol2El = jqSecondEl.find(".col2");

    var newCategory = undefined;
    var newTags = undefined;
    var newResultType = undefined;
    var currentName = thisProp.name;
    var showChannel = false;

    if (handlerName === "SQLQuery") {
        maxItemsEl.show();
        maxItemsEl.twStdTextBox("updateValue", maxRows);
        svcTimeoutIntervalEl.show();
        svcTimeoutIntervalEl.twStdTextBox("updateValue", svcTimeout);
        useDefaultTimeoutIntervalEl.hide();
    } else if (handlerName === "SQLCommand") {
        maxItemsEl.hide();
        svcTimeoutIntervalEl.show();
        svcTimeoutIntervalEl.twStdTextBox("updateValue", svcTimeout);
        useDefaultTimeoutIntervalEl.hide();
    } else {
        maxItemsEl.hide();
        svcTimeoutIntervalEl.hide();
        if (handlerName === "Remote") {
            useDefaultTimeoutIntervalEl.show();
        } else {
            useDefaultTimeoutIntervalEl.hide();
        }
    }

    doneCancelTooltip.twStdTooltip({
        tooltipId: "service-done-cancel"
    });

    thisPlugin.properties.isFullScreen = false;
    thisPlugin.scriptCodeElem = jqSecondEl.find(".actual-script-code");

    var updateHandlerSelection = function (newHandlerName) {
        var handlerChanged = false;
        if (handlerName !== newHandlerName) {
            handlerChanged = true;
        }
        handlerName = newHandlerName;
        switch (handlerName) {
            case "Script":
                maxItemsEl.hide();
                break;
            case "Remote":
                maxItemsEl.hide();
                if (handlerChanged) {
                    svcTimeout = 0;
                }
                break;
            case "SQLQuery":
                outputFieldDefinitionEl.twOutputDefinition("updateBaseType", "INFOTABLE");
                if (handlerChanged) {
                    svcTimeout = 60;
                }
                maxItemsEl.show();
                break;
            case "SQLCommand":
                outputFieldDefinitionEl.twOutputDefinition("updateBaseType", "NUMBER");
                if (handlerChanged) {
                    svcTimeout = 60;
                }
                maxItemsEl.hide();
                break;
            default:
                TW.log.error("unknown handlerName in updateHandlerSection: \"" + newHandlerName + "\"");
        }
        updateCodeEditor(false/*isReadOnly*/);
        updateCodeEditingSpace(false/*isReadOnly*/);
    };

    var updateServiceDetails = function (isReadOnly) {
        if (isReadOnly) {
            // read-only

            // right now we only do something for services - for events, the info is already filled in
            nameEl.html("<div class=\"service-name-holder\"><span title=\"" + thisProp.name + "\">" + (thisProp.name === "" ? "New Service" : "" + thisProp.name + "") + "</span></div>");
            descriptionEl.text(thisProp.description);
            //					tagsEl.text(TW.buildTagDescriptionWithSemicolonsFromTags(thisProp.tags));
            categoryEl.text(thisProp.category);
            if (handlerName == "") {
            } else {
                handlerSecondEl.html("<span class=\"label label-inverse\">" + XSS.encodeHTML(handlerName) + "</span>");
                if (handlerName === "SQLQuery") {
                    try {
                        handlerSecondEl.append("<span class=\"max-rows\">  Max Rows: " + thisPlugin.properties.serviceImplementation.configurationTables["Query"].rows[0].maxItems + ", Timeout (sec): " + (thisPlugin.properties.serviceImplementation.configurationTables["Query"].rows[0].timeout || 60) + "</span>");
                    } catch (err) {
                    }
                } else if (handlerName === "SQLCommand") {
                    try {
                        handlerSecondEl.append("<span class=\"max-rows\">  Timeout (sec): " + (thisPlugin.properties.serviceImplementation.configurationTables["Query"].rows[0].timeout || 60) + "</span>");
                    } catch (err) {
                    }
                }
            }
        } else {
            // read-write
            nameEl.twStdTextBox("destroy");
            if (isNew) {
                nameEl.twStdTextBox({
                    label: "Name",
                    value: thisProp.name,
                    editable: true,
                    tooltipId: "propertyserviceevent-name",
                    change: function (value) {
                        currentName = value;
                    }
                });
                nameEl.twStdTextBox("focus");
            } else {
                nameEl.html("<div class=\"stdInput-label-container\"><span class=\"std-label\">Name</span></div><div class=\"service-name-holder\"><span title=\"" + thisProp.name + "\">" + (thisProp.name === "" ? "New Service" : "" + thisProp.name + "") + "</span></div>");
            }
            descriptionEl.twStdTextArea("destroy");
            descriptionEl.twStdTextArea({
                label: "Description",
                value: thisProp.description,
                editable: !isReadOnly && !isEditingServiceOverride,
                tooltipId: "propertyserviceevent-description",
                change: function (value) {
                    thisPlugin.properties.model.noteChange("services", currentName, "Description updated");
                }
            });

            channelEl.twMagicPicker("destroy");

            if (!isThingShape && model.isLegacyEdgeThing()) {
                channelEl.twMagicPicker({
                    entityType: "Things",
                    entityName: channelName,
                    //entityName: thisPlugin.properties.propertyToBindTo,
                    labelText: "Channel",
                    tooltipId: "remote-channel",
                    editMode: false
                });
                showChannel = true;
            } else {
                channelEl.hide();
                showChannel = false;
            }

            var currentServiceBindings = thisPlugin.properties.model.get("remoteServiceBindings");
            if (currentServiceBindings === undefined) {
                currentServiceBindings = {};
            }
            var thisSvcBinding = currentServiceBindings[thisProp.name];
            var remoteThing = "";
            var remoteService = "";
            if (thisSvcBinding !== undefined) {
                remoteThing = model.getDefaultEdgeThing();
                remoteService = thisSvcBinding.sourceName;
            }

            maxItemsEl.twStdTextBox("destroy");
            maxItemsEl.twStdTextBox({
                label: "Max Rows",
                value: maxRows,
                editable: !isEditingServiceOverride,
                isNumeric: true,
                tooltipId: "query-max-rows",
                change: function (value) {
                    maxRows = value;
                }
            });


            isAllowOverrideEl.twStdCheckBox("destroy");
            isAllowOverrideEl.twStdCheckBox({
                label: "Allow Override",
                value: isAllowOverride,
                editable: !isEditingServiceOverride,
                tooltipId: "service-is-allow-override",
                change: function (value) {
                    isAllowOverride = value;
                    thisProp.isAllowOverride = isAllowOverride;
                    jqEl.trigger("tw-editor-change", [thisPlugin]);
                }
            });

            if (!isThingShape && !isThingTemplate) {
                isAllowOverrideEl.hide();
            }

            isAsyncEl.twStdCheckBox("destroy");
            isAsyncEl.twStdCheckBox({
                label: "Async",
                value: isAsync,
                editable: !isEditingServiceOverride,
                tooltipId: "service-is-async",
                change: function (value) {
                    isAsync = value;
                    if (thisProp.aspects === undefined) {
                        thisProp.aspects = {};
                    }
                    thisProp.aspects["isAsync"] = isAsync;
                    //svcTimeoutIntervalEl.toggle(!isAsync);
                    svcEnableQueueEl.toggle(isAsync);
                    jqEl.trigger("tw-editor-change", [thisPlugin]);
                }
            });

            remoteServiceNameEl.twStdTextBox({
                label: "Remote Service Name",
                value: remoteService,
                editable: !isEditingServiceOverride,
                tooltipId: "remote-service-name"
                //			            change: function(value) {
                //				            currentName = value;
                //			            }
            });

            svcTimeoutIntervalEl.twStdTextBox({
                label: "Timeout Interval (sec)",
                value: svcTimeout,
                editable: !isEditingServiceOverride,
                isNumeric: true,
                tooltipId: "remote-service-timeout-interval",
                change: function (value) {
                    svcTimeout = value;
                }
            });

            useDefaultTimeoutIntervalEl.twStdComboBox({
                options: [
                    { value: "default", displayText: "Use System Default" },
                    { value: "custom", displayText: "Custom Timeout" }
                ],
                label: "Timeout",
                value: useDefaultTimeoutInterval ? "default" : "custom",
                hideValueDisplay: false,
                editable: !isEditingServiceOverride,
                comboboxClass: "service-default-timeout",
                tooltipId: "service-use-default-timeout",
                change: function (value, displayText) {
                    if (value === "custom") {
                        svcTimeoutIntervalEl.twStdTextBox("updateValue", "30");
                        svcTimeoutIntervalEl.show();
                        useDefaultTimeoutInterval = false;
                        svcTimeout = 30;
                    } else {
                        svcTimeout = 0;
                        svcTimeoutIntervalEl.hide();
                        useDefaultTimeoutInterval = true;
                    }
                    thisPlugin.properties.model.noteChange("services", currentName, "Use Default Timeout changed");
                }
            });

            // oddity that we have to call setValue to update the combo box, but it actually updates the svcTimeout
            var saveSvcTimeout = svcTimeout;
            useDefaultTimeoutIntervalEl.twStdComboBox("setValue", useDefaultTimeoutInterval ? "default" : "custom");
            svcTimeout = saveSvcTimeout;

            svcEnableQueueEl.twStdCheckBox("destroy");
            svcEnableQueueEl.twStdCheckBox({
                label: "Queue Calls",
                value: enableQueue && !isEditingServiceOverride,
                editable: true,
                tooltipId: "remote-service-enable-queue",
                change: function (value) {
                    enableQueue = value;
                    //svcTimeoutIntervalEl.toggle(!isAsync);
                }
            });

            categoryEl.twStdTextBox({
                label: "Category",
                value: thisProp.category,
                editable: !isEditingServiceOverride,
                tooltipId: "propertyserviceevent-category",
                change: function (value) {
                    thisPlugin.properties.model.noteChange("services", currentName, "Category updated");
                    newCategory = value;
                }
            });

            var options = [
                { value: "Script", displayText: TW.IDE.convertHandlerToDisplayHandler("Script") }
            ];
            if (thisPlugin.properties.model.thingPackageInfo !== undefined) {
                _.each(thisPlugin.properties.model.thingPackageInfo.handlerDefinitions, function (handler) {
                    // only add it if it's user definable and don't add 'Script' twice
                    if (handler.isUserDefinable && handler.name !== "Script") {
                        options.push({
                            value: handler.name,
                            displayText: TW.IDE.convertHandlerToDisplayHandler(handler.name)
                        });
                    }
                });
            }

            if (isThingShape || model.isRemotable || model.isEdgeMetadataBrowsable || model.isRemoteMetadataBrowsable) {
                options.push({
                    value: "Remote",
                    displayText: TW.IDE.convertHandlerToDisplayHandler("Remote")
                });
            }

            if (isNew && thisPlugin.properties.isRemoteServiceManual) {
                handlerName = "Remote";
            }

            handlerSecondEl.twStdComboBox({
                options: options,
                label: "Service Type",
                value: handlerName,
                hideValueDisplay: false,
                editable: !isEditingServiceOverride,
                comboboxClass: "service-handler",
                tooltipId: "service-handler-2",
                displayMode: "inline",
                change: function (value, displayText) {
                    thisPlugin.properties.model.noteChange("services", currentName, "ServiceType updated");
                    updateHandlerSelection(value);
                }
            });
            handlerSecondEl.twStdComboBox("setValue", handlerName);
            handlerSecondEl.show();
            updateHandlerSelection(handlerName);
        }
    };

    var updateInputOutputDefinitions = function (isReadOnly) {
        inputFieldDefinitionEl.twParameterDefinitionsView("destroy");
        inputFieldDefinitionEl.twParameterDefinitionsView({
            title: "Inputs",
            change_section: "services",
            change_field: thisPlugin.properties.serviceDefinition.name,
            fields: thisPlugin.properties.serviceDefinition.parameterDefinitions,
            editMode: !isReadOnly && thisPlugin.properties.isMyProps,
            type: "ParameterDefinitions",
            isNew: isNew,
            //gridMode: false,
            model: thisPlugin.properties.model,
            isMyProps: thisPlugin.properties.isMyProps,
            modelFieldsKeyPath: "thingShape.serviceDefinitions." + (isNew ? newId : thisProp.name) + ".parameterDefinitions",
            change: function (fieldsModel) {
                newInputParameters = fieldsModel;
                thisPlugin.properties.model.noteChange("services", currentName, "Inputs updated");
                //markThisAsChanged();
            },
            insertText: function (inputName) {
                if (handlerName === "Script") {
                    thisPlugin.scriptCodeElem.twCodeEditor("insertCode", inputName);
                } else {
                    thisPlugin.scriptCodeElem.twCodeEditor("insertCode", "[[" + inputName + "]]");
                }
            }
        });

        outputFieldDefinitionEl.twOutputDefinition("destroy");
        outputFieldDefinitionEl.twOutputDefinition({
            title: "Inputs",
            change_section: "services",
            change_field: thisPlugin.properties.serviceDefinition.name,
            resultType: thisPlugin.properties.serviceDefinition.resultType,
            editMode: !isReadOnly && thisPlugin.properties.isMyProps,
            type: "OutputDefinition",
            //gridMode: false,
            model: thisPlugin.properties.model,
            isMyProps: thisPlugin.properties.isMyProps,
            modelFieldsKeyPath: "thingShape.serviceDefinitions." + (isNew ? newId : thisProp.name) + ".Outputs.fieldDefinitions",
            change: function (resultType) {
                newResultType = resultType;
                thisPlugin.properties.model.noteChange("services", currentName, "Output Updated");
            }
        });

        if (isReadOnly) {
            // make sure we are showing I/O
            jqSecondEl.find(".script-editor-tab[tab=\"inputs-outputs\"]").show();
        }
    };

    updateInputOutputDefinitions(true/*isReadOnly*/);
    updateServiceDetails(true/*isReadOnly*/);

    var updateCodeEditingSpace = function () {
        if (!thisPlugin.properties.readOnly) { //&& thisPlugin.properties.isFullScreen ) {
            channelEl.hide();
            //remoteThingEl.hide();
            remoteServiceNameEl.hide();
            svcTimeoutIntervalEl.hide();
            useDefaultTimeoutIntervalEl.hide();
            svcEnableQueueEl.hide();
            maxItemsEl.hide();
            switch (handlerName) {
                case "Script":
                    codeSnippetsEl.show();
                    codeSnippetsEl.twCodeSnippets("destroy");
                    codeSnippetsEl.twCodeSnippets({
                        handler: handlerName,
                        insertCode: function (code) {
                            thisPlugin.scriptCodeElem.twCodeEditor("insertCode", code);
                        }
                    });
                    //codeSnippetsEl.addClass('span2');
                    entitySnippetHelperEl.show();
                    entitySnippetHelperMeEl.show();
                    //entitySnippetHelperEl.addClass('span4');
                    entitySnippetHelperEl.twEntitySnippetHelper("destroy");
                    entitySnippetHelperEl.twEntitySnippetHelper({
                        model: thisPlugin.properties.model,
                        type: "All",
                        handler: "Script",
                        entrySelected: function (metadata, entityType, entityName, metadataArea, metadataName, shouldInsertThingReferences) {
                            thisPlugin.scriptCodeElem.twCodeEditor("insertCode", TW.IDE.codeForMetadata(metadata, entityType, entityName, metadataArea, metadataName, shouldInsertThingReferences));
                        },
                        entryReferenceSelected: function (entityType, entityName) {
                            thisPlugin.scriptCodeElem.twCodeEditor("insertCode", TW.IDE.codeForEntityReference(entityType, entityName));
                        }
                    });
                    entitySnippetHelperMeEl.twEntitySnippetHelper("destroy");
                    entitySnippetHelperMeEl.twEntitySnippetHelper({
                        model: thisPlugin.properties.model,
                        handler: "Script",
                        type: "Me",
                        entrySelected: function (metadata, entityType, entityName, metadataArea, metadataName, shouldInsertThingReferences) {
                            var entityDataShape = undefined;
                            try {
                                // check to see if this is a stream or datatable
                                entityDataShape = model.attributes.configurationTables.Settings.rows[0].dataShape;
                            } catch (err) {
                                try {
                                    // check to see if this is a content crawler
                                    entityDataShape = model.attributes.configurationTables.GeneralConfiguration.rows[0].internalDataShapeName;
                                } catch (err) {
                                    // do nothing
                                }
                            }
                            thisPlugin.scriptCodeElem.twCodeEditor("insertCode", TW.IDE.codeForMetadata(metadata, entityType, entityName, metadataArea, metadataName, shouldInsertThingReferences, entityDataShape));
                        },
                        entryReferenceSelected: function (entityType, entityName) {
                            thisPlugin.scriptCodeElem.twCodeEditor("insertCode", TW.IDE.codeForEntityReference(entityType, entityName));
                        }
                    });
                    ioSnippetTabs_CodeSnippetsTab.show();
                    ioSnippetTabs_MeTab.show();
                    ioSnippetTabs_OtherEntitiesTab.show();
                    ioSnippetTabs_TablesTab.hide();
                    //testQueryBtn.hide();
                    testQueryBtn.text("Test");
                    testQueryBtn.show();
                    if (isThingShape || isThingTemplate) {
                        testQueryBtn.hide();
                    }
                    codeEl.show();
                    scriptEditorcol1El.removeClass("remote-service");
                    break;
                case "SQLQuery":
                case "SQLCommand":
                    ioSnippetTabs_CodeSnippetsTab.hide();
                    ioSnippetTabs_MeTab.hide();
                    ioSnippetTabs_OtherEntitiesTab.hide();
                    ioSnippetTabs_TablesTab.show();
                    tablesColumnsHelperEl.twTablesColumnsHelper("destroy");
                    tablesColumnsHelperEl.twTablesColumnsHelper({
                        model: thisPlugin.properties.model,
                        handler: handlerName,
                        insertCode: function (code) {
                            thisPlugin.scriptCodeElem.twCodeEditor("insertCode", code);
                        }
                    });
                    testQueryBtn.text("Test");
                    testQueryBtn.show();
                    if (handlerName === "SQLQuery") {
                        maxItemsEl.show();
                    }
                    svcTimeoutIntervalEl.show();
                    if (isThingShape || isThingTemplate) {
                        testQueryBtn.hide();
                    }
                    codeEl.show();
                    break;
                case "Remote":
                    ioSnippetTabs_CodeSnippetsTab.hide();
                    ioSnippetTabs_MeTab.hide();
                    ioSnippetTabs_OtherEntitiesTab.hide();
                    ioSnippetTabs_TablesTab.hide();
                    if (showChannel) {
                        channelEl.show();
                    } else {
                        channelEl.hide();
                    }
                    //remoteThingEl.show();
                    remoteServiceNameEl.show();
                    //svcTimeoutIntervalEl.toggle(!isAsync);
                    if (useDefaultTimeoutInterval) {
                        svcTimeoutIntervalEl.hide();
                    } else {
                        svcTimeoutIntervalEl.show();
                    }
                    useDefaultTimeoutIntervalEl.show();
                    svcEnableQueueEl.toggle(isAsync);
                    codeEl.hide();
                    scriptEditorcol1El.addClass("remote-service");
                    break;
                case "Reflection":
                    ioSnippetTabs_CodeSnippetsTab.hide();
                    ioSnippetTabs_MeTab.hide();
                    ioSnippetTabs_OtherEntitiesTab.hide();
                    ioSnippetTabs_TablesTab.hide();
                    codeEl.hide();
                    break;
                default:
                    TW.log.error("twServiceEditor - unprepared for handler \"" + handlerName + "\" in updateCodeEditingSpace() !readOnly");
                    break;
            }
            if (isNew) {
                ioSnippetTabs_SvcInfoTab.click();
            } else {
                ioSnippetTabs_IOTab.click();
            }
        } else {
            ioSnippetTabsEl.find("li").removeClass("active");
            ioSnippetTabsEl.find("li.io-tab").addClass("active");
            codeSnippetsEl.hide();
            codeSnippetsEl.twCodeSnippets("destroy");
            //codeSnippetsEl.removeClass('span2');
            entitySnippetHelperEl.hide();
            entitySnippetHelperMeEl.hide();
            //entitySnippetHelperEl.removeClass('span4');
            entitySnippetHelperEl.twEntitySnippetHelper("destroy");
            entitySnippetHelperMeEl.twEntitySnippetHelper("destroy");

            //testQueryBtn.hide();
            testQueryBtn.text("Test");
            testQueryBtn.show();
            if (isThingShape || isThingTemplate) {
                testQueryBtn.hide();
            }

            switch (handlerName) {
                case "Script":
                case "SQLQuery":
                case "SQLCommand":
                    codeEl.show();
                    break;
                case "Remote":
                case "Reflection":
                case "":
                    codeEl.hide();
                    break;
                default:
                    TW.log.error("twServiceEditor - unprepared for handler \"" + handlerName + "\" in updateCodeEditingSpace() readonly");
                    break;
            }
        }

    };

    expandBtn.click(function (e) {

        thisPlugin.properties.isFullScreen = true;

        // scroll to the left to fix MASHUP-2954
        thisPlugin.detailsElem.find(".actual-script-code").twCodeEditor("scrollCodeTo", 0, null);

        var expandCollapseContent = jqSecondEl.find(".expand-collapse-container");
        thisPlugin.detachedExpandCollapseContent = expandCollapseContent.detach();

        var currentIoTabActive = ioSnippetTabsEl.find("li.active").attr("tab");

        // find where to put it
        var fullTabDiv = jqSecondEl.closest(".tabview-content").find(".full-tab-div");
        thisPlugin.detachedExpandCollapseContent.appendTo(fullTabDiv);
        fullTabDiv.addClass("serviceFullScreen");
        fullTabDiv.show();
        //$('body').addClass('fullscreenView');
        if (!thisPlugin.detailsElem.is(":visible")) {
            toggleCodeVisible(true/*showCodeProperly*/);
        }

        updateCodeEditingSpace();

        ioSnippetTabsEl.find("li[tab=\"" + currentIoTabActive + "\"]").click();

        //thisPlugin.scriptCodeElem.twCodeEditor('adjustHeightWithinContainer',fullTabDiv);

        if (editMode) {
            fullscreenEditBtn.show();
        } else {
            fullscreenEditBtn.hide();
        }
        expandBtn.hide();
        collapseBtn.show();
        if (!isNew) {
            extraTestBtn.show();
        }

        thisPlugin.resize(true);
    });

    extraTestBtn.click(function (e) {
        thisPlugin.properties.testService();
    });

    collapseBtn.click(function (e) {

        thisPlugin.properties.isFullScreen = false;

        var currentIoTabActive = ioSnippetTabsEl.find("li.active").attr("tab");

        var fullTabDiv = jqSecondEl.closest(".tabview-content").find(".full-tab-div");
        var expandCollapseContent = fullTabDiv.find(".expand-collapse-container");
        thisPlugin.detachedExpandCollapseContent = expandCollapseContent.detach();

        // find where to put it
        var normalEl = jqSecondEl.find(".service-script");
        thisPlugin.detachedExpandCollapseContent.appendTo(normalEl);
        fullTabDiv.removeClass("serviceFullScreen");
        //$('body').removeClass('fullscreenView');
        fullTabDiv.hide();
        updateCodeEditingSpace();

        fullscreenEditBtn.hide();

        var scriptContainerEl = jqSecondEl.find(".editor-container");
        // thisPlugin.scriptCodeElem.twCodeEditor('adjustHeightWithinContainer',scriptContainerEl);
        //				thisPlugin.scriptCodeElem.twCodeEditor('setHeight',300);

        ioSnippetTabsEl.find("li[tab=\"" + currentIoTabActive + "\"]").click();

        expandBtn.show();
        collapseBtn.hide();
        extraTestBtn.hide();

        thisPlugin.resize(true);
    });

    fullscreenEditBtn.click(function (e) {
        doEdit();
    });

    var doEdit = function (e) {
        // pjhtodo:   should generate a todo here
        cancelSecondBtn.show();
        doneSecondBtn.show();
        if (!isNew) {
            saveEntitySecondBtn.show();
        }
        doneCancelTooltip.show();
        editBtn.hide();
        editOverrideBtn.hide();
        clearOverrideBtn.hide();
        //viewBtn.show();

        jqEl.addClass("editing");
        jqSecondEl.addClass("newRowEditing");
        //the -10 here is for the 5px all around padding on the script-editor-sizing-box

        if (!thisPlugin.detailsElem.is(":visible")) {
            // we set showCodeProperly to false here, otherwise we do it twice and that looks really awful
            toggleCodeVisible(false/*showCodeProperly*/);
        }

        thisPlugin.properties.readOnly = false;

        ioSnippetTabsEl.show();
        //set the height of the io tabs area

        updateCodeEditor(false/*isReadOnly*/);
        updateInputOutputDefinitions(false/*isReadOnly*/);
        updateServiceDetails(false/*isReadOnly*/);
        setTimeout(function () {
            jqEl.trigger("tw-editor-change", [thisPlugin]);
        }, 100);

        thisPlugin.resize(true);
    };

    var doCancel = function (e) {
        //alert('should restore to what you had before you modified but not ready for that ... hit entity cancel to abort these changes.  Sorry.');

        cancelSecondBtn.hide();
        doneSecondBtn.hide();
        saveEntitySecondBtn.hide();
        doneCancelTooltip.hide();

        $(".tab-panel-selected").find(".code-snippet-popover").remove();

        jqEl.removeClass("editing");

        thisPlugin.properties.readOnly = true;

        updateCodeEditor(true/*isReadOnly*/);
        updateInputOutputDefinitions(true/*isReadOnly*/);
        updateServiceDetails(true/*isReadOnly*/);

        updateCodeEditingSpace();
        ioSnippetTabsEl.hide();

        if (thisPlugin.properties.isFullScreen) {
            collapseBtn.click();
        }

        // restore original values
        for (var x in thisPropOriginal) {
            thisProp[x] = thisPropOriginal[x];
        }

        if (thisSvcImplOriginal !== undefined) {
            for (var x in thisSvcImplOriginal) {
                implOfThisSvc[x] = thisSvcImplOriginal[x];
            }
        }

        // on cancel or done - close the editor ... only open with edit in edit mode
        toggleCodeVisible(false/*showCodePropertly*/);

        editBtn.show();
        if (isEditingServiceOverride) {
            editOverrideBtn.show();
            clearOverrideBtn.show();
        }
        jqEl.trigger("tw-editor-change", [thisPlugin]);
        setTimeout(function () {
            thisPlugin.properties.cancel();
        }, 1);
    };
    cancelSecondBtn.click(function (e) {
        doCancel(e);
    });


    var doDone = function (e, isSaveEntity, callback) {
        if (isNew) {
            var newName = nameEl.twStdTextBox("getProperty", "value");
            if ($.trim(newName).length === 0) {
                ioSnippetTabs_SvcInfoTab.click();
                nameEl.twStdTextBox("setError", "Must enter a name for this service.");
                nameEl.twStdTextBox("focus", true/*showTooltip*/);
                return;
            } else if (!TW.IDE.validPropertyServiceEventName(newName)) {
                ioSnippetTabs_SvcInfoTab.click();
                nameEl.twStdTextBox("setError", "Service Name \"" + newName + "\" contains some invalid characters.");
                nameEl.twStdTextBox("focus", true/*showTooltip*/);
                return;
            } else if (!thisPlugin.properties.nameValid(newName)) {
                ioSnippetTabs_SvcInfoTab.click();
                nameEl.twStdTextBox("setError", "Service name \"" + newName + "\" already exists ... you must have a unique name for this service.");
                nameEl.twStdTextBox("focus", true/*showTooltip*/);
                return;
            } else {
                thisProp.name = newName;
            }
        }

        var saveService = function () {
            var implOfThisSvc = thisPlugin.properties.serviceImplementation;

            if (isNew) {
            }
            if (implOfThisSvc === undefined) {
                // no implementation yet ... fill in default
                implOfThisSvc = {
                    allowOverride: true,
                    description: "",
                    name: thisPlugin.properties.serviceDefinition.name,
                    handlerName: "Script",
                    configurationTables: {
                        "Script": {
                            dataShape: {
                                "description": "",
                                "name": "",
                                "fieldDefinitions": {
                                    "code": {
                                        "baseType": "STRING",
                                        "description": "code",
                                        "name": "code",
                                        "aspects": {},
                                        "ordinal": 0
                                    }
                                }
                            },
                            description: "Script",
                            isMultiRow: false,
                            name: "Script",
                            rows: [
                                {
                                }
                            ]
                        }
                    }
                };
            }
            if (thisPlugin.scriptCodeElem.length > 0) {
                var scriptCode = thisPlugin.scriptCodeElem.twCodeEditor("getProperty", "code");
            }
            if (handlerName === "Script") {
                var scriptInfo = implOfThisSvc.configurationTables.Script;

                // in case they changed handlers
                delete implOfThisSvc.configurationTables["Query"];

                if (scriptInfo === undefined) {
                    implOfThisSvc.configurationTables["Script"] = {
                        dataShape: {
                            "description": "",
                            "name": "",
                            "fieldDefinitions": {
                                "code": {
                                    "baseType": "STRING",
                                    "description": "code",
                                    "name": "code",
                                    "aspects": {},
                                    "ordinal": 0
                                }
                            }
                        },
                        description: "Script",
                        isMultiRow: false,
                        name: "Script",
                        rows: [
                            {
                            }
                        ]
                    };
                    scriptInfo = implOfThisSvc.configurationTables.Script;
                }
                scriptInfo.rows[0]["code"] = scriptCode;
                thisPlugin.scriptObject.code = scriptCode;
                implOfThisSvc.handlerName = handlerName;
            } else if (handlerName === "SQLCommand" || handlerName === "SQLQuery") {
                var queryInfo = implOfThisSvc.configurationTables.Query;

                // in case they changed handlers
                delete implOfThisSvc.configurationTables["Script"];

                if (queryInfo === undefined) {
                    implOfThisSvc.configurationTables["Query"] = {
                        description: handlerName,
                        dataShape: {
                            "description": "",
                            "name": "",
                            "fieldDefinitions": {
                                "sql": {
                                    "baseType": "STRING",
                                    "description": "sql",
                                    "name": "sql",
                                    "aspects": {},
                                    "ordinal": 0
                                },
                                "maxItems": {
                                    "baseType": "NUMBER",
                                    "description": "maxItems",
                                    "name": "maxItems",
                                    "aspects": {},
                                    "ordinal": 0
                                },
                                "timeout": {
                                    "baseType": "NUMBER",
                                    "description": "timeout",
                                    "name": "timeout",
                                    "aspects": {},
                                    "ordinal": 0
                                }
                            }
                        },
                        isMultiRow: false,
                        name: "Query",
                        rows: [
                            {
                            }
                        ]
                    };
                    queryInfo = implOfThisSvc.configurationTables.Query;
                }
                if (queryInfo.dataShape.fieldDefinitions["timeout"] === undefined) {
                    queryInfo.dataShape.fieldDefinitions["timeout"] = {
                        "baseType": "NUMBER",
                        "description": "timeout",
                        "name": "timeout",
                        "aspects": {},
                        "ordinal": 0
                    };
                }
                queryInfo.rows[0].sql = scriptCode;
                queryInfo.rows[0].maxItems = maxItemsEl.twStdTextBox("getProperty", "value");
                queryInfo.rows[0].timeout = svcTimeoutIntervalEl.twStdTextBox("getProperty", "value");
                thisPlugin.scriptObject.code = scriptCode;
                implOfThisSvc.handlerName = handlerName;
            } else if (handlerName === "Remote") {
                implOfThisSvc = undefined;
            }


            var setInfo = {};
            if (handlerName !== "Remote") {
                implOfThisSvc.name = thisProp.name;
                setInfo["thingShape.serviceImplementations." + thisProp.name] = implOfThisSvc;
            }

            thisProp.description = descriptionEl.twStdTextArea("getProperty", "value");
            if (newTags !== undefined) thisProp.tags = newTags;
            if (newCategory !== undefined) thisProp.category = newCategory;
            if (newResultType !== undefined) thisProp.resultType = newResultType;
            //					if( isNew ) {
            thisProp.parameterDefinitions = newInputParameters;
            //					}

            if (thisProp.aspects === undefined) {
                thisProp.aspects = {};
            }
            thisProp.aspects["isAsync"] = isAsync;
            thisProp.isAllowOverride = isAllowOverride;
            var currentServiceBindings = thisPlugin.properties.model.get("remoteServiceBindings");
            var thisServiceBinding = currentServiceBindings[thisProp.name];
            if (handlerName === "Remote") {
                if (thisServiceBinding === undefined) {
                    currentServiceBindings[thisProp.name] = {};
                    thisServiceBinding = currentServiceBindings[thisProp.name];
                }
                thisServiceBinding["name"] = thisProp.name;
                thisServiceBinding["sourceName"] = remoteServiceNameEl.twStdTextBox("getProperty", "value");
                thisServiceBinding["timeout"] = svcTimeout;
                thisServiceBinding["enableQueue"] = enableQueue;

                // delete the service implementation
                var curThingShapeSvcImpls = thisPlugin.properties.model.get("thingShape.serviceImplementations");
                var curEffectiveShapeImpls = thisPlugin.properties.model.get("effectiveShape.serviceImplementations");
                delete curThingShapeSvcImpls[thisProp.name];
                delete curEffectiveShapeImpls[thisProp.name];
                thisPlugin.properties.model.set("thingShape.serviceImplementations", curThingShapeSvcImpls);
                thisPlugin.properties.model.set("effectiveShape.serviceImplementations", curEffectiveShapeImpls);
            } else {
                if (thisServiceBinding !== undefined) {
                    delete currentServiceBindings[thisProp.name];
                }
                var curEffectiveShapeDefs = thisPlugin.properties.model.get("effectiveShape.serviceDefinitions");
                var curEffectiveShapeImpls = thisPlugin.properties.model.get("effectiveShape.serviceImplementations");
                curEffectiveShapeDefs[thisProp.name] = thisProp;
                curEffectiveShapeImpls[thisProp.name] = implOfThisSvc;
                thisPlugin.properties.model.set("effectiveShape.serviceDefinitions", curEffectiveShapeDefs);
                thisPlugin.properties.model.set("effectiveShape.serviceImplementations", curEffectiveShapeImpls);
            }

            setInfo["remoteServiceBindings"] = currentServiceBindings;
            if (!isEditingServiceOverride) {
                setInfo["thingShape.serviceDefinitions." + thisProp.name] = thisProp;
            }
            thisPlugin.properties.model.set(setInfo);

            if (!isSaveEntity) {
                // should clear the todo if it's all ok (including checking if twParameterDefinitionsView is still being edited)
                cancelSecondBtn.hide();
                doneSecondBtn.hide();
                saveEntitySecondBtn.hide();
                doneCancelTooltip.hide();
                ioSnippetTabsEl.hide();

                updateCodeEditor(true/*isReadOnly*/);
                updateInputOutputDefinitions(true/*isReadOnly*/);
                updateServiceDetails(true/*isReadOnly*/);

                if (thisPlugin.properties.isFullScreen) {
                    collapseBtn.click();
                }

                if (isNew) {
                    thisPlugin.properties.model.noteChange("services", thisProp.name, "Service Added");
                }

                var wasNew = isNew;

                thisPlugin.properties.isNew = false;
                isNew = false;
                jqEl.removeClass("editing");

                jqSecondEl.find(".service-definition-name").text(buildNameToShow());
                editBtn.show();

                //					// on cancel or done - close the editor ... only open with edit in edit mode
                //					toggleCodeVisible(false/*showCodePropertly*/);
            }

            if (wasNew) {
                thisPlugin.properties.save(newName, isSaveEntity);
            } else {
                var svcName = jqEl.attr("service-name");
                thisPlugin.properties.save(svcName, isSaveEntity);
            }

            jqEl.trigger("tw-editor-change", [thisPlugin]);
        };

        // only check syntax for scripts
        if (handlerName === "Script") {
            thisPlugin.scriptCodeElem.twCodeEditor("checkSyntax", false /*showSuccess*/, function (ok) {
                if (ok) {
                    saveService();
                    callback(true);
                } else {
                    callback(false);
                }
            }, doneSecondBtn);
        } else {
            saveService();
            callback(true);
        }

        e.stopPropagation();
    };

    doneSecondBtn.click(function (e) {
        doDone(e, false/*isSaveEntity*/, function () { });
    });

    saveEntitySecondBtn.click(function (e) {
        doDone(e, true/*isSaveEntity*/, function (okToSave) {
            if (okToSave) {
                //			        setTimeout(function() {
                thisPlugin._isInSaveEntity = true;
                saveEntitySecondBtn.closest(".tabview-content").find(".btn-save-continue-edit").click();
                thisPlugin._isInSaveEntity = false;
                jqEl.trigger("tw-editor-change", [thisPlugin]);
                //			        },100);
            }
        });
    });

    thisPlugin.detailsElem = jqSecondEl; //.find('.service-script');

    var updateCodeEditor = function (isReadOnly) {
        if (thisPlugin.scriptObject === undefined) {
            return;
        }
        var fullTabDiv = jqSecondEl.closest(".tabview-content").find(".full-tab-div");
        thisPlugin.scriptCodeElem.twCodeEditor("destroy");
        thisPlugin.scriptCodeElem.twCodeEditor({
            handler: handlerName,
            code: thisPlugin.scriptObject.code,
            //configurationTables: scriptObject.configurationTables,
            editMode: !isReadOnly, // false, // thisPlugin.properties.editMode && thisPlugin.properties.isMyProps,
            // height: thisPlugin.properties.isFullScreen ? 500 : 300,
            isFullScreen: thisPlugin.properties.isFullScreen,
            fullTabDiv: fullTabDiv,
            change: function (code) {
                // keep this updated in case we switch from SQLQuery to SQLCommand or Script
                thisPlugin.scriptObject.code = code;
                if (!thisPlugin.codeChanged) {
                    thisPlugin.properties.model.noteChange("services", currentName, "Code Updated");
                    thisPlugin.codeChanged = true;
                }
                //markThisAsChanged();
            }
        });
        if (thisPlugin.detailsElem.is(":visible")) {
            // if we haven't already put codeMirror in, put it in now
            //setTimeout(function() {
            thisPlugin.scriptCodeElem.twCodeEditor("showCodeProperly");
            //},1);
        }
    };

    if (scriptObjects.length > 0) {
        thisPlugin.scriptObject = scriptObjects[0];
        thisPlugin.codeChanged = false;
        thisPlugin.properties.readOnly = true;

        thisPlugin.scriptCodeElem = jqSecondEl.find(".actual-script-code[id=\"" + thisPlugin.scriptObject.id + "\"]");

        updateCodeEditor(true /*isReadOnly*/);
        updateInputOutputDefinitions(true/*isReadOnly*/);
        updateServiceDetails(true/*isReadOnly*/);
    }

    var toggleCodeVisible = function (showCodeProperly) {
        if (thisPlugin.detailsElem.is(":visible")) {
            thisPlugin.detailsElem.hide();
            $("body").scrollTo(thisPlugin.jqElement, { offset: -219 });
        } else {
            thisPlugin.detailsElem.show();
            if (showCodeProperly === true) {
                // if we haven't already put codeMirror in, put it in now
                setTimeout(function () {
                    thisPlugin.detailsElem.find(".actual-script-code").twCodeEditor("showCodeProperly");
                    thisPlugin.resize(true);
                }, 1);
            } else {
                thisPlugin.resize(showCodeProperly);
            }

        }
    };

    ioSnippetTabsEl.click(function (e) {
        var li = $(e.target).closest("li");

        if (li.length === 0) {
            return;
        }
        ioSnippetTabsEl.find("li").removeClass("active");
        var tabToShow = li.attr("tab");
        ioSnippetTabContainerEl.find(".script-editor-tab").hide();
        var tabContainer = ioSnippetTabContainerEl.find(".script-editor-tab[tab=\"" + tabToShow + "\"]");
        tabContainer.show();

        try {
            var focusItem = tabContainer.find("[focus-item=\"1\"]");
            var plugin = focusItem.attr("tw-jqplugin");
            if (plugin !== undefined) {
                focusItem[plugin]("focus");
            }
        } catch (err) {

        }
        li.addClass("active");
    });

    jqSecondEl.find(".io-tab").click();

    if (!thisPlugin.properties.readOnly) {
        ioSnippetTabsEl.show();
    } else {
        ioSnippetTabsEl.hide();
    }

    jqSecondEl.addClass("new-row");

    if (thisPlugin.properties.editMode) {
        doEdit();
    } else {
        updateCodeEditingSpace();
    }

    var doneBtn = jqSecondEl.find("button.done-btn");
    if (doneBtn.length > 0) {
        doneBtn.scrollintoview({ offset: 5 });
    }
};