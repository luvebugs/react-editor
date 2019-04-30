import React, {Component} from 'react';
import {Dropdown, Button, Menu, Icon, Popover} from 'antd';
import StyleButton from './StyleButton';
import {fontSizeStyleMap, lineHeightStyleMap, fontStyleMap, colorStyleMap, backgroundColorStyleMap, styleMap} from './StyleMap';

const BLOCK_TYPES = [
    {
        label: 'H1',
        style: 'header-one'
    }, {
        label: 'H2',
        style: 'header-two'
    }, {
        label: 'H3',
        style: 'header-three'
    }, {
        label: 'H4',
        style: 'header-four'
    }, {
        label: 'H5',
        style: 'header-five'
    }, {
        label: 'H6',
        style: 'header-six'
    }, {
        label: <Icon type="yinyong" />,
        style: 'blockquote'
    }, {
        label: <Icon type="duanluo1" />,
        style: 'code-block'
    }, {
        label: <Icon type="listul" />,
        style: 'unordered-list-item'
    }, {
        label: <Icon type="paixu" />,
        style: 'ordered-list-item'
    }
];
export const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type, index) => <StyleButton
                key={index}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}/>)}
        </div>
    );
};
const INLINE_STYLES = [
    {
        label: <Icon type="bold" />,
        style: 'BOLD'
    }, {
        label: <Icon type="xietiim" />,
        style: 'ITALIC'
    }, {
        label: <Icon type="xiahuaxian" />,
        style: 'UNDERLINE'
    }, {
        label: <Icon type="draft" />,
        style: 'CODE'
    }
];
export const InlineStyleControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type, index) => <StyleButton
                key={index}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}/>)}
        </div>
    );
};

const COLORS = [
    {
        label: 'Lime',
        style: 'lime'
    }, {
        label: 'Orange',
        style: 'orange'
    }, {
        label: 'Violet',
        style: 'violet'
    }, {
        label: 'Ecru',
        style: 'ecru'
    }, {
        label: 'Umber',
        style: 'umber'
    },
    {
        label: 'Blue',
        style: 'blue'
    }, {
        label: 'Indigo',
        style: 'indigo'
    }
];
export const ColorControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    const content = COLORS.map((type, index) => <div
                className='RichEditor-color'
                style={{
                    backgroundColor: colorStyleMap[type.style]
                        ? colorStyleMap[type.style].color
                        : ''
                }}
                key={index}>
                <StyleButton
                    key={index}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}/>
    </div>);
    return (
        <div className="RichEditor-controls">
            <Popover placement="bottom" content={content} trigger="click">
                <span  className="RichEditor-text">颜色</span>
            </Popover>
        </div>
    );
};

const BACKGROUNDCOLORS = [
    {
        label: 'Lime',
        style: 'backgroundLime'
    }, {
        label: 'Orange',
        style: 'backgroundOrange'
    }, {
        label: 'Violet',
        style: 'backgroundViolet'
    }, {
        label: 'Ecru',
        style: 'backgroundEcru'
    }, {
        label: 'Umber',
        style: 'backgroundUmber'
    }, {
        label: 'Indigo',
        style: 'backgroundIndigo'
    }, {
        label: 'Blue',
        style: 'backgroundBlue'
    }
];
export const BackgroundColorControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    const content = BACKGROUNDCOLORS.map((type, index) => <div
                className='RichEditor-color'
                style={{
                    backgroundColor: backgroundColorStyleMap[type.style]
                        ? backgroundColorStyleMap[type.style].backgroundColor
                        : ''
                }}
                key={index}>
                <StyleButton
                    key={index}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}/>
        </div>);
    return (
        <div className="RichEditor-controls">
            <Popover placement="bottom" content={content} trigger="click">
                <span  className="RichEditor-text">背景色</span>
            </Popover>
        </div>
    );
};

