import { Loader } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { Game } from '../game';
import { GameView } from './Game';

export const HandleMain = () => {
  const [game, setGame] = useState<Game>();
  const [nextGame, setNextGame] = useState<Game>();

  const onRestart = useCallback(() => {
    setGame(undefined);
    if (!!nextGame) {
      setGame(nextGame);
    } else {
      Game.newGame().then(setGame);
    }
    setNextGame(undefined);
    Game.newGame().then(setNextGame);
  }, [nextGame]);

  useEffect(() => {
    Game.newGame().then(setGame);
    Game.newGame().then(setNextGame);
  }, []);

  if (!game) {
    return <Loader className={'mx-auto'}/>;
  }

  return (
    <GameView game={game}
              onRestart={onRestart}/>
  );
};