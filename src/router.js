/**
 * @file router
 */
/* eslint-disable */

import React from 'react';
import {Router, Route, Redirect, IndexRoute} from 'dva/router';

const App = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('./routes/App').default);
    }, 'App');
};


// TODO use browserHistory
export default ({history}) => {
    return (
        <Router history={history}>
            <Route path="/" getComponent={App}/>
        </Router>
    );
}
/* eslint-enable */
