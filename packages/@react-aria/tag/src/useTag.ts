/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaButtonProps} from '@react-types/button';
import {chain, filterDOMProps, mergeProps, useId} from '@react-aria/utils';
import {DOMAttributes} from '@react-types/shared';
// @ts-ignore
import intlMessages from '../intl/*.json';
import {KeyboardEvent} from 'react';
import type {TagGroupState} from '@react-stately/tag';
import {TagProps} from '@react-types/tag';
import {useGridListItem} from '@react-aria/gridlist';
import {useLocalizedStringFormatter} from '@react-aria/i18n';


export interface TagAria {
  labelProps: DOMAttributes,
  tagProps: DOMAttributes,
  tagRowProps: DOMAttributes,
  clearButtonProps: AriaButtonProps
}

/**
 * Provides the behavior and accessibility implementation for a tag component.
 * @param props - Props to be applied to the tag.
 * @param state - State for the tag group, as returned by `useTagGroupState`.
 */
export function useTag<T>(props: TagProps<T>, state: TagGroupState<T>): TagAria {
  let {
    isFocused,
    allowsRemoving,
    item,
    tagRowRef
  } = props;
  let stringFormatter = useLocalizedStringFormatter(intlMessages);
  let removeString = stringFormatter.format('remove');
  let labelId = useId();
  let buttonId = useId();

  let {rowProps, gridCellProps} = useGridListItem({
    node: item
  }, state, tagRowRef);

  // We want the group to handle keyboard navigation between tags.
  delete rowProps.onKeyDownCapture;

  let onRemove = chain(props.onRemove, state.onRemove);

  let onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace' || e.key === ' ') {
      onRemove(item.key);
      e.preventDefault();
    }
  };

  isFocused = isFocused || state.selectionManager.focusedKey === item.key;
  let domProps = filterDOMProps(props);
  return {
    clearButtonProps: {
      'aria-label': removeString,
      'aria-labelledby': `${buttonId} ${labelId}`,
      id: buttonId,
      onPress: () => allowsRemoving && onRemove ? onRemove(item.key) : null
    },
    labelProps: {
      id: labelId
    },
    tagRowProps: {
      ...rowProps,
      tabIndex: (isFocused || state.selectionManager.focusedKey == null) ? 0 : -1,
      onKeyDown: allowsRemoving ? onKeyDown : null
    },
    tagProps: mergeProps(domProps, gridCellProps, {
      'aria-errormessage': props['aria-errormessage'],
      'aria-label': props['aria-label']
    })
  };
}
