import { orderBy } from 'natural-orderby';
import { useCallback, useMemo, useState } from 'react';
import { DropdownItemProps, DropdownProps } from 'semantic-ui-react';
import { Wanderer } from '../types/wanderers';

enum SortValues {
  Created = 'created',
  Name = 'name',
  Culture = 'culture',
  Sex = 'isFemale',
}

interface UseSortWanderersReturnValue {
  sortedWanderers: Wanderer[];
  sortValue: SortValues;
  sortOptions: DropdownItemProps[];
  onSortChange: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
}

function createSortOption(value: string, text?: string): DropdownItemProps {
  return {
    key: value,
    value: value,
    text: text || value,
  };
}

const sortOptions = [
  createSortOption(SortValues.Created),
  createSortOption(SortValues.Name),
  createSortOption(SortValues.Culture),
  createSortOption(SortValues.Sex, 'sex'),
];

const useSortWanderers = (unsortedWanderers: Wanderer[]): UseSortWanderersReturnValue => {
  const [sortValue, setSortValue] = useState<SortValues>(SortValues.Created);

  const onSortChange = useCallback((event, data) => {
    setSortValue(data.value);
  }, []);

  const sortedWanderers: Wanderer[] = useMemo(() => {
    if (!sortValue || sortValue === SortValues.Created) {
      return unsortedWanderers;
    }

    return orderBy(unsortedWanderers, (c: any) => c[sortValue], 'asc');
  }, [unsortedWanderers, sortValue]);

  return {
    sortedWanderers,
    sortValue,
    sortOptions,
    onSortChange,
  };
};

export default useSortWanderers;
