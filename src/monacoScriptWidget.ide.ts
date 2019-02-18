// automatically import the css file
import {TWWidgetDefinition, description, autoResizable, property, defaultValue, bindingTarget, service, event, bindingSource} from 'typescriptwebpacksupport';

@description('A widget for displaying and editing code')
@TWWidgetDefinition('Monaco Code Editor', autoResizable)
class MonacoCodeEditorWidget extends TWComposerWidget {

    widgetIconUrl(): string {
        return require('./images/icon.png');
    }

    /**
     * Represents the total width of the widget.
     */
    @description('The total width of the widget')
    @property ('NUMBER', defaultValue(90)) Width: number;

    /**
     * Represents the total height of the widget.
     */
    @description('The total height of the widget')
    @property ('NUMBER', defaultValue(180)) Height: number;

    /**
     * The code currently displayed in the editor
     */
    @property ('STRING', defaultValue(''), bindingTarget, bindingSource) Code: string;

    /**
     * The language the code should be formatted with
     */
    @property ('STRING', defaultValue(''), bindingTarget) Language: string;

    /**
     * Can the developer edit the code
     */
    @property ('BOOLEAN', defaultValue(true), bindingTarget) ReadOnly: boolean;

    /**
     * Automatically format the code.
     */
    @description('Format the entire document')
    @service Format: any;

    /**
     * Automatically place the code in the clipboard
     */
    @description('Copy the entire document')
    @service Copy: any;

    /**
     * Triggers when the code in the editor has been changed
     */
    @event Changed: any;

    widgetProperties(): TWWidgetProperties {
        return super.widgetProperties();
    };

    renderHtml(): string {
        require("./styles/ide.css");
        return '<div class="widget-content widget-monaco-editor"></div>';
    };

    afterRender(): void {
    }

    beforeDestroy(): void {
    }

}