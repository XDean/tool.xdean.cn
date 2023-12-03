import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { FC, useEffect, useState } from 'react';
import { StreamLanguage } from '@codemirror/language';
import { shader } from '@codemirror/legacy-modes/mode/clike';
import { dracula } from 'thememirror';

export const Editor: FC = () => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref) {
      return;
    }

    const editor = new EditorView({
      doc: '',
      extensions: [
        basicSetup,
        keymap.of([indentWithTab]),
        StreamLanguage.define(shader),
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '16pt',
          },
          '.cm-scroller': {overflow: 'auto'},
        }),
        dracula,
      ],
      parent: ref,
    });
    return () => {
      editor.destroy();
    };
  }, [ref]);
  return (
    <div ref={setRef} className={'full border'}>

    </div>
  );
};