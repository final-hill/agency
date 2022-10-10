/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Contracted, Contract, extend } from '@final-hill/decorator-contracts';
import { Container, containerContract, ContainerOptions } from '../container/Container';

export interface ApplicationOptions extends ContainerOptions {
    title?: string;
}

const applicationContract = new Contract<Application>({
    [extend]: containerContract
});

@Contracted(applicationContract)
export class Application extends Container {
    #title!: string;

    constructor(options: ApplicationOptions) {
        super(options);
        this.setTitle(options.title ?? '{Untitled}');
    }

    getTitle(): string {
        return this.#title;
    }

    setTitle(value: string): void {
        this.#title = value;
    }

    render() {
        document.title = this.#title;
    }
}