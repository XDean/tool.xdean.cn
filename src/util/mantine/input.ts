import { NumberInputProps } from '@mantine/core/lib/components/NumberInput/NumberInput';

export const thousandFormatter: NumberInputProps['formatter'] = (value) =>
  !Number.isNaN(parseFloat(value ?? ''))
    ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : (value === '-' ? '-' : '');
export const thousandParser: NumberInputProps['parser'] = (value) => value?.replace(/\$\s?|(,*)/g, '');