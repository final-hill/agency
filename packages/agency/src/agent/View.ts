/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Contract, Contracted } from '@final-hill/decorator-contracts';

export const viewContract = new Contract<View>({});

@Contracted(viewContract)
export abstract class View {
    abstract getElRoot(): HTMLElement | SVGElement;
}