import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import { v6 as uuidv6 } from 'uuid';
import { createHash } from 'crypto';
import type { CommentData, CommentRequest } from './types.js';
import { validateCommentRequest } from './validation.js';
import { createCommit } from './github.js';

// Initialize express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const router = express.Router()
router.use(cors())   // Apply express middlewares

// We need to define our function name for express routes to set the correct base path
const functionName = 'comment'
const routerBasePath = process.env.NODE_ENV === 'dev' ? `/${functionName}` : `/.netlify/functions/${functionName}/`
app.use(routerBasePath, router)

router.post('/post', async (req, res) => {
    // Leave at the top to ensure we have proper Access Control for all sent responses below
    const allowOrigin = process.env.NODE_ENV === 'dev' ? '*' : 'https://techblog.dev';
    res.setHeader('Access-Control-Allow-Origin', allowOrigin);
    
    // TODO: Return an error if req.body is null or undefined
    
    const slug = req.body.slug ?? "";
    const name = req.body.name ?? "";
    const email = req.body.email ?? "";
    const replyTo = req.body.replyTo ?? "";
    const comment = req.body.comment ?? "";

    const commentRequest: CommentRequest = {
        slug: slug,
        name: name,
        email: email,
        replyTo: replyTo,
        comment: comment
    };

    const validationError = validateCommentRequest(commentRequest);

    if (validationError !== null) {
        const result = { statusCode: 422, msg: validationError }
        return res.send(JSON.stringify(result));
    }

    const commentData: CommentData = {
        _id: uuidv6(),
        name: name,
        email: createHash('md5').update(email).digest('hex'),
        email_real: email,
        reply_to: replyTo,
        comment: comment,
        date: new Date().toISOString(),
    };

    const commitResult = await createCommit(commentRequest, commentData);

    const errMsg = "There was an error processing your request. Please try again later.";
    const successMsg = "Thank you! Your comment has been received and will be published shortly :)";
    
    const msg = commitResult.success 
        ? successMsg 
        : (commitResult.error ?? errMsg);

    const result = { statusCode: commitResult.statusCode, msg: msg }
    return res.send(JSON.stringify(result));
})

// Export lambda handler
exports.handler = serverless(app)
