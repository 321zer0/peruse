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