import { CancellationToken, editor, languages, Range } from "monaco-editor";
import type { Options as PrettierOptions, SupportLanguage as PrettierSupportLanguage } from "prettier";

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

        const languages = (await prettierInstance.getSupportInfo()).languages;

        const prettierOptions = this.getPrettierOptions(this._optionsProvider(), options);
        // Get the parser and plugin to handle this document
        const parser = this.getParserFromLanguageId(languages, options.languageId);
        let plugin;
        // Get the plugin used based on the parser
        switch (parser) {
            case "babel":
            case "json":
                plugin = await import("prettier/plugins/babel");
                break;
            case "typescript":
                plugin = await import("prettier/plugins/typescript");
                break;
            case "css":
                plugin = await import("prettier/plugins/postcss");
            default:
                throw `Cannot format file with language ${options.languageId}`;
        }

        try {
            const formattedText = prettierInstance.format(text, {
                ...prettierOptions,
                parser: parser,
                plugins: [plugin],
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

    /**
     * Retrieves the parser used for a particular language id
     */
    private getParserFromLanguageId(languages: PrettierSupportLanguage[], languageId: string): string | undefined {
        const language = languages.find(
            (lang) =>
                lang &&
                lang.extensions &&
                Array.isArray(lang.vscodeLanguageIds) &&
                lang.vscodeLanguageIds.includes(languageId)
        );
        if (language && language.parsers?.length > 0) {
            return language.parsers[0];
        }
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
