# Task

## Set up a monorepo architecture containing 3 modules:

- A Next.js web application (it requires SSR).
- A simpler React Single-Page Application (SPA), rendered on the client side.
- A shared module to fetch user pictures from a remote server.

## Requirements:

- The application must utilize TypeScript to ensure type safety.
- Style the applications using Tailwind CSS.
- Display a few fetched images in each app.
- Fetch user data from:
- GET <https://www.hunqz.com/api/opengrid/profiles/msescortplus>
- Profile pictures source URL:
- <https://www.hunqz.com/img/usr/original/0x0/${url_token}.jpg>
- Address CORS issues appropriately.
- There should be a minimal test coverage for the shared module
- The next.js application should be SEO friendly

## Expectations:

- Use appropriate tooling to manage the monorepo.
- Design the shared code for reusability, maintainability, and testability.
- Demonstrate sound architectural decisions and adherence to best practices.
- Include any infrastructure, tooling, or configuration you consider necessary.

## Bonus features:

- Alternatively, if you have experience, convert the second web app into a simple React Native app, reusing the shared module.
- Mobile-friendliness and responsiveness for the applications
- Ensure web development adheres to accessibility standards.
