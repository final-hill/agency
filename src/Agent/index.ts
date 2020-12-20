/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import Abstraction from './Abstraction';
import Presentation from './Presentation';
import LayoutOptions from './LayoutOptions';

const {invariant, demands} = new Contracts(true);

/*
export enum AgentEvent {
    ATTACHED = 'agentAttached',
    DETACHED = 'agentDetached',
    ERROR = 'agentError'
} */

export interface AgentOptions {
    layout?: LayoutOptions;
    /**
     * A callback for the attached event.
     *
     * @this - The current agent
     */
    onAttached?: () => void;
    /**
     * A callback for the detached event.
     *
     * @this - The current agent
     */
    onDetached?: () => void;
}

/**
 * An Agent is the fundamental unit of an Application. It is a system consisting of two facets:
 * a Presentation and an Abstraction. Agents are be organized into a hierarchy.
 *
 * The Presentation and Abstraction facets are ignorant of each other and managed by their containing Agent
 * which acts as a coordinator/control
 *
 * Each agent can only communicate with its immediate parent and immediate children.
 */
@invariant
export default class Agent {
    declare presentationType: Presentation;
    declare abstractionType: Abstraction;
    declare childType: Agent;

    #parent?: Agent;

    #children: this['childType'][] = [];
    /**
     * The abstraction facet
     */
    #abstraction?: this['abstractionType'];

    /**
     * The presentation facet
     */
    #presentation?: this['presentationType'];

    #handlers: Map<string, (...args: any[]) => any> = new Map();

    constructor(options: AgentOptions = {}, children: Agent['childType'][] = []) {
        ['onAttached', 'onDetached', 'onError'].forEach(name => {
            if(typeof (options as any)[name] == 'function') {
                this.#handlers.set(name, (options as any)[name]);
            }
        });
        this.#abstraction = this._initAbstraction();
        this.#presentation = this._initPresentation();

        this.#presentation!.setLayout(options.layout ?? LayoutOptions.VERTICAL);
        children.forEach(child => this.attachChild(child));
    }

    /**
     * Returns a reference to the parent agent
     * @returns {Agent} - The parent agent
     * @throws - Throws an exception if there is no parent assigned
     */
    @demands(function(this: Agent){ return this.hasParent(); })
    get parent(): Agent {
        return this.#parent!;
    }

    /**
     * Attaches the provided agent to the current agent as a child.
     *
     * @param {Agent} child - The agent to attach
     * @returns {Agent} - Returns the attached agent
     * @throws - Throws an exception if the provided agent is attached to another agent
     */
    @demands(function(this: Agent, child: Agent['childType']) { return !this.children().includes(child); })
    @demands(function(this: Agent, agent: Agent['childType']) { return !agent.hasParent(); })
    attachChild(child: this['childType']): this['childType'] {
        this.#children.push(child);
        child._setParent(this);

        if (this.hasPresentation() && child.hasPresentation()) {
            this.#presentation!.attachChild(child._presentation);
        }

        /*
        if (this.hasAbstraction() && child.hasAbstraction()) {
            this._abstraction.attachChild(child._abstraction);
        }
        */

        child.onAttached();

        return child;
    }

    /**
     * Detaches the provided agent from the current agent
     *
     * @param {Agent} child - The agent to detach
     * @returns {Agent} - Returns the detached agent
     * @throws - Throws an exception if the provided child is not a child of this agent
     */
    @demands(function(this: Agent, child: Agent['childType']) { return child.parent === this; })
    @demands(function(this: Agent, child: Agent['childType']){ return this.children().includes(child); })
    detachChild(child: this['childType']): this['childType'] {
        this.#children = this.#children.filter(c => c !== child);
        child._removeParent();

        if (this.hasPresentation() && child.hasPresentation()) {
            this._presentation.detachChild(child._presentation);
        }

        /*
        if (this.hasAbstraction() && child.hasAbstraction()) {
            this._abstraction.detachChild(child._abstraction);
        }
        */

        child.onDetached();

        return child;
    }

    @demands(function(this: Agent){ return this.hasPresentation(); })
    protected get _presentation(): this['presentationType'] {
        return this.#presentation!;
    }


    @demands(function(this: Agent){ return this.hasAbstraction(); })
    protected get _abstraction(): this['abstractionType'] {
        return this.#abstraction!;
    }

    /**
     * This method is called by the constructor to initialize the abstraction facet
     * @throws - Throws an exception if an abstraction has already been initialized
     * @returns {Abstraction | undefined} -
     */
    @demands(function(this: Agent){ return !this.hasAbstraction(); })
    protected _initAbstraction(): this['abstractionType'] | undefined {
        return undefined;
    }

    /**
     * This method is called by the constructor to initialize the presentation facet
     * @throws - Throws an exception if a presentation has already been initialized
     * @returns {Presentation | undefined} -
     */
    @demands(function(this: Agent){ return !this.hasPresentation(); })
    protected _initPresentation(): this['presentationType'] | undefined {
        return undefined;
    }

    /**
     * Assigns a parent agent to this agent
     *
     * @param {Agent} agent - The agent to assign as a parent
     *
     * @throws - Throws an exception if a parent has already been assigned
     */
    @demands(function(this: Agent){ return !this.hasParent(); })
    protected _setParent(agent: Agent): void {
        this.#parent = agent;
    }

    /**
     * Removes the parent from this agent
     *
     * @throws - Throws an exception if no parent has been assigned
     */
    @demands(function(this: Agent){ return this.hasParent(); })
    protected _removeParent(): void {
        this.#parent = undefined;
    }

    /**
     * Determines if the agent has a parent assigned
     * @returns {boolean} -
     */
    hasParent(): boolean {
        return this.#parent != undefined;
    }

    /**
     * Determines if the agent has a abstraction assigned
     * @returns {boolean} -
     */
    hasAbstraction(): boolean {
        return this.#abstraction != undefined;
    }

    /**
     * Determines if the agetn has a presentation assigned
     * @returns {boolean} -
     */
    hasPresentation(): boolean {
        return this.#presentation != undefined;
    }

    /**
     * Determines if the agent has children attached
     * @returns {boolean} -
     */
    hasChildren(): boolean {
        return this.#children.length > 0;
    }

    /**
     * Determines if the agent has the specified child
     * @param {Agent} child -
     * @returns {boolean} -
     */
    hasChild(child: this['childType']): boolean {
        return this.#children.includes(child);
    }

   /**
     * Returns a list of the child presentations
     * @returns {Agent[]} -
     */
    children(): this['childType'][] {
        return this.#children.slice();
    }

    /**
     * After an agent is attached to a parent this method is called
     */
    onAttached(): void {
        if(this.#handlers.has('onAttached')) {
            this.#handlers.get('onAttached')!.call(this);
        }
    }

    /**
     * After an agent is detached from a parent this method is called
     */
    onDetached(): void {
        if(this.#handlers.has('onDetached')) {
            this.#handlers.get('onDetached')!.call(this);
        }
    }
}
