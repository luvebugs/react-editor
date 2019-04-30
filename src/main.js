/**
 * @file Index
 * @author sunxiaoxu01
 */

import dva from 'dva';
import './index.less';
import { useRouterHistory } from 'dva/router';
import { createHashHistory } from 'history';

init();

function init() {
    const app = dva({
        history: useRouterHistory(createHashHistory)({queryKey: false})
    });
    // const app = dva();

    // 1. Initialize
    // 2. Plugins
    // app.use({});

    // 3. Model
    // 4. Router
    app.router(require('./router').default);

    // 5. Start
    app.start('#root');
}
