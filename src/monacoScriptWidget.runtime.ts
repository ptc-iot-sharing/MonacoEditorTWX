import { ThingworxRuntimeWidget, TWService, TWProperty } from 'typescriptwebpacksupport/widgetRuntimeSupport';

@ThingworxRuntimeWidget
class MonacoCodeEditorWidget extends TWRuntimeWidget {
    monacoEditor: import("./editors/basicCodeEditor").MonacoCodeEditor;

    @TWProperty("Code")
    set code(value: string) {
        if (value != this.monacoEditor.getValue()) {
            this.monacoEditor.setValue(value);
        }
    };

    @TWProperty("EditorSettings")
    set editorSettings(value: any) {
        this.monacoEditor.setEditorSettings(JSON.parse(value));
    };

    @TWProperty("ReadOnly")
    set readOnly(value: boolean) {
        this.monacoEditor.setReadOnlyStatus(value);
    };

    @TWProperty("Language")
    set language(language: string) {
        this.monacoEditor.changeLanguage(language, this.code);
    };

    renderHtml(): string {
        return '<div class="widget-content widget-monaco-editor"></div>';
    };

    async afterRender(): Promise<void> {
        // auto layout should be enabled
        const editorSettings = JSON.parse(this.editorSettings);
        editorSettings.automaticLayout = true;
        const editorNamespace = await import("./editors/basicCodeEditor");
        this.monacoEditor = new editorNamespace.MonacoCodeEditor(this.jqElement[0], <any>{editor: editorSettings}, {
            onPreferencesChanged: () => { }
        }, {
                code: this.code,
                language: this.language,
                modelName: Math.random().toString(36).substring(7),
                readonly: this.readOnly
            });
        this.monacoEditor.onEditorContentChange((code) => {
            this.code = code;
            this.jqElement.triggerHandler("Changed");
        });
    }

    @TWService("Format")
    Format(): void {
        this.monacoEditor.autoFormatDocument();
    }

    @TWService("Copy")
    Copy(): void {
        this.copyTextToClipboard(this.code);
    }

    beforeDestroy?(): void {
        this.monacoEditor.dispose();
    }

    fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }

    copyTextToClipboard(text) {
        if (!navigator["clipboard"]) {
            this.fallbackCopyTextToClipboard(text);
            return;
        }
        navigator["clipboard"].writeText(text).then(function () {
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
}