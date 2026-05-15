# Notes on GitHub Actions for CI/CD Module

## Part 1: What is GitHub Actions

GitHub Actions is a CI/CD tool built directly into GitHub. Unlike Render which is a hosting platform, GitHub Actions only runs the automation pipeline. It does not host or deploy the application by itself. It triggers on GitHub events like push, pull request, or schedule.

## Part 2: Core Components Explained During Class

### Workflow
A workflow is an automated process defined by a YAML file. One repository can have multiple workflows. Each workflow runs based on a trigger event.

### Event
An event is the activity that starts a workflow. Examples include push, pull request, issue creation, or schedule using cron syntax.

### Job
A job is a set of steps that run on the same runner. Jobs can run in parallel by default. If one job depends on another, that must be specified explicitly.

### Step
A step is a single task within a job. Each step runs as its own process. Steps can run shell commands or use actions from the marketplace.

### Action
An action is a reusable unit of code. The marketplace contains thousands of pre-built actions. Examples include checking out code, setting up Node.js, or deploying to AWS.

### Runner
A runner is a server that executes the workflow. GitHub provides hosted runners with Ubuntu, Windows, and macOS. Self-hosted runners can also be configured on personal infrastructure.

## Part 3: Where GitHub Actions Fits in CI/CD

| Phase | Role of GitHub Actions |
|-------|------------------------|
| Continuous Integration | Runs tests, linters, and builds on every push or pull request |
| Continuous Delivery | Builds artifacts and prepares deployment packages |
| Continuous Deployment | Pushes artifacts to hosting platforms like Render, AWS, or Azure |

The key distinction from Render is that GitHub Actions does not host the final application. It only automates the pipeline.

## Part 4: Workflow File Structure

The file must be placed in .github/workflows/ with a .yml or .yaml extension.

Basic structure:

name: Workflow Name
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run a command
        run: echo "Hello World"

## Part 5: Common Events Covered in Class

| Event | Use Case |
|-------|----------|
| push | Run tests whenever code is pushed to a branch |
| pull_request | Run checks before merging a pull request |
| schedule | Run workflows at specific times using cron syntax |
| workflow_dispatch | Manually trigger workflow from GitHub interface |

## Part 6: Key Practical Points

The checkout action is always required as the first step of any job that needs access to repository code. Without it, the runner has no access to the source files.

Environment variables can be defined at workflow, job, or step level. Secrets must be stored in repository settings under Secrets and variables.

Matrix strategy allows running the same job with multiple configurations. For example, testing on Node.js versions 16, 18, and 20 in parallel.

Artifacts are files generated during a workflow such as build outputs or test reports. They can be uploaded and shared between jobs or downloaded later.

Caching dependencies reduces workflow run time. The setup actions for Node.js, Python, and other languages include built-in caching options.

## Part 7: Theoretical Basis

### Event-Driven Automation

GitHub Actions follows an event-driven architecture. Every workflow begins with an event trigger. This is different from scheduled CI/CD systems that run at fixed times. Events can be webhook based from GitHub or external via repository dispatch.

### Ephemeral Runners

Each runner is a fresh environment for every job. No data persists between workflow runs. This provides immutability but means dependencies must be reinstalled each time unless caching is configured.

### Declarative Configuration

Workflows are defined in YAML files stored alongside code. This is infrastructure as code applied to CI/CD pipelines. The configuration is versioned, reviewed, and audited like application code.

### Separation of Concerns

| Component | Responsibility |
|-----------|----------------|
| GitHub Actions | Pipeline automation and testing |
| Hosting Platform (Render, Vercel, AWS) | Application deployment and serving |

GitHub Actions does not deploy directly to production unless configured to do so. The class emphasized this separation.

## Part 8: Class Demonstration Example

The instructor showed a typical Node.js CI workflow:

name: Node.js CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
      - run: npm run build

The instructor explained that this workflow:
- Runs on every push to main branch
- Also runs on every pull request targeting main
- Uses a clean Ubuntu runner
- Checks out the code first
- Sets up Node.js version 18
- Runs npm ci for clean dependency installation
- Runs tests
- Runs build to verify compilation

## Part 9: Comparison with Render from Class Discussion

| Aspect | GitHub Actions | Render |
|--------|----------------|--------|
| Primary purpose | Run CI/CD pipelines | Host and deploy applications |
| Code location | .github/workflows/ | Configurable in dashboard |
| Deployment | Pushes artifacts to external services | Built-in deployment from Git |
| Trigger events | GitHub events, schedule, manual | Git push, manual, schedule |
| Runner environment | Ephemeral per job | Persistent until next deploy |
| Cost model | Free minutes per month for public repos | Free tier with limits |

## Part 10: Limitations Mentioned

GitHub Actions workflows cannot run longer than a certain time limit depending on plan limits. Public repositories have generous free minutes but private repositories consume minutes from account quota.

Self-hosted runners are required for workflows needing specific hardware, operating systems not provided by GitHub, or access to internal corporate networks.

Debugging failed workflows requires checking logs in the Actions tab of the repository. Local testing of workflows is not straightforward unlike Render where local testing uses the same commands as production.

## Part 11: Key Commands and Syntax from Notes

uses: Refers to an action from the marketplace or another repository

run: Executes a shell command directly in the runner

with: Passes parameters to an action

env: Sets environment variables for a step or job

needs: Creates dependency between jobs

if: Conditionally runs a step or job based on expression

## Part 12: Final Summary from Class

GitHub Actions automates everything that happens between pushing code and deploying it. It does not host the final application. The workflow files are version controlled with the code. Each job runs on a fresh runner. Actions are reusable building blocks. For the CI/CD module, GitHub Actions handles the CI part while tools like Render handle the CD part.