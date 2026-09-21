/*
* Copyright © 2026 Muzaffar Rayyan Auhammud <code@techblog.dev>
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* SPDX-License-Identifier: Apache-2.0
*/


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

    it("rejects an empty slug", () => {
        const request = {
            slug: "",
            name: "Alice",
            email: "alice@website.com",
            replyTo: "",
            comment: "Nice blog :)"
        };

        expect(validateCommentRequest(request)).not.toBeNull();
    });
});