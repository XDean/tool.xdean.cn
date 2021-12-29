import {CSSProperties} from "react";

const TopImage = ({url, style}: { url: string, style?: CSSProperties }) => (
  <div className={'h-40 w-40 md:h-64 md:w-64 text-center m-auto bg-contain bg-no-repeat rounded-2xl'}
       style={{...style, backgroundImage: `url(${url})`}}/>
)

export const WerewordImages = {
  Logo: () => <TopImage url={'/tools/wereword/logo_192.webp'}/>,
  Cunzhang: () => <TopImage url={'/tools/wereword/cards.webp'} style={{
    backgroundColor: 'black',
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSize: '500%',
  }}/>,
  Langren: () => <TopImage url={'/tools/wereword/cards.webp'} style={{
    backgroundColor: 'black',
    backgroundPositionX: '25%',
    backgroundPositionY: 0,
    backgroundSize: '500%',
  }}/>,
  Xianzhi: () => <TopImage url={'/tools/wereword/cards.webp'} style={{
    backgroundColor: 'black',
    backgroundPositionX: '50%',
    backgroundPositionY: 0,
    backgroundSize: '500%',
  }}/>,
  Correct: () => <TopImage url={'/tools/wereword/cards.webp'} style={{
    backgroundPositionX: '50%',
    backgroundPositionY: '100%',
    backgroundSize: '500%',
  }}/>,
  NoToken: () => <TopImage url={'/tools/wereword/cards.webp'} style={{
    backgroundPositionX: '75%',
    backgroundPositionY: '100%',
    backgroundSize: '500%',
  }}/>
}