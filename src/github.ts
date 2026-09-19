import type { CommentRequest, CommentData } from "./types.js";

export interface GitHubCommitResult {
    success: boolean;
    statusCode: number;
    error: string | null;
}

export interface GitHubConfig {
    owner: string;
    repositoryName: string;
    dataPath: string;
}

export async function createCommit(request: CommentRequest, data: CommentData, config: GitHubConfig): Promise<GitHubCommitResult> {
    const body = {
        message: "New comment in " + request.slug + " by " + request.name,
        committer: {
            name: "Monalisa Octocat",
            email: "octocat@github.com"
        },
        content: btoa(JSON.stringify(data))
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

    // TODO: Add logic to remove any leading and trailing slashes from repoPath to be safe

    const filename = "comment-" + Date.now() + ".json";
    const endpointBase = `https://api.github.com/repos/${config.owner}/${config.repositoryName}/contents`;
    const endpoint = `${endpointBase}/${config.dataPath}/${request.slug}/${filename}`;

    let response: Response;

    try {
        response = await fetch(endpoint, opts);
    }
    catch {
        return {
            success: false,
            statusCode: 500,
            error: "Error processing your request. Please try again later."
        }
    }

    if (!response.ok) {
        return {
            success: false,
            statusCode: response.status,
            error: "Error: Failed to contact API. Please try again later."
        }
    }

    // If success, GitHub API returns an object with "content" and "commit" properties.
    // On failure, GitHub API returns an object with "status" property.
    const responseJson = await response.json();

    if (!Object.hasOwn(responseJson, 'commit')) {
        return {
            success: false,
            statusCode: response.status,
            error: "Error: Failed to create commit."
        };
    }

    return {
        success: true,
        statusCode: response.status,
        error: null
    }
}