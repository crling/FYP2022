/// <reference types="ace" />
import axios from "axios";
import * as $ from "jquery";

declare global {
    interface Window {
        ace: AceAjax.Ace;
    }
}
function addRmBtnAction() {
    $(".btn-rm-opt").each(function() {
        const rmBtn = $(this);
        const group = rmBtn.parents(".input-group");
        rmBtn.off("click").on("click", () => {
            group.remove();
        });
    });
}

function fixIndex() {
    $(".form-opt-container .input-group.fresh").each(function() {
        const optGroup = $(this);
        const index = optGroup.index().toString();
        optGroup.find("[name]").each(function() {
            const input = this as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            input.name = input.name.replace(/_id_/g, index);
        });
        optGroup.removeClass("fresh");
    });
}

function axiosConfig(multipart: boolean = false) {
    const config = {
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]').content,
        },
    };
    if (multipart) {
        config.headers["Content-Type"] = "'multipart/form-data'";
    }
    return config;
}

document.addEventListener("DOMContentLoaded", () => {
    $(".btn-add-opt").each(function() {
        const addBtn = $(this);
        const container = addBtn.siblings(".form-opt-container")[0];
        const template = addBtn.siblings("template")[0] as HTMLTemplateElement;
        addBtn.on("click", (e) => {
            container.appendChild(document.importNode(template.content, true));
            addRmBtnAction();
            fixIndex();
        });
    });

    // sortable list
    const lists = $(".sortable-list");
    if (lists.length > 0) {
        const sortable = require("sortablejs");
        lists.each(function() {
            const list = $(this);
            console.log(sortable);
            sortable.default.create(this, {
                handle: ".drag-handle",
                draggable: ".list-group-item",
                onEnd: (e) => {
                    const position = list.find("li").map((i, e) => $(e).data("id")).get().join(",");
                    axios.post(list.data("update-path"), { position}, axiosConfig());
                },
            });
        });
    }

    $("*[data-ace]").each(function() {
        console.log("test message");
        const input = $(this);
        const form = input.parents("form");
        const mode = input.data("ace-mode");
        const id = input.attr("id");
        const name = input.attr("name");
        const editor = window.ace.edit(id);
        const saveBtn = $(input.data("save-btn"));
        editor.setTheme("ace/theme/eclipse");
        editor.session.setMode("ace/mode/" + mode);
        editor.on("change", () => {
            if (!saveBtn[0]) return;
            saveBtn.val("(Edited) Save")
                .removeClass("btn-secondary")
                .addClass("btn-warning");
        });
        // check json
        form.on("submit", (e) => {
            const value = editor.getValue();
            if (mode === "json" && !isValidJson(value)) {
                e.preventDefault();
                window.alert("Please enter valid JSON.");
                window.setTimeout(() => {
                    form.find("input[type=submit]").prop("disabled", false);
                }, 200);
                return;
            }
            const hiddenInput = $(`<input type='hidden' name='${name}'/>`);
            hiddenInput.appendTo(form);
            hiddenInput.val(value);
            saveBtn.val("Save")
                .removeClass("btn-warning")
                .addClass("btn-secondary");
        });
    });
});

function isValidJson(json) {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}
