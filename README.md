# Peruse

Peruse is a TypeScript library that adds commenting functionality on static websites like Hugo.

It provides the core functionality for accepting comments and storing them inside a GitHub repo. Integrations such as Netlify Functions can use this library from an Express handler.

## History

Peruse was originally developed as part of a Hugo blog to provide a simple commenting system without requiring a traditional database or backend application.

The original implementation used JavaScript running as an Express/Netlify Function. This project effectively refactors the old code into a proper TypeScript library so that the commenting functionality can be reused independently of the hosting platform and by others, too.

The project currently provides:
* Comment request validation.
* Comment data generation.
* GitHub-based comment persistence.
* A service API that can be used by different integrations.


## Installation

```bash
pnpm add @321zer0/peruse
```

## Usage

You can use the Peruse library from inside your serverless function's HTTP/Express handler like this:

```ts
import {
    createComment,
    type CommentRequest,
    type GitHubConfig
} from "@321zer0/peruse";

const commentRequest: CommentRequest = {
    slug: req.body.slug ?? "",
    name: req.body.name ?? "",
    email: req.body.email ?? "",
    replyTo: req.body.replyTo ?? "",
    comment: req.body.comment ?? ""
};

const githubConfig: GitHubConfig = {
    owner: process.env.GITHUB_COMMENT_OWNER!,
    repositoryName: process.env.GITHUB_COMMENT_REPO!,
    dataPath: "data/comments"
};

const commentResult = await createComment(commentRequest, githubConfig);

if (commentResult.success) {
    console.log("Comment submitted");
}
else {
    console.log("Error submitting your comment");
}
```

## Development

Install dependencies:

```bash
pnpm install
```

Build:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

## License

Peruse is licensed under the [Apache License 2.0](LICENSE).

Copyright © 2026 Muzaffar Rayyan Auhammud.