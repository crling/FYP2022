import template from "./template.bvt";

import Crux from "crux";

export class Revolution extends Crux.Component {

    public render = Crux.t`${template}`;

    public init() {
        this.state = {
            aid: null,
        };
    }

    private setActive(aid: string) {
        this.setState({ aid });
    }

}
