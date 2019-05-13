export const styles = `
:host {
    display: block;
    text-align: center;
}

.input-group {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: stretch;
    align-items: stretch;
    width: 100%;
    max-height: 36px;
    border: 1px solid #ededed;
}

.input-group > input {
    all: initial;
    position: relative;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    width: 1%;
    margin-bottom: 0;
    padding: 0 0 0 12px;
    max-height: 36px;
}

.input-group > button {
    all: initial;
    max-height: 36px;
}

.input-group > button:hover {
    cursor: pointer;
}

img {
    max-height: 36px;
}
`;
