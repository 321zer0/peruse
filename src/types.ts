export interface CommentRequest {
    slug: string;
    name: string;
    email: string;
    replyTo: string;
    comment: string;
}

export interface CommentData {
    _id: string;
    name: string;
    email: string;
    email_real: string;
    reply_to: string;
    comment: string;
    date: string;
}

export interface CommentResult {
    success: boolean;
    statusCode: number;
    error: string | null;
}