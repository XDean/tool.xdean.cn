import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { FC, useEffect, useState } from 'react';
import { StreamLanguage } from '@codemirror/language';
import { shader } from '@codemirror/legacy-modes/mode/clike';
import { dracula } from 'thememirror';
import { StateEffect } from '@codemirror/state';

type Props = {
  value: string
  onChange: (v: string) => void
}
export const Editor: FC<Props> = (
  {
    value,
    onChange,
  },
) => {
  const [instance, setInstance] = useState<EditorView>();
  const [rootDom, setRootDom] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!rootDom) {
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
      parent: rootDom,
    });
    setInstance(editor);
    return () => {
      setInstance(undefined);
      editor.destroy();
    };
  }, [rootDom]);

  useEffect(() => {
    const currentValue = instance?.state.doc.toString() ?? '';
    if (currentValue === value) {
      return;
    }
    instance?.dispatch({
      changes: {from: 0, to: currentValue.length, insert: value},
    });
  }, [instance, value]);

  useEffect(() => {
    instance?.dispatch({
      effects: StateEffect.appendConfig.of([
        EditorView.updateListener.of((vu) => {
          if (vu.docChanged) {
            const doc = vu.state.doc;
            const value = doc.toString();
            onChange(value);
          }
        }),
      ]),
    });
  }, [onChange, instance]);

  return (
    <div ref={setRootDom} className={'full border'}/>
  );
};