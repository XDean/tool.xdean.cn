import { RetireInput } from '../model/retire';
import { FC } from 'react';

type Props = {
  value: RetireInput;
  onChange: (input: RetireInput) => void
};
export const RetireInputForm: FC<Props> = (
  {
    value,
    onChange,
  },
) => {
  return (
    <div className="space-y-4">

    </div>
  );
};