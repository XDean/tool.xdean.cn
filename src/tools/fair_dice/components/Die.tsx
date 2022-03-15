import clsx from "clsx";

export type DieProps = {
  value: number
  className?: string
}

export const Die = ({value, className}: DieProps) => {
  return (
    <div className={clsx('border-2 border-black rounded-lg', className ?? 'w-16 h-16')}>
      <svg viewBox={'0 0 100 100'} filter={'drop-shadow(1px 1px 1px rgb(0 0 0 / 0.3))'}>
        {function () {
          switch (value) {
            case 0:
              return (
                <circle cx={50} cy={50} r={20} fill={'red'} stroke={'black'}/>
              )
            case 1:
              return (
                <>
                  <circle cx={25} cy={50} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={75} cy={50} r={10} fill={'black'} stroke={'black'}/>
                </>
              )
            case 2:
              return (
                <>
                  <circle cx={25} cy={25} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={50} cy={50} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={75} cy={75} r={10} fill={'black'} stroke={'black'}/>
                </>
              )
            case 3:
              return (
                <>
                  <circle cx={25} cy={25} r={10} fill={'red'} stroke={'black'}/>
                  <circle cx={75} cy={25} r={10} fill={'red'} stroke={'black'}/>
                  <circle cx={25} cy={75} r={10} fill={'red'} stroke={'black'}/>
                  <circle cx={75} cy={75} r={10} fill={'red'} stroke={'black'}/>
                </>
              )
            case 4:
              return (
                <>
                  <circle cx={25} cy={25} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={75} cy={25} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={25} cy={75} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={75} cy={75} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={50} cy={50} r={10} fill={'black'} stroke={'black'}/>
                </>
              )
            case 5:
              return (
                <>
                  <circle cx={30} cy={20} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={30} cy={50} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={30} cy={80} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={70} cy={20} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={70} cy={50} r={10} fill={'black'} stroke={'black'}/>
                  <circle cx={70} cy={80} r={10} fill={'black'} stroke={'black'}/>
                </>
              )
          }
          return null
        }()}
      </svg>
    </div>
  )
}