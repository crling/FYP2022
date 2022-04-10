import { Component, ComponentOption } from "crux/dist/element";
import {TextOption} from "crux/dist/element/primitive/text";
import { event } from "crux/dist/utils";

interface EditTextOption extends ComponentOption {
    displayTextLength: number;
}
export class EditText extends Component<TextOption & EditTextOption> {
    protected originalText = "";
    protected text = "";

    public init() {
        this.state = {
            activeBand: null,
        };
        event.on("edit-text-done", (_, { text, id }) => {
            if (this.uid === id) {
                // this.setProp({text});
                this.text = text;
                this.redraw();
            }
        });
    }

    public render() {
        return this.t`
            Text {
                @props prop
                text = text
                behavior:tooltip {
                    content = "double click to edit content"
                }
        }`;
    }
    public static propNameForInitializer() {
        return "text";
    }
    public willRender() {
        if (this._firstRender) {
            this.originalText = this.prop.text;
            this.setDisplayText();
            this.$on["dblclick"] = () => {
                event.emit("edit-text-start", {text: this.prop.text,
                    originalText: this.originalText,
                    id: this.uid});
            };
        } else if (this.prop.text !== this.originalText) {
            this.text = this.originalText = this.prop.text;
        }
    }

    protected setDisplayText() {
        if (this.prop.text.length <= this.prop.displayTextLength)
            this.text = this.prop.text;
        else if (this.prop.text.indexOf("_") >= 0) {
            const strs = this.prop.text.split("_");
            let length = 0,
                i = 1,
                text = strs[0];
            while (strs[i] && length + strs[i] <= this.prop.displayTextLength) {
                text = `${text}_${strs[i]}`;
                length += strs[i].length;
                i++;
            }
            this.text = `${text}...`;
        } else {
            this.text = `${this.prop.text.substr(0, this.prop.displayTextLength)}...`;
        }

    }

    public defaultProp() {
        return {
            ...super.defaultProp(),
            displayTextLength: 40,
        };
    }
}
