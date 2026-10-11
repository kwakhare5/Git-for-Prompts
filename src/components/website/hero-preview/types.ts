import { PromptWithStats } from '@/components/domain/dashboard/prompt-repositories-list';

export const DEMO_PROMPTS: PromptWithStats[] = [
  {
    id: 'demo-1',
    name: 'security-audit-v2',
    description: 'Automated vulnerability scanning and CWE classification for Node & Python apps.',
    versionCount: 3,
    testsPassed: 12,
    testsTotal: 12,
    isPublic: false,
    updatedAt: '2026-08-22T08:30:00.000Z',
  },
  {
    id: 'demo-2',
    name: 'customer-support-agent',
    description: 'Tone-calibrated customer response generator with strict refund guardrails.',
    versionCount: 5,
    testsPassed: 23,
    testsTotal: 24,
    isPublic: true,
    updatedAt: '2026-08-21T05:00:00.000Z',
  },
  {
    id: 'demo-3',
    name: 'code-reviewer-pro',
    description: 'Strict TypeScript and Rust code review agent with security audit rules.',
    versionCount: 4,
    testsPassed: 18,
    testsTotal: 18,
    isPublic: false,
    updatedAt: '2026-08-20T10:00:00.000Z',
  },
];
