<template>
<!-- eslint-disable max-len -->
<div id="alert-center">
    <div class="alert-center-container" >
        <div v-for="alert in alerts" :key="alert.id">
            <div v-if="alert.dismissible">
                <b-alert :variant="alert.variant"
                    dismissible fade :show="alert.dismissCountDown"
                    @dismissed="alert.dismissCountDown = 0"
                    @dismiss-count-down="alert.dismissCountDown = arguments[0]">
                    <div v-html="alert.rendered" />
                    <b-progress :variant="alert.variant" :max="5" :value="alert.dismissCountDown"
                        height="3px" class="progress" />
                </b-alert>
            </div>
            <div v-else>
                <b-alert :variant="alert.variant"
                    dismissible :show="alert.showDismissibleAlert"
                    @dismissed="alert.showDismissibleAlert = false">
                    <div v-html="alert.rendered" />
                </b-alert>
            </div>
        </div>
    </div>
</div>
</template>

<script>
class Alert {
    constructor(opts) {
        Object.assign(this, opts);
        this.dismissCountDown = 5;
        this.showDismissibleAlert = true;
    }

    get rendered() {
        if (this.message instanceof Array) {
            return `<ul>${this.message.map(m => `<li>${m}</li>`).join('')}</ul>`;
        }
        return this.message;
    }
}
export default {
    data() {
        return {
            idCounter: 0,
            alerts: [],
        };
    },
    methods: {
        add(variant, message, dismissible = true) {
            this.alerts.push(new Alert({ variant, message, dismissible, id: this.idCounter }));
            this.idCounter += 1;
        },
    },
};
</script>

<style lang="scss">
#alert-center {
	position: fixed;
	top: 80px;
	right: 50px;
	width: 360px;
}

#alert-center .alert {
	position: relative;
	overflow: hidden;
}

#alert-center .alert ul {
	padding: 0 0 0 1.5rem;
	margin: 0;
}

#alert-center .alert .progress {
	position: absolute;
	bottom: -1px;
	left: -1px;
	right: -1px;
}
</style>
