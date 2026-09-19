import { describe, expect, it } from "vitest";
import { validateCommentRequest } from "../src/validation.js";

describe("validateCommentRequest", () => {
    // Happy path
    it("accepts a valid comment request", () => {
        const request = {
            slug: "sample-post",
            name: "Alice",
            email: "alice@website.com",
            replyTo: "",
            comment: "Nice blog :)"
        };

        expect(validateCommentRequest(request)).toBeNull();
    });
});