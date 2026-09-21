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


import { CommentRequest } from "./types.js";

export function validateCommentRequest(request: CommentRequest): string | null {
    if (request.slug.trim() === "") {
        return "Error: slug cannot be empty.";
    }

    if (request.name.trim() === "") {
        return "Error: name cannot be empty.";
    }

    if (request.email.trim() === "") {
        return "Error: email cannot be empty.";
    }

    if (request.comment.trim() === "") {
        return "Error: comment cannot be empty.";
    }

    if (request.name.length > 25) {
        return "Error: name cannot be more than 25 characters.";
    }

    if (request.email.length > 60) {
        return "Error: email cannot be more than 60 characters.";
    }

    // TODO: Validate slug (Directory should exist under /contents/posts)
    // TODO: Validate name (Alphabet only)
    // TODO: Validate email (Alphanumeric OR . OR @, Start and end with alphabet only, contain @ character only once, contain at least one period)
    // TODO: Validate reply_to (should be a valid _id which exists in a file under /contents/data/comments/slug)
    // TODO: Sanitize comment (Use HTMLEncode to prevent embedding external content)

    return null;
}