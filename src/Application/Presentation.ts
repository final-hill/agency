/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import Presentation, {PresentationOptions} from '../Agent/Presentation';
import './style.css';

const {override} = new Contracts(true);

export default class ApplicationPresentation extends Presentation {
    declare rootElementType: HTMLElement;
    declare containerType: HTMLBodyElement;

    constructor(options: PresentationOptions = {}) {
        super(options);

        this._rootElement.classList.add('application');
        this._containerElement.classList.add('application-content');
    }

    /**
     * Returns the title of the document
     */
    get title(): string {
        return document.title;
    }

    /**
     * Sets the title of the document
     * @param {string} value -
     */
    set title(value: string) {
        document.title = value;
    }

    @override
    protected _initRootElement(): this['rootElementType'] {
        return document.documentElement;
    }

    @override
    protected _initContainerElement(): this['containerType'] {
        return document.body as HTMLBodyElement;
    }
}