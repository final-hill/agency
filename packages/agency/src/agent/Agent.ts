/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Contract, Contracted } from '@final-hill/decorator-contracts';
import { Container } from '../agents/container/Container.js';
import { Model } from './Model.js';
import { View } from './View.js';

// Enable NewtonScript style Comb Inheritance through the parent property
const combInheritance: ProxyHandler<any> = {
    get(target, propertyKey, receiver) {
        if (Reflect.has(target, propertyKey))
            return Reflect.get(target, propertyKey, receiver);
        else if (target.parent && Reflect.has(target.parent, propertyKey))
            return Reflect.get(target.parent, propertyKey, target.parent);
        else
            throw new Error(`No such property: ${String(propertyKey)}`);
    }
};

export const agentContract = new Contract<Agent>({
    getParent: {
        demands(self) { return self.isAttached(); }
    },
    remove: {
        demands(self) { return self.isAttached() && self.getParent().hasChild(self); },
        ensures(self) { return !self.isAttached(); }
    },
    setParent: {
        demands(self) { return !self.isAttached(); },
        ensures(self) { return self.isAttached() && self.getParent().hasChild(self); }
    }
});

/**
 * @see <https://en.wikipedia.org/wiki/Adapter_pattern>
 * @see <https://en.wikipedia.org/wiki/Mediator_pattern>
 */
@Contracted(agentContract)
export abstract class Agent {
    #model?: Model;
    #parent?: Container;
    #view?: View;

    constructor() {
        return new Proxy(this, combInheritance);
    }

    getParent(): Container {
        return this.#parent!;
    }

    setParent(parent: Container): void {
        this.#parent = parent;
    }

    hasModel() { return this.#model !== undefined; }

    hasView() { return this.#view !== undefined; }

    isAttached(): boolean {
        return this.#parent !== undefined;
    }

    remove(): void {
        this.#parent!.removeChild(this);
    }
}