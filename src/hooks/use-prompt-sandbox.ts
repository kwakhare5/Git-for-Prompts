'use client';

import { useState } from 'react';

export interface VersionItem {
  versionNumber: number;
  content: string;
  commitMessage: string;
  createdAt: string;
}

export function usePromptSandbox() {
  const [versions, setVersions] = useState<VersionItem[]>([
    {
      versionNumber: 1,
      content: 'You answer questions about customer returns.',
      commitMessage: 'Initial draft',
      createdAt: '1 hour ago',
    },
    {
      versionNumber: 2,
      content:
        'You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".',
      commitMessage: 'Clarified returns policy',
      createdAt: '10 minutes ago',
    },
  ]);

  const [activeVersionNumber, setActiveVersionNumber] = useState(2);
  const [editorContent, setEditorContent] = useState(
    'You are a polite returns department agent. If the customer received a broken item, offer a full refund. Sign off with "Customer Support Team".'
  );
  const [commitInput, setCommitInput] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'edit' | 'diff' | 'tests' | 'compare'>('edit');
  const [compareVerA, setCompareVerA] = useState(1);
  const [compareVerB, setCompareVerB] = useState(2);
  const [compareStatus, setCompareStatus] = useState<'idle' | 'running' | 'done'>('idle');

  const testCase = {
    name: 'Returns Refund Request',
    input_text: 'I bought shoes yesterday and they arrived with a cracked sole. Can I get my money back?',
    expectedCriteria: 'Must offer a full refund and sign off with "Customer Support Team".',
  };

  const [testResult, setTestResult] = useState<'idle' | 'running' | 'passed' | 'failed'>('idle');
  const [testOutput, setTestOutput] = useState('');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const handleCommitSave = () => {
    if (!editorContent.trim()) return;
    const nextVersion = versions.length + 1;
    const msg = commitInput.trim() || `Update version ${nextVersion}`;

    const newVer: VersionItem = {
      versionNumber: nextVersion,
      content: editorContent,
      commitMessage: msg,
      createdAt: 'Just now',
    };

    setVersions([...versions, newVer]);
    setActiveVersionNumber(nextVersion);
    setCommitInput('');
  };

  const handleRunTestCase = () => {
    setTestResult('running');
    setTestLogs(['[INIT] Running test case...', '[PROMPT] Sending prompt context to eval runner...']);

    setTimeout(() => {
      setTestLogs((prev) => [...prev, '[EVAL] Checking criteria: Must offer full refund...']);
    }, 400);

    setTimeout(() => {
      setTestOutput(
        'Dear Customer,\n\nI am very sorry to hear about your shoes arriving with a cracked sole. We would be glad to process a full refund for your order immediately.\n\nBest regards,\nCustomer Support Team'
      );
      setTestResult('passed');
      setTestLogs((prev) => [...prev, '[PASS] All assertions passed (100% criteria match).']);
    }, 900);
  };

  const handleRunComparison = () => {
    setCompareStatus('running');
    setTimeout(() => {
      setCompareStatus('done');
    }, 800);
  };

  return {
    versions,
    activeVersionNumber,
    setActiveVersionNumber,
    editorContent,
    setEditorContent,
    commitInput,
    setCommitInput,
    activeSubTab,
    setActiveSubTab,
    compareVerA,
    setCompareVerA,
    compareVerB,
    setCompareVerB,
    compareStatus,
    testCase,
    testResult,
    testOutput,
    testLogs,
    handleCommitSave,
    handleRunTestCase,
    handleRunComparison,
  };
}
