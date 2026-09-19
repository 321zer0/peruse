import serverless from 'serverless-http'
import express from 'express'
import cors from 'cors'
import type { CommentRequest } from './types.js';
import { createComment } from './service.js';
import type { GitHubConfig } from './github.js';


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

    const commentRequest: CommentRequest = {
        slug: req.body.slug ?? "",
        name: req.body.name ?? "",
        email: req.body.email ?? "",
        replyTo: req.body.replyTo ?? "",
        comment: req.body.comment ?? ""
    };

    const errMsg = "There was an error processing your request. Please try again later.";
    const successMsg = "Thank you! Your comment has been received and will be published shortly :)";

    const owner = process.env.GITHUB_COMMENT_OWNER;
    const repositoryName = process.env.GITHUB_COMMENT_REPO;

    if (!owner || !repositoryName) {
        throw new Error("Error: GitHub comment configuration is missing");
    }

    const githubConfig: GitHubConfig = {
        owner: owner,
        repositoryName: repositoryName,
        dataPath: "data/comments"
    };

    const commentResult = await createComment(commentRequest, githubConfig);
    
    const msg = commentResult.success 
        ? successMsg 
        : (commentResult.error ?? errMsg);

    const result = { statusCode: commentResult.statusCode, msg: msg }
    return res.send(JSON.stringify(result));
})

// Export lambda handler
exports.handler = serverless(app)
