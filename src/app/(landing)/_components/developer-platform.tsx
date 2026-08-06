'use client';

import { TestSuiteInfo } from './test-suite-info';
import { SdkSection } from './sdk-section';

export function DeveloperPlatform() {
  return (
    <div id="docs" className="space-y-6">
      <TestSuiteInfo />
      <SdkSection />
    </div>
  );
}
