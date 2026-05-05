# Notes on Render for CI/CD Module

## Part 1: What is Render

Render is a cloud platform for hosting applications, databases, and static sites. It includes built-in CI/CD functionality. When code is pushed to GitHub, Render automatically deploys the new version.

## Part 2: Connecting Render to a Git Repository

No local installation is required. The process is:

1. Sign up on Render.com using a GitHub account
2. Click New and select Web Service
3. Connect the GitHub repository
4. Render scans the project and auto-detects the programming language

Configuration settings required:
- Build command (example: npm install)
- Start command (example: npm start)

After these settings are saved, every git push triggers a new deployment.

## Part 3: CI/CD Flow on Render

| Step | Action |
|------|--------|
| 1 | Detects a push to the main or master branch |
| 2 | Clones the latest code from GitHub |
| 3 | Runs the build command |
| 4 | Runs the start command |
| 5 | If successful, switches traffic to the new version |
| 6 | If failed, stops the deployment and the old version continues running |

No manual file uploads or server access is required.

## Part 4: Practical Considerations

Port binding: Render expects the application to listen to process.env.PORT. Code must be updated to use this variable.

Environment variables: Secrets such as API keys are set on Render dashboard, not in code. They are injected at runtime.

Deploy logs: Real time logs are available. Failures are displayed with specific error messages.

Auto-deploy: This feature can be disabled for manual control.

## Part 5: Pre-Deployment Checklist

- Application works locally with a PORT environment variable
- Start command runs without errors
- No credentials are hardcoded in the code
- Git push targets the connected branch

Deployment typically takes one to two minutes.

## Part 6: Theoretical Framework

### Where Render Fits in CI/CD

| Phase | Description | Render Role |
|-------|-------------|--------------|
| Continuous Integration | Push code, run tests, merge changes | Triggers the process |
| Continuous Delivery | Build the application and prepare for deployment | Performs this automatically |
| Continuous Deployment | Ship to production without manual approval | Performs this automatically |

Render is strong on continuous delivery and deployment. For continuous integration, tests must be written and configured separately.

### Deployment Pipeline Stages

The internal sequence on each push is:

Git push -> Clone repository -> Install dependencies -> Run build command -> Run tests (if configured) -> Start server -> Health check -> Switch traffic

Each stage acts as a gate. If one stage fails, the pipeline stops. The health check is critical. Render waits for the application to respond before marking it as live.

Render uses blue-green deployment. The new version starts alongside the old version. Traffic switches only when the new version passes the health check. This provides zero downtime.

### Immutable Infrastructure

Each deployment creates a fresh environment. There is no ability to access a server and change files manually. On Render, every deployment is a new container or image. No persistent changes carry over between deployments. If persistent data is required, a separate database such as Render PostgreSQL must be used.

This approach makes deployments repeatable and predictable.

### Build Phase versus Runtime Phase

| Aspect | Build Phase | Runtime Phase |
|--------|-------------|----------------|
| Timing | During git push deployment | After application is running |
| Commands | npm install, npm run build, tests | npm start |
| Environment Variables | Build time variables (example: API endpoints) | Runtime secrets (example: database passwords) |
| Render Configuration | Build command setting | Start command setting |

A proper CI/CD platform separates these phases. Render provides clear separation.

### Deployment Trigger Methods

| Trigger Type | Mechanism on Render |
|--------------|---------------------|
| Push trigger | Git push to connected branch triggers auto-deployment |
| Manual trigger | Click Deploy Latest Commit in dashboard |
| Schedule trigger | Cron job deployment at specified times (paid plans) |

This represents event-driven versus time-driven CI/CD.

### Rollback Mechanism

When a new deployment fails health checks, Render keeps the old version running. A rollback can be performed by clicking Rollback to a previous deployment. This redeploys the old container or image. Render stores older versions temporarily. This is called artifact retention.

### Limitations of Render from a Theoretical Perspective

| Missing Feature | Alternative Learning Requirement |
|-----------------|----------------------------------|
| Artifact storage | Real CI/CD systems require explicit artifact management using Docker registry or S3 |
| Complex pipelines | Real pipelines can include parallel stages and conditional steps |
| Self-hosted runners | Real work environments may require own build servers for security or speed |

## Part 7: Theory Summary Table

| Concept | Definition | Render Implementation |
|---------|------------|------------------------|
| Continuous Integration | Automatic testing and merging of code | Runs test command if configured |
| Continuous Delivery | Automatic preparation for deployment | Builds container from code |
| Continuous Deployment | Automatic production release | Pushes to production |
| Pipeline | Sequence of automated steps | Build, test, start, health check |
| Immutable Infrastructure | Fresh environment per deployment | New container each time |
| Rollback | Return to previous working version | Redeploys old image from storage |

## Part 8: Core Learning Summary

Render is a managed CI/CD platform. It follows the same theoretical principles as Jenkins, GitLab CI, and GitHub Actions but abstracts away server management. Understanding why Render requires a build command, a start command, and a health check provides the foundation for understanding any continuous delivery system. The tools change but the theory remains consistent.