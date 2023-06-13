/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Application, Text } from '@final-hill/agency/agents';

export default new Application({
    title: 'Hello World',
    children: [
        new Text({ text: 'Hello World!!!' })
    ]
});