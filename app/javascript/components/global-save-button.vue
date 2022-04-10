<template>
<!-- eslint-disable max-len -->
<div class="save-btn-container">
    <b-btn class="save-btn btn-vivid-shadow" :variant="saveBtnVariant" size="lg"
        @click="$emit('click')">
        <template v-if="status === 'saving'">
            <i class="fas fa-circle-notch fa-spin"></i>
        </template>
        <template v-else-if="status === 'saved'">
            <i class="fas fa-check"></i>Saved
        </template>
        <template v-else-if="status === 'error'">
            <i class="fas fa-times"></i>Error
        </template>
        <template v-else>
            <i class="fas fa-save"></i>Save All Changes
        </template>
    </b-btn>
</div>
</template>

<script>
export default {
    props: {
        status: {
            type: String,
            default: 'pending',
        },
    },
    data() {
        return {
        };
    },
    computed: {
        saveBtnVariant() {
            return { saved: 'success', error: 'danger' }[this.status] || 'primary';
        },
    },
};
</script>

<style lang="sass">
.save-btn-container {
	position: fixed;
	bottom: 6rem;
	left: 3rem;
	right: 0;
	height: 0;
	z-index: 600;
	text-align: center;
}

.save-btn-container .save-btn {
	border-radius: 10rem;
	font-size: 1rem;
	width: 175px;
	transition: all 0.3s;
}

#main.with-sidebar .save-btn-container {
	left: 220px;
}
</style>
