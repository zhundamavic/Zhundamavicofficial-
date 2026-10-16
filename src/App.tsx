/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LauncherProvider } from './context/LauncherContext';
import { PhoneFrame } from './components/PhoneFrame';

export default function App() {
  return (
    <LauncherProvider>
      <PhoneFrame />
    </LauncherProvider>
  );
}
