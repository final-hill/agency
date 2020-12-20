/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';

const {invariant} = new Contracts(true);

/**
 * An Abstraction is the business domain functionality associated with an Agent
 */
@invariant
export default class Abstraction {}