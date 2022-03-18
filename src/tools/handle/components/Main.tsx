import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { Game } from '../game';
import { filter4ChineseChar } from '../util';
import { GameView } from './Game';

export const HandleMain = () => {
  const [game, setGame] = useState<Game>();
  const [nextGame, setNextGame] = useState<Game>();
  const router = useRouter();

  useEffect(() => {
    Game.fetchGame().then(setNextGame);
  }, []);

  useEffect(() => {
    if (!game && router.isReady) {
      const answer = router.query.answer;
      console.log(answer, typeof answer, Number.isInteger(answer));
      if (!!answer && typeof answer === 'string') {
        if (Number(answer)) {
          Game.fetchGame(answer).then(setGame);
          return;
        } else {
          const idiom = filter4ChineseChar(answer);
          if (idiom.length === 4) {
            setGame(new Game(idiom));
            return;
          }
        }
      }
      Game.fetchGame().then(setGame);
    }
  }, [router]);

  useEffect(() => {
    if (game?.details) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          answer: game.details.id,
        },
      }, '', {
        shallow: true,
      });
    }
  }, [game]);

  const onRestart = useCallback(() => {
    setGame(undefined);
    if (!!nextGame) {
      setGame(nextGame);
    } else {
      Game.fetchGame().then(setGame);
    }
    setNextGame(undefined);
    Game.fetchGame().then(setNextGame);
  }, [nextGame]);

  if (!game) {
    return <Loader className={'mx-auto'}/>;
  }

  return (
    <GameView game={game}
              onRestart={onRestart}/>
  );
};