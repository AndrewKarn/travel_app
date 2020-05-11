// Basic validation, we don't need to submit war and peace here.
function checkFormData(input) {
    return input.length <= 500;
}

export {checkFormData}
