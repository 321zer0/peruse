import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import { v6 as uuidv6 } from 'uuid';
import { createHash } from 'crypto';
import { CommentRequest } from './types.js';
import { validateCommentRequest } from './validation.js';

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

    const commentData = {
        _id: uuidv6(),
        name: name,
        email: createHash('md5').update(email).digest('hex'),
        email_real: email,
        reply_to: replyTo,
        comment: comment,
        date: new Date().toISOString(),
    };

    const body = {
        message: "New comment in " + slug + " by " + name,
        comitter: {
            name: "Monalisa Octocat",
            email: "octocat@github.com"
        },
        content: btoa(JSON.stringify(commentData))
    };

    const opts = {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + process.env.GITHUB_COMMENT_PAT,
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        },
        body: JSON.stringify(body)
    };

    const filename = "comment-" + Date.now() + ".json";
    const endpoint_base = "https://api.github.com/repos/321zer0/techblog/contents/data/comments";
    const endpoint = endpoint_base + "/" + slug + "/" + filename;
    
    const errMsg = "Error processing your request. Please try again later.";
    const successMsg = "Thank you! Your comment has been received and will be published shortly :)";

    let statusCode = 0;
    let msg = "";

    const response = await fetch(endpoint, opts)
    .catch((error) => {
        statusCode = 500;
        msg = errMsg + " " + error.statusText;
        return null;
    });

    // Send response in case of exception in the above fetch request
    if (response === null)
    {
        let result = { statusCode: statusCode, msg: msg }
        return res.send(JSON.stringify(result));
    }

    if (response.ok)
    {
        // If success, GitHub API returns an object with "content" and "commit" properties.
        // On failure, GitHub API returns an object with "status" property.
        const data = await response.json() as any;
        statusCode = Object.hasOwn(data, 'commit') ? 200 : 422;
        msg = Object.hasOwn(data, 'commit') ? successMsg : errMsg;

        if (statusCode >= 400)
        {
            msg = Object.hasOwn(data, 'status') ? data.status : errMsg;
        }
    }
    else
    {
        statusCode = response.status;
        msg = "Error: Failed to contact API. Please try again later.";
    }

    let result = { statusCode: statusCode, msg: msg }
    return res.send(JSON.stringify(result));
})

// Export lambda handler
exports.handler = serverless(app)
