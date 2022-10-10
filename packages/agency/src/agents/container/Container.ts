/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Contract, Contracted, extend } from '@final-hill/decorator-contracts';
import { agentContract } from '../../agent/Agent';
import { Agent } from '../../index';

export interface ContainerOptions {
    children?: Agent[];
}

export const containerContract = new Contract<Container>({
    [extend]: agentContract,
    appendChild: {
        demands(_self, child) {
            return !child.isAttached();
        },
        ensures(self, _old, child) {
            return child.isAttached() && self.hasChild(child);
        }
    },
    removeChild: {
        demands(self, child) {
            return child.isAttached() && self.hasChild(child);
        },
        ensures(self, _old, child) {
            return !child.isAttached() && !self.hasChild(child);
        }
    }
});

@Contracted(containerContract)
export abstract class Container extends Agent {
    #children: Agent[] = [];

    constructor(options: ContainerOptions = {}) {
        super();

        if (options.children)
            this.appendChildren(options.children);

    }

    appendChild(child: Agent): void {
        this.#children.push(child);

        if (this.hasView()) {
            // TODO
            // this.view.appendChild(child.getView())
        }

        child.setParent(this);
    }

    appendChildren(children: Agent[]): void {
        children.forEach(child => this.appendChild(child));
    }

    getChildren(): Agent[] {
        return [...this.#children];
    }

    hasChild(agent: Agent): boolean {
        return this.#children.includes(agent);
    }

    removeChild(child: Agent): void {
        // TODO
    }
}