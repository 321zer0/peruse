import type { CommentRequest, CommentResult, CommentData } from "./types.js";
import { validateCommentRequest } from './validation.js';
import { createCommit } from './github.js';
import { v6 as uuidv6 } from 'uuid';
import { createHash } from 'crypto';

export async function createComment(request: CommentRequest): Promise<CommentResult> {
    const validationError = validateCommentRequest(request);

    if (validationError !== null) {
        return {
            success: false,
            statusCode: 422,
            error: validationError
        }
    }

    const commentData: CommentData = {
        _id: uuidv6(),
        name: request.name,
        email: createHash('sha256').update(request.email.trim().toLowerCase()).digest('hex'),
        email_real: request.email,
        reply_to: request.replyTo,
        comment: request.comment,
        date: new Date().toISOString(),
    };

    const commitResult = await createCommit(request, commentData);

    return {
        success: commitResult.success,
        statusCode: commitResult.statusCode,
        error: commitResult.error
    }
}