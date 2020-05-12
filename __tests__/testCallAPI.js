import {postServer} from '../src/client/js/callAPI'

describe('Test, that it is a function', () => {
    test('Expect TypeOf function to be true', async () => {
        expect(typeof postServer).toBe("function");
    });
});