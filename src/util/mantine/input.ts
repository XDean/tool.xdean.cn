import { NumberInputProps } from '@mantine/core/lib/components/NumberInput/NumberInput';

export const thousandFormatter: NumberInputProps['formatter'] = (value = '') => {
  if (Number.isNaN(parseFloat(value))) {
    return value === '-' ? '-' : '';
  } else {
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
};
export const thousandParser: NumberInputProps['parser'] = (value) => value?.replace(/\$\s?|(,*)/g, '');