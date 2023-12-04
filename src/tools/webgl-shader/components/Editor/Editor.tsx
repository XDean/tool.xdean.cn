import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { FC, useEffect, useRef, useState } from 'react';
import { StreamLanguage } from '@codemirror/language';
import { shader } from '@codemirror/legacy-modes/mode/clike';
import { dracula } from 'thememirror';
import { StateEffect } from '@codemirror/state';

type Props = {
  fragShader: string
  onFragShaderChange: (v: string) => void
}
export const Editor: FC<Props> = (
  {
    fragShader,
    onFragShaderChange,
  },
) => {
  const instance = useRef<EditorView>();
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
    instance.current = editor;
    return () => {
      instance.current = undefined;
      editor.destroy();
    };
  }, [rootDom]);

  useEffect(() => {
    const currentValue = instance.current?.state.doc.toString() ?? '';
    if (currentValue === fragShader) {
      return;
    }
    instance.current?.dispatch({
      changes: {from: 0, to: currentValue.length, insert: fragShader},
    });
  }, [fragShader]);

  useEffect(() => {
    instance.current?.dispatch({
      effects: StateEffect.reconfigure.of([
        EditorView.updateListener.of((vu) => {
          if (vu.docChanged) {
            const doc = vu.state.doc;
            const value = doc.toString();
            onFragShaderChange(value);
          }
        }),
      ]),
    });
  }, [onFragShaderChange]);

  return (
    <div ref={setRootDom} className={'full border'}>

    </div>
  );
};