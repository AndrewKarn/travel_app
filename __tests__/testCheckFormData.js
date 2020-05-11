import {checkFormData} from "../src/client/js/checkFormData";
import {describe, expect} from "@jest/globals";

describe("testCheckFormData", () => {

    test("It should not allow input above 500 characters", () => {
        expect(checkFormData("a" * 501)).toEqual(false);
    });
});