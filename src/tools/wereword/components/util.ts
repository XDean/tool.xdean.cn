import {useEffect, useState} from 'react';
import {ReturnedValue} from 'use-sound/dist/types';
import useSound from 'use-sound';

export const useBindSound = (deps?: any[]) => {
  const [lastPlay, setLastPlay] = useState<ReturnedValue>();
  useEffect(() => () => lastPlay && lastPlay[1].stop(), [lastPlay]);
  return function useSingleSound(url: string, match: () => boolean, moreDeps?: any[]) {
    const sound = useSound(url);
    useEffect(() => {
      if ((!lastPlay || lastPlay[0] != sound[0]) && match()) {
        setLastPlay(sound);
        sound[0]();
      }
    }, [...(deps || []), ...(moreDeps || []), sound[0]]);
  };
};