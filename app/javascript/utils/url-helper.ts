class URLBuilder {
    private components: string[];

    constructor(components: string[] = []) {
        this.components = components;
    }

    index(): URLBuilder {
        return this;
    }

    new(): URLBuilder {
        return new URLBuilder(this.components.concat(["new"]));
    }

    edit(): URLBuilder {
        return new URLBuilder(this.components.concat(["edit"]));
    }

    show(id: number|string): URLBuilder {
        return new URLBuilder(this.components.concat([id.toString()]));
    }

    _(arg1: string, arg2: string): URLBuilder {
        let array;
        if (typeof arg2 === "undefined") {
            array = [arg1];
        } else {
            array = [arg1, arg2]
        }
        return new URLBuilder(this.components.concat(array));
    }

    toString(): string {
        return "/" + this.components.join("/");
    }

}

function url(arg1, arg2) {
    return new URLBuilder()._(arg1, arg2);
}

export default url;

// url("projects", 3) => "/projects/3"
// url("user", 3)._("projects", 3).edit() => "/users/2/projects/3/edit"
