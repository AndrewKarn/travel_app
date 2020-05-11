import {handleSubmit} from '../src/client/js/formHandler'

describe('Test, that it is a function', () => {
    test('Expect TypeOf function to be true', async () => {
        expect(typeof handleSubmit).toBe("function");
    });
});