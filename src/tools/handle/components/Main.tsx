import { Loader } from '@mantine/core';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { Game } from '../game';
import { filter4ChineseChar } from '../util';
import { GameView } from './Game';
import { ToolLayout } from '../../../components/layout/ToolLayout';
import { Handle } from '../index';
import { BiArrowBack, BiAward, BiHelpCircle } from 'react-icons/bi';
import { IconButton } from '../../../../common/components/icon/IconButton';
import HelpMDX from '../help.mdx';
import { VscGithub, VscHome } from 'react-icons/vsc';
import Link from 'next/link';

export const HandleMain = () => {
  const [mode, setMode] = useState<'help' | 'game' | 'award'>('game');
  const [game, setGame] = useState<Game>();
  const [nextGame, setNextGame] = useState<Game>();
  const router = useRouter();

  useEffect(() => {
    Game.fetchGame().then(setNextGame);
  }, []);

  useEffect(() => {
    if (!game && router.isReady) {
      const answer = router.query.answer;
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
    <ToolLayout
      nav={{
        title: Handle.name,
        left: mode === 'game' ? (
          <div className={'flex space-x-1'}>
            <IconButton onClick={() => setMode('help')}>
              <BiHelpCircle size={24}/>
            </IconButton>
            <IconButton onClick={() => setMode('award')}>
              <BiAward size={24}/>
            </IconButton>
          </div>
        ) : (
          <div className={'flex space-x-1 items-center'}>
            <IconButton onClick={() => setMode('game')}>
              <BiArrowBack size={24}/>
            </IconButton>
            <div>
              返回游戏
            </div>
          </div>
        ),
        right: mode == 'game' ? (
          <div className={'flex space-x-1'}>
            <Link href={'/'}>
              <IconButton>
                <VscHome size={24}/>
              </IconButton>
            </Link>
            <Link href={`https://github.com/XDean/tool.xdean.cn/blob/main/tools/handle`}>
              <IconButton>
                <VscGithub size={24}/>
              </IconButton>
            </Link>
          </div>
        ) : (
          <div>
          </div>
        ),
      }}>
      {mode === 'game' && <GameView game={game} onRestart={onRestart}/>}
      {mode === 'help' && (
        <div className={'flex flex-col items-center mx-auto'}>
          <HelpMDX/>
        </div>
      )}
    </ToolLayout>
  );
};