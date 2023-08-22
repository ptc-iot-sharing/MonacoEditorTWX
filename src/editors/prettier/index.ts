import { CancellationToken, editor, languages, Range } from "monaco-editor";
import type { Plugin, Options as PrettierOptions, SupportLanguage as PrettierSupportLanguage } from "prettier";

/**
 * Uses prettier to format code in monaco by using DocumentRangeFormattingEditProvider
 *
 * Heavily inspired from the official `vscode-prettier` plugin
 */
export class MonacoPrettier
    implements languages.DocumentRangeFormattingEditProvider, languages.DocumentFormattingEditProvider
{
    readonly displayName = "MonacoPrettier";
    private _optionsProvider: () => PrettierOptions;

    constructor(optionsProvider: () => PrettierOptions) {
        this._optionsProvider = optionsProvider;
    }

    public async provideDocumentRangeFormattingEdits(
        document: editor.ITextModel,
        range: Range,
        options: languages.FormattingOptions,
        token: CancellationToken
    ): Promise<languages.TextEdit[]> {
        return this.provideEdits(document, {
            rangeEnd: document.getOffsetAt(range.getEndPosition()),
            rangeStart: document.getOffsetAt(range.getStartPosition()),
            force: false,
            languageId: document.getLanguageId(),
        });
    }

    public async provideDocumentFormattingEdits(
        document: editor.ITextModel,
        options: languages.FormattingOptions,
        token: CancellationToken
    ): Promise<languages.TextEdit[]> {
        return this.provideEdits(document, {
            force: false,
            languageId: document.getLanguageId(),
        });
    }
    private provideEdits = async (
        document: editor.ITextModel,
        options: FormattingOptions
    ): Promise<languages.TextEdit[]> => {
        const result = await this.format(document.getValue(), options);
        if (!result) {
            return [];
        }
        return [
            {
                range: document.getFullModelRange(),
                text: result,
            },
        ];
    };

    /**
     * Format the given text with user's configuration.
     * @param text Text to format
     * @param path formatting file's path
     * @returns {string} formatted text
     */
    private async format(text: string, options: FormattingOptions): Promise<string | undefined> {
        const prettierInstance = await import("prettier/standalone");

        const prettierOptions = this.getPrettierOptions(this._optionsProvider(), options);
        const plugins: Plugin[] = [];
        let parser: string;
        // Get the plugin used based on the parser
        switch (options.languageId) {
            case "json":
                plugins.push((await import("prettier/plugins/estree")).default);
                parser = 'json';
                break;
            case "typescript":
                plugins.push((await import("prettier/plugins/estree")).default);
                plugins.push((await import("prettier/plugins/typescript")).default);
                parser = 'typescript';
                break;
            case "javascript":
                plugins.push((await import("prettier/plugins/estree")).default);
                plugins.push((await import("prettier/plugins/babel")).default);
                parser = 'babel';
                break;
            case "css":
                plugins.push((await import("prettier/plugins/postcss")).default);
                parser = 'css';
                break;
            default:
                throw `Cannot format file with language ${options.languageId}`;
        }

        try {
            const formattedText = prettierInstance.format(text, {
                ...prettierOptions,
                parser: parser,
                plugins: plugins,
            });

            return formattedText;
        } catch (error) {
            console.error("Error formatting document.", error);
            return text;
        }
    }

    private getPrettierOptions(
        configOptions: PrettierOptions,
        formattingOptions: FormattingOptions
    ): Partial<PrettierOptions> {
        let rangeFormattingOptions: RangeFormattingOptions | undefined;
        if (formattingOptions.rangeEnd && formattingOptions.rangeStart) {
            rangeFormattingOptions = {
                rangeEnd: formattingOptions.rangeEnd,
                rangeStart: formattingOptions.rangeStart,
            };
        }

        const options: PrettierOptions = {
            ...configOptions,
            ...(rangeFormattingOptions || {}),
            ...(configOptions || {}),
        };

        if (formattingOptions.force && options.requirePragma === true) {
            options.requirePragma = false;
        }

        return options;
    }
}

export interface FormattingOptions {
    rangeStart?: number;
    rangeEnd?: number;
    force: boolean;
    languageId: string;
}
export interface RangeFormattingOptions {
    rangeStart: number;
    rangeEnd: number;
}