const LINEHEIGHTS = [
    {
        label: '16',
        style: '16'
    }, {
        label: '32',
        style: '32'
    }
];
export const LineHeightControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    const menu = (
        <Menu>
            {LINEHEIGHTS.map((type, index) => <Menu.Item key={index}>
                <StyleButton
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}/>
            </Menu.Item>)}
        </Menu>
    );
    return (
        <div className="RichEditor-controls">
            <Dropdown overlay={menu} trigger={['click']}>
                <span className="RichEditor-text">
                    行高
                </span>
            </Dropdown>
        </div>
    );
};

const FONTS = [
    {
        label: '宋体',
        style: 'songti'
    }, {
        label: '黑体',
        style: 'heiti'
    }, {
        label: '楷书',
        style: 'kaishu'
    }, {
        label: '幼圆',
        style: 'youyuan'
    }, {
        label: 'Arial',
        style: 'arial'
    }, {
        label: 'Arial Black',
        style: 'arialBlack'
    }, {
        label: 'Times New Roman',
        style: 'timesNewRoman'
    }, {
        label: 'Verdana',
        style: 'verdana'
    }
];
export const FontControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    const menu = (
        <Menu>
            {FONTS.map((type, index) => <Menu.Item key={index}>
                <StyleButton
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}/>
            </Menu.Item>)}
        </Menu>
    );
    return (
        <div className="RichEditor-controls">
            <Dropdown overlay={menu} trigger={['click']}>
                <span className="RichEditor-text"><Icon type="wenzi01" /></span>
            </Dropdown>
        </div>
    );
};

const FONTSIZES = [
    {
        label: '12',
        style: '12'
    }, {
        label: '14',
        style: '14'
    }, {
        label: '18',
        style: '18'
    }, {
        label: '24',
        style: '24'
    }, {
        label: '36',
        style: '36'
    }
];
export const FontSizeControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    const menu = (
        <Menu>
            {FONTSIZES.map((type, index) => <Menu.Item key={index}>
                <StyleButton
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}/>
            </Menu.Item>)}
        </Menu>
    );
    return (
        <div className="RichEditor-controls">
            <Dropdown overlay={menu} trigger={['click']}>
                <span className="RichEditor-text"><Icon type="caozuowenzi" /></span>
            </Dropdown>
        </div>
    );
};
const ENTITYS = [
    {
        label: <Icon type="lianjie" />,
        style: 1
    }, {
        label: <Icon type="duankailianjie" />,
        style: 0
    }
];
export const EntityControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {ENTITYS.map((type, index) => <StyleButton
                key={index}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}/>)}
        </div>
    );
};

const UNDOREDO = [
    {
        label: <Icon type="undo" />,
        style: 0
    }, {
        label: <Icon type="redo" />,
        style: 1
    }
];
export const UndoRedoEntityControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {UNDOREDO.map((type, index) => <StyleButton
                key={index}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}/>)}
        </div>
    );
};

const ALIGNMENT = [
    {
        label: <Icon type="leftalignment" />,
        style: 'left'
    }, {
        label: <Icon type="centeringalignment" />,
        style: 'center'
    }, {
        label: <Icon type="rightalignment" />,
        style: 'right'
    }
];
export const AlignmentControls = (props) => {
    const currentStyle = props
        .editorState
        .getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {ALIGNMENT.map((type, index) => <StyleButton
                key={index}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}/>)}
        </div>
    );
};

export const ImageControls = (props) => {
    return (
        <div className="RichEditor-controls">
            <StyleButton label={<Icon type="tupian1" />} onToggle={props.onToggle}/>
        </div>
    );
};

export const VariableControls = (props) => {
    return (
        <div className="RichEditor-controls">
            <StyleButton label={<Icon type="iconactivitypre" />} onToggle={props.onToggle}/>
        </div>
    );
};

export const ConvertControls = (props) => {
    return (
        <div className="RichEditor-controls">
            <StyleButton label={<Icon type="xitong" />} onToggle={props.onToggle}/>
        </div>
    );
};

export const PerviewControls = (props) => {
    return (
        <div className="RichEditor-controls">
            <StyleButton label={<Icon type="quanping" />} onToggle={props.onToggle}/>
        </div>
    );
};