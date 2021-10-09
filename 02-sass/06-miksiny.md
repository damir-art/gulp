# Миксины

    @mixin flex($justifyContent) {
        display: flex;
        flex-wrap: wrap;
        justify-content: $justifyContent;
    }

    .wrapper {
        @include flex('space-between')
    }
