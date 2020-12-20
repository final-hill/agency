/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import './style.css';

import Contracts from '@final-hill/decorator-contracts';
import LayoutOptions from './LayoutOptions';

const {invariant, demands} = new Contracts(true);

export interface PresentationOptions {
    layout?: LayoutOptions;
}

/**
 * A Presentation is the visual representation of an Agent
 */
@invariant
export default class Presentation {
    declare rootElementType: Element;
    #rootElement: this['rootElementType'];

    declare containerType: Element;
    #containerElement: this['containerType'];

    declare childType: Presentation;
    #children: this['childType'][] = [];

    #handlers: Map<string,EventListener> = new Map();

    constructor(options: PresentationOptions = {
        layout: LayoutOptions.VERTICAL
    }) {
        this.#rootElement = this._initRootElement();
        this.#rootElement.classList.add('agent');

        // TODO: reference import. dynamic class name
        this.#containerElement = this._initContainerElement();
        this.#containerElement.classList.add('agent-content');
        this.setLayout(
            options.layout != undefined ? options.layout : LayoutOptions.VERTICAL
        );
    }

    /**
     * Attaches the provided presentation as a child.
     *
     * @param {Presenation} presentation - The presentation to attach
     * @returns {Presentation} - Returns the attached presentation
     * @throws - Throws an exception if the provided presentation is already attached
     */
    @demands(function(this: Presentation, presentation: Presentation['childType']){
        return !this.children().includes(presentation);
    })
    attachChild(presentation: this['childType']): this['childType'] {
        this.#children.push(presentation);

        return presentation;
    }

    /**
     * Detaches the provided presentation from the container
     *
     * @param {Presentation} presentation - The presentation to detach
     * @returns {Presenation} - Returns the detached presentation
     * @throws - Throws an exception if the provided presentation is not a child of this container
     */
    @demands(function(this: Presentation, presentation: Presentation['childType']){
        return this.children().includes(presentation);
    })
    detachChild(presentation: this['childType']): this['childType'] {
        this.#children = this.#children.filter(child => child !== presentation);

        return presentation;
    }

   /**
     * Returns a list of the child presentations
     * @returns {Presenation[]} -
     */
    children(): this['childType'][] {
        return this.#children.slice();
    }

    /**
     * Captures all DOM Events and routes them to the appropriate method name
     *
     * @param {Event} e The raised event
     */
    handleEvent(e: Event): void {
        const name = `on${e.type[0].toUpperCase()}${e.type}`;
        if(typeof (this as any)[name] == 'function') {
            (this as any)[name](e);
        }
        if(this.#handlers.has(name)) {
            this.#handlers.get(e.type)!(e);
        }
    }

    setLayout(name: LayoutOptions): void {
        const cls = this._rootElement.classList;
        cls.forEach(cl => {
            if (cl.startsWith('layout-')) {
                cls.remove(cl);
            }
        });
        cls.add(`layout-${name}`);
    }

    protected _initContainerElement(): this['containerType'] {
        return this._rootElement;
    }

    protected _initRootElement(): this['rootElementType'] {
        return document.createElement('div');
    }

    protected get _rootElement(): this['rootElementType'] {
        return this.#rootElement;
    }

    protected get _containerElement(): this['containerType'] {
        return this.#containerElement;
    }
}