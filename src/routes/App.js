/* eslint-disable */
/**
 * @file 编辑邮件
 */

import React, {Component} from 'react';
import {connect} from 'dva';
import { Form, Select, Input, Button, Modal, Row, Col} from 'antd';
import styles from './App.less'
import RichEditor from '../index';

const App = ({dispatch}) => {
    return (
        <div style={{
            padding: '16px'
        }}>
            <Row
                style={{
                    marginTop: '32px'
                }}>
                <RichEditor
                    style={{
                    width: 200,
                    heihgt: 200
                }}/>
            </Row>
        </div>
    );
};

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps
    };
}

export default connect(mapStateToProps)(App);
/* eslint-enable */
