export const AnswerView = ({answer}: { answer: string }) => {
  return (
    <div className={'text-6xl h-64 mx-4 text-center'}>
      <div className={'float-left'} style={{textOrientation: 'sideways', writingMode: 'vertical-rl'}}>
        {answer}
      </div>
      <div className={'float-right transform rotate-180'}
           style={{textOrientation: 'sideways', writingMode: 'vertical-rl'}}>
        {answer}
      </div>
    </div>
  )
}