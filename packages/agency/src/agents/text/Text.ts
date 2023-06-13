/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Agent } from '../../agent/Agent';

export interface TextOptions {
    text: string;
}

export class Text extends Agent {
    #text = '';
    constructor({ text }: TextOptions) {
        super();
        this.setText(text);
    }

    getText(): string {
        return this.#text;
    }

    setText(text: string): void {
        this.#text = text;
    }
}