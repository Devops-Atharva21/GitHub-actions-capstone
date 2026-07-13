# Day 48 – GitHub Actions Capstone Project

## Objective

Build a complete CI/CD pipeline using GitHub Actions by combining reusable workflows, Docker, pull request validation, automated deployment, scheduled health checks, and documentation.

---

# Task 1: Set Up the Project Repository

## Goal

Create a project repository that will be used throughout the capstone.

### Steps

* Create a new repository:

  * `github-actions-capstone`
  * *(or use your existing `github-actions-practice` repository)*

* Add a simple application. Choose one:

  * Python Flask application
  * Python FastAPI application
  * Node.js Express application
  * Dockerized application from Day 36

* The application should expose at least one endpoint.

Example:

```
GET /
```

or

```
GET /health
```

### Add a Dockerfile

Containerize the application using Docker.

### Add Basic Tests

Examples:

* Unit test
* API test
* Script that curls the `/health` endpoint

### Create README.md

Include:

* Project description
* Technology stack
* How to run locally
* Docker build instructions
* GitHub Actions overview

---

# Task 2: Reusable Workflow – Build & Test

## File

```
.github/workflows/reusable-build-test.yml
```

## Trigger

```
workflow_call
```

## Inputs

| Input                         | Type    | Description     |
| ----------------------------- | ------- | --------------- |
| python_version / node_version | String  | Runtime version |
| run_tests                     | Boolean | Default: true   |

## Workflow Steps

1. Checkout repository
2. Setup runtime
3. Install dependencies
4. Build application
5. Run tests *(only if run_tests is true)*
6. Set output

```
test_result = passed
```

or

```
test_result = failed
```

### Purpose

This reusable workflow performs only:

* Build
* Test

It **does not** deploy the application.

---

# Task 3: Reusable Workflow – Docker Build & Push

## File

```
.github/workflows/reusable-docker.yml
```

## Trigger

```
workflow_call
```

## Inputs

| Input      | Type   |
| ---------- | ------ |
| image_name | String |
| tag        | String |

## Secrets

* docker_username
* docker_token

## Workflow Steps

1. Checkout repository
2. Login to Docker Hub
3. Build Docker image
4. Push Docker image
5. Set output

```
image_url
```

Example:

```
dockeratharva29/github-actions-capstone:latest
```

---

# Task 4: Pull Request Pipeline

## File

```
.github/workflows/pr-pipeline.yml
```

## Trigger

```
pull_request
```

Branch:

```
main
```

Types:

* opened
* synchronize

## Workflow

### Job 1

Call reusable build-test workflow.

```
run_tests: true
```

### Job 2

```
pr-comment
```

Runs after Job 1.

Print:

```
PR checks passed for branch: <branch-name>
```

### Expected Result

When a Pull Request is opened:

* Build runs
* Tests run
* No Docker image is built
* No Docker image is pushed
* No deployment occurs

---

# Task 5: Main Branch Pipeline

## File

```
.github/workflows/main-pipeline.yml
```

## Trigger

```
push
```

Branch:

```
main
```

---

## Job 1

Call reusable Build & Test workflow.

---

## Job 2

Depends on Job 1.

Call reusable Docker workflow.

Tags:

```
latest
```

and

```
sha-<short-commit-hash>
```

Example:

```
latest
sha-a4f92bc
```

---

## Job 3

Depends on Job 2.

Deployment job.

Environment:

```
production
```

Deployment message:

```
Deploying image:
<image_url>
to production
```

If Environment Protection Rules are enabled:

* Manual approval is required before deployment.

### Expected Pipeline

```
Push to main

↓

Build

↓

Test

↓

Docker Build

↓

Docker Push

↓

Deploy
```

---

# Task 6: Scheduled Health Check

## File

```
.github/workflows/health-check.yml
```

## Triggers

### Scheduled

```
0 */12 * * *
```

Runs every 12 hours.

### Manual

```
workflow_dispatch
```

---

## Workflow Steps

1. Pull latest Docker image

2. Run container

```
docker run -d
```

3. Wait 5 seconds

4. Curl health endpoint

```
curl http://localhost:3000/health
```

5. Print

```
PASSED
```

or

```
FAILED
```

6. Stop container

7. Remove container

---

## GitHub Step Summary

Generate workflow summary.

```
## Health Check Report

- Image: myapp:latest
- Status: PASSED
- Time: <current date & time>
```

---

# Task 7: Badges & Documentation

## README.md

Add workflow status badges for:

* Build & Test
* PR Pipeline
* Main Pipeline
* Health Check

---

## Pipeline Architecture

```
                 Pull Request
                      │
                      ▼
              Build & Test
                      │
                      ▼
              PR Checks Passed


Merge to Main Branch
          │
          ▼
     Build & Test
          │
          ▼
 Docker Build & Push
          │
          ▼
      Deploy to Production


Every 12 Hours
       │
       ▼
 Pull Latest Docker Image
       │
       ▼
 Start Container
       │
       ▼
 Health Check
       │
       ▼
 Stop & Remove Container
       │
       ▼
 Generate Workflow Summary
```

---

# Key GitHub Actions Concepts Learned

* Reusable Workflows
* `workflow_call`
* Workflow Inputs
* Workflow Outputs
* Job Dependencies
* Docker Build & Push
* Docker Hub Authentication
* Pull Request Pipelines
* Main Branch Pipelines
* Environment Protection Rules
* Manual Deployment Approval
* Scheduled Workflows (Cron)
* Health Checks
* GitHub Step Summary
* Workflow Badges
* CI/CD Pipeline Design

---

# Outcome

By completing this capstone project, you will have built a production-style GitHub Actions CI/CD pipeline featuring reusable workflows, automated testing, Docker image creation, Docker Hub integration, controlled production deployments, scheduled health monitoring, and comprehensive project documentation.

