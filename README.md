# GitHub Actions Status

![Main Pipeline](https://github.com/dockeratharva29/GitHub-actions-capstone/actions/workflows/main-pipeline.yml/badge.svg)

![PR Checks](https://github.com/dockeratharva29/GitHub-actions-capstone/actions/workflows/pr-checks.yml/badge.svg)

![Health Check](https://github.com/dockeratharva29/GitHub-actions-capstone/actions/workflows/health-check.yml/badge.svg)

                           GitHub Actions CI/CD Pipeline

                        Pull Request Opened
                                │
                                ▼
                     Build & Test (Reusable Workflow)
                                │
                                ▼
                        PR Validation Checks
                                │
                         Checks Passed ✅
                                │
                                ▼
                          Merge into main
                                │
                                ▼
                     Build & Test (Reusable Workflow)
                                │
                                ▼
                    Docker Build & Push Workflow
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 ▼                             ▼
         Tag: latest                 Tag: sha-<commit>
                 │                             │
                 └──────────────┬──────────────┘
                                ▼
                     Deploy to Production
                                │
                    Manual Approval (Optional)
                                │
                                ▼
                     Production Deployment

────────────────────────────────────────────────────────────

              Every 12 Hours (Scheduled Workflow)

                                │
                                ▼
                     Pull Latest Docker Image
                                │
                                ▼
                       Start Docker Container
                                │
                                ▼
                          Health Check (curl)
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
                 PASSED                  FAILED
                    │                       │
                    └───────────┬───────────┘
                                ▼
                   Stop & Remove Container
                                │
                                ▼
                  Generate GitHub Step Summary
