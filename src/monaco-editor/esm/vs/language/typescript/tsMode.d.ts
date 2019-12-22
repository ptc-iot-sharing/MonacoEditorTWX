import { TypeScriptWorker } from './tsWorker';
import { LanguageServiceDefaultsImpl } from './monaco.contribution';
import Uri = monaco.Uri;
export declare function setupNamedLanguage(languageName: string, isTypescript: boolean, defaults: LanguageServiceDefaultsImpl): void;
export declare function getNamedLanguageWorker(languageName: string): Promise<(first: Uri, ...more: Uri[]) => Promise<TypeScriptWorker>>;
