'use client';

import Notes from './Notes';
import { SelectionBoxProvider } from './SelectionContext';
import SelectionBox from './SelectionBox';

export default function SelectableNotes() {
  return (
    <SelectionBoxProvider>
      <Notes />
      <SelectionBox />
    </SelectionBoxProvider>
  );
} 