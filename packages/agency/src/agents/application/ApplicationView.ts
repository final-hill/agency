/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { ContainerView } from '../container/ContainerView';

export class ApplicationView extends ContainerView {
    getElRoot(): HTMLElement {
        return document.documentElement;
    }
}