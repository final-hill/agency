/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { View } from '../../agent/View';

export class TextView extends View {
    #elRoot = document.createElement('span');

    getElRoot(): HTMLElement {
        return this.#elRoot;
    }
}