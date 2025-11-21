# Test Design: Epic 1 - Tetris MVP Implementation

**Date:** 2025-11-21
**Author:** BMad
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 1 (Tetris MVP Implementation)

**Risk Summary:**

- Total risks identified: 5
- High-priority risks (≥6): 3
- Critical categories: TECH, BUS

**Coverage Summary:**

- P0 scenarios: 6 (12 hours)
- P1 scenarios: 4 (4 hours)
- P2/P3 scenarios: 2 (1 hours)
- **Total effort**: 17 hours (~2 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description                                             | Probability | Impact | Score | Mitigation                                              | Owner | Timeline |
| ------- | -------- | ------------------------------------------------------- | ----------- | ------ | ----- | ------------------------------------------------------- | ----- | -------- |
| R-001   | TECH     | Game loop timing inconsistency causing jittery movement | 2           | 3      | 6     | Use `requestAnimationFrame` with delta time calculation | DEV   | Sprint 1 |
| R-002   | BUS      | Incorrect line clearing logic (game doesn't progress)   | 2           | 3      | 6     | Unit test `checkLines` logic with various grid states   | DEV   | Sprint 1 |
| R-003   | BUS      | Collision detection failure (pieces go through walls)   | 2           | 3      | 6     | Comprehensive unit tests for `isValidPosition`          | DEV   | Sprint 1 |

### Medium-Priority Risks (Score 3-4)

| Risk ID | Category | Description                                | Probability | Impact | Score | Mitigation                                  | Owner |
| ------- | -------- | ------------------------------------------ | ----------- | ------ | ----- | ------------------------------------------- | ----- |
| R-004   | BUS      | Scoring logic error (wrong points awarded) | 2           | 2      | 4     | Unit test scoring formula against PRD specs | DEV   |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description                    | Probability | Impact | Score | Action  |
| ------- | -------- | ------------------------------ | ----------- | ------ | ----- | ------- |
| R-005   | PERF     | Rendering lag with many blocks | 1           | 2      | 2     | Monitor |
| R-006   | DATA     | High score persistence failure | 1           | 1      | 1     | Monitor |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement               | Test Level | Risk Link | Test Count | Owner | Notes               |
| ------------------------- | ---------- | --------- | ---------- | ----- | ------------------- |
| Game Loop runs smoothly   | E2E        | R-001     | 1          | QA    | Verify 60fps target |
| Piece Movement (L/R/Down) | Unit       | R-003     | 3          | DEV   | Test boundaries     |
| Rotation (Basic)          | Unit       | R-003     | 1          | DEV   | Test wall kicks     |
| Collision Detection       | Unit       | R-003     | 3          | DEV   | Walls, floor, pile  |
| Line Clearing             | Unit       | R-002     | 2          | DEV   | Single & Multi-line |
| Game Over Condition       | Unit       | -         | 1          | DEV   | Spawn collision     |

**Total P0**: 11 tests, 12 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-4) + Common workflows

| Requirement        | Test Level | Risk Link | Test Count | Owner | Notes                  |
| ------------------ | ---------- | --------- | ---------- | ----- | ---------------------- |
| Scoring System     | Unit       | R-004     | 2          | DEV   | Verify points per line |
| Level Progression  | Unit       | -         | 2          | DEV   | Speed increase check   |
| Next Piece Preview | Component  | -         | 1          | DEV   | Visual check           |
| Audio Feedback     | Component  | -         | 1          | DEV   | Event triggers         |

**Total P1**: 6 tests, 4 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement            | Test Level | Risk Link | Test Count | Owner | Notes             |
| ---------------------- | ---------- | --------- | ---------- | ----- | ----------------- |
| Start Screen UI        | Component  | -         | 1          | QA    |                   |
| Pause Functionality    | Unit       | -         | 1          | DEV   |                   |
| High Score Persistence | Unit       | R-006     | 1          | DEV   | Mock LocalStorage |

**Total P2**: 3 tests, 1 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement           | Test Level | Test Count | Owner | Notes |
| --------------------- | ---------- | ---------- | ----- | ----- |
| Ghost Piece Visual    | Component  | 1          | QA    |       |
| T-Spin Logic (Future) | Unit       | 1          | DEV   |       |

**Total P3**: 2 tests, 0.5 hours

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Game loads without crashing (E2E)
- [ ] Piece spawns and falls (E2E)

**Total**: 2 scenarios

### P0 Tests (<10 min)

**Purpose**: Critical path validation

- [ ] Movement boundaries (Unit)
- [ ] Collision with pile (Unit)
- [ ] Line clear logic (Unit)

**Total**: 3 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage

- [ ] Scoring accuracy (Unit)
- [ ] Level up speed change (Unit)

**Total**: 2 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage

- [ ] UI Components (Component)
- [ ] Persistence (Unit)

**Total**: 2 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority  | Count  | Hours/Test | Total Hours | Notes           |
| --------- | ------ | ---------- | ----------- | --------------- |
| P0        | 11     | 1.0        | 11.0        | Logic intensive |
| P1        | 6      | 0.7        | 4.2         | Standard        |
| P2        | 3      | 0.5        | 1.5         | Simple          |
| P3        | 2      | 0.25       | 0.5         | Exploratory     |
| **Total** | **22** | **-**      | **17.2**    | **~2 days**     |

### Prerequisites

**Test Data:**

- Grid State Factory (create specific board configurations)
- Tetromino Factory (mock pieces)

**Tooling:**

- Vitest (Unit/Component)
- Playwright (E2E)

**Environment:**

- Local Dev Environment

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions)
- **P1 pass rate**: ≥95% (waivers required for failures)
- **High-risk mitigations**: 100% complete or approved waivers

### Coverage Targets

- **Critical paths**: ≥80%
- **Business logic**: ≥90%

---

## Mitigation Plans

### R-001: Game loop timing inconsistency (Score: 6)

**Mitigation Strategy:** Implement delta-time based movement in `GameEngine.update()`.
**Owner:** DEV
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** E2E test checking drop speed consistency.

### R-002: Incorrect line clearing logic (Score: 6)

**Mitigation Strategy:** Test-Driven Development (TDD) for `checkLines()` method.
**Owner:** DEV
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** Unit tests with pre-filled grid states.

### R-003: Collision detection failure (Score: 6)

**Mitigation Strategy:** Comprehensive boundary testing in `GameEngine`.
**Owner:** DEV
**Timeline:** Sprint 1
**Status:** Planned
**Verification:** Unit tests for wall, floor, and block collisions.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: BMad Date: 2025-11-21
- [ ] Tech Lead: BMad Date: 2025-11-21
- [ ] QA Lead: BMad Date: 2025-11-21

**Comments:**

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework
- `probability-impact.md` - Risk scoring methodology
- `test-levels-framework.md` - Test level selection
- `test-priorities-matrix.md` - P0-P3 prioritization

### Related Documents

- PRD: docs/prd.md
- Epic: docs/epics.md
- Tech Spec: docs/tech-spec.md

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
