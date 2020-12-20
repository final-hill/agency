/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Agent, {AgentOptions} from '../Agent';
import Contracts from '@final-hill/decorator-contracts';
import ApplicationPresentation from './Presentation';

const {override, invariant} = new Contracts(true);

export interface ApplicationOptions extends AgentOptions {
    title?: string;
}

/**
 * An Application is the root agent and represents the entirety of the system.
 */
@invariant(function(this: Application){
    return this.parent == undefined;
})
export default class Application extends Agent {
    declare presentationType: ApplicationPresentation;

    constructor(options: ApplicationOptions = {},children: Application['childType'][] = []){
        super(options,children);

        this.title = options.title ?? '';
    }

    @override
    protected _initPresentation(): this['presentationType'] {
        return new ApplicationPresentation();
    }

    /**
     * Sets the title of the application
     *
     * @param {string} value - The new title
     */
    set title(value: string) {
        this._presentation.title = value;
    }

    /**
     * Returns the title of the application
     */
    get title(): string {
        return this._presentation.title;
    }
}