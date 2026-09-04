/**
 * Eval — provider-agnostic evaluation runner for @gfp/core.
 *
 * The core eval engine does NOT know about Groq, OpenRouter, or any
 * specific AI provider. Consumers inject an AIProvider implementation.
 *
 * Cloud (Next.js): injects Groq/OpenRouter via src/lib/ai.ts
 * Local (CLI): injects user's own API key provider
 *
 * This module extracts the orchestration logic from src/lib/test-runner.ts
 * while leaving the DB-specific persistence in the cloud app.
 */
import type { PromptBundle } from './bundle.js';
export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};
/**
 * Minimal AI provider contract.
 * Any OpenAI-compatible API can satisfy this interface.
 */
export interface AIProvider {
    /**
     * Send messages to an AI model and get a text response.
     * @param messages - Chat messages to send
     * @param config - Optional overrides (model, temperature, json mode)
     */
    chat(messages: ChatMessage[], config?: {
        model?: string;
        temperature?: number;
        jsonMode?: boolean;
    }): Promise<string>;
}
export type TestCaseInput = {
    id: string;
    name: string;
    inputText: string;
    expectedCriteria: string;
};
export type EvalAttempt = {
    ok: true;
    testCaseId: string;
    result: {
        passed: boolean;
        actualOutput: string;
        reason: string;
    };
} | {
    ok: false;
    testCaseId: string;
    message: string;
};
/**
 * Robustly extracts the first complete JSON object from a string.
 * Depth-balanced, string/escape-aware. Handles markdown fences, prose.
 */
export declare function extractJson(text: string): unknown;
export declare function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit?: number): Promise<T[]>;
/**
 * Run a single test case end-to-end: execute → evaluate.
 * Deliberately does NOT catch — infrastructure failures must propagate.
 */
export declare function runSingleTestCase(provider: AIProvider, bundle: PromptBundle, testCase: {
    inputText: string;
    expectedCriteria: string;
}): Promise<{
    passed: boolean;
    actualOutput: string;
    reason: string;
}>;
/**
 * Run AI evaluation for every test case against a prompt bundle.
 * Concurrency-limited. No DB writes — pure AI orchestration.
 *
 * This is the provider-agnostic equivalent of src/lib/test-runner.ts runEvaluations.
 */
export declare function runEvaluations(provider: AIProvider, bundle: PromptBundle, cases: TestCaseInput[], concurrency?: number): Promise<EvalAttempt[]>;
//# sourceMappingURL=eval.d.ts.map