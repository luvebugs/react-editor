import React, {Component} from 'react';
import {
    Dropdown,
    Button,
    Menu,
    Icon,
    Modal,
    Input,
    Form
} from 'antd';
import {
    EditorState,
    RichUtils,
    Modifier,
    Entity,
    CompositeDecorator,
    convertToRaw,
    ContentState,
    AtomicBlockUtils
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import SimpleDecorator from 'draft-js-simpledecorator';
import {convertToHTML, convertFromHTML} from 'draft-convert';
import 'draft-js/dist/Draft.css';
import './RichEditor.less';
import StyleButton from './StyleButton';
import {
    fontSizeStyleMap,
    lineHeightStyleMap,
    fontStyleMap,
    colorStyleMap,
    backgroundColorStyleMap,
    codeStyleMap,
    alignmentStyleMap
} from './StyleMap';
// import {BlockStyleControls, InlineStyleControls, ColorControls,
// BackgroundColorControls, LineHeightControls, FontControls, FontSizeControls,
// EntityControls, ImageControls, ConvertControls} from './Control';
import {
    ConvertControls,
    ImageControls,
    VariableControls,
    EntityControls,
    FontSizeControls,
    BlockStyleControls,
    ColorControls,
    BackgroundColorControls,
    FontControls,
    InlineStyleControls,
    LineHeightControls,
    UndoRedoEntityControls,
    AlignmentControls,
    PerviewControls
} from './Controls';

const styleMap = {
    ...codeStyleMap,
    ...colorStyleMap,
    ...backgroundColorStyleMap,
    ...fontStyleMap,
    ...fontSizeStyleMap,
    ...lineHeightStyleMap,
    ...alignmentStyleMap
};

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];
const FormItem = Form.Item;

const CollectionCreateForm = Form.create()((props) => {
    const {
        visible,
        onCancel,
        onCreate,
        form,
        title,
        ruleMsg
    } = props;
    const {getFieldDecorator} = form;
    return (
        <Modal visible={visible} title={title} onCancel={onCancel} onOk={onCreate}>
            <Form>
                <FormItem>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: ruleMsg
                            }
                        ]
                    })(<Input style={{
                        width: '100%'
                    }}/>)}
                </FormItem>
            </Form>
        </Modal>
    );
});

export default class RichEditor extends React.Component {
    constructor(props) {
        super(props);
        const decorator = new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: Link
            }, {
                strategy: findImageEntities,
                component: Image
            }
        ]);
        this.state = {
            linkVisible: false,
            imageVisible: false,
            editorState: EditorState.createEmpty(),
            code: '',
            codeVisible: false,
            previewVisible: false,
            variableVisible: false
        };

        this.focus = () => this
            .refs
            .editor
            .focus();
        this.onChange = (editorState) => {
            // const html = stateToHTML(contentState);
            this.setState({editorState});
            this.handleConvertToHTML(editorState);
        };
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggle = (type) => this._toggle(type);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        this.toggleLink = (toggleLink) => this._toggleLink(toggleLink);
        this.toggleImage = (toggleImage) => this._toggleImage(toggleImage);
        this.toggleVariable = (toggleVariable) => this._toggleVariable(toggleVariable);
        this.toggleUndoRedo = (toggleUndoRedo) => this._toggleUndoRedo(toggleUndoRedo);
        this.toggleConvert = (toggleConvert) => this._toggleConvert(toggleConvert);
        this.togglePerview = (togglePerview) => this._togglePerview(togglePerview);
        this.toggleAlignment = (toggleAlignment) => this._toggleAlignment(toggleAlignment);
        this.handleLinkOk = () => this._handleLinkOk();
        this.handleLinkCancel = () => this._handleLinkCancel();
        this.handleImageOk = () => this._handleImageOk();
        this.handleImageCancel = () => this._handleImageCancel();
        this.handleVariableOk = () => this._handleVariableOk();
        this.handleVariableCancel = () => this._handleVariableCancel();
        this.handleConvertFromHTML = (event : Object) => {
            let code = event.target.value;
            const colorMapStyle = Object
                .keys(colorStyleMap)
                .reduce((map, currentStyle) => {
                    map[colorStyleMap[currentStyle].color] = currentStyle;
                    return map;
                }, {});
            const backgroundColorMapStyle = Object
                .keys(backgroundColorStyleMap)
                .reduce((map, currentStyle) => {
                    map[backgroundColorStyleMap[currentStyle].backgroundColor] = currentStyle;
                    return map;
                }, {});
            const fontSizeMapStyle = Object
                .keys(fontSizeStyleMap)
                .reduce((map, currentStyle) => {
                    map[fontSizeStyleMap[currentStyle].fontSize] = currentStyle;
                    return map;
                }, {});
            const fontFamilyMapStyle = Object
                .keys(fontStyleMap)
                .reduce((map, currentStyle) => {
                    map[fontStyleMap[currentStyle].fontFamily] = currentStyle;
                    return map;
                }, {});
            const alignmentMapStyle = Object
                .keys(alignmentStyleMap)
                .reduce((map, currentStyle) => {
                    map[alignmentStyleMap[currentStyle].textAlign] = currentStyle;
                    return map;
                }, {});
            const contentState = convertFromHTML({
                htmlToStyle: (nodeName, node, currentStyle) => {
                    const colorStyle = node.style.color
                        ? colorMapStyle[node.style.color]
                        : '';
                    const backgroundColorStyle = node.style.backgroundColor
                        ? backgroundColorMapStyle[node.style.backgroundColor]
                        : '';
                    const fontSizeStyle = node.style.fontSize
                        ? fontSizeMapStyle[node.style.fontSize]
                        : '';
                    const fontStyle = node.style.fontFamily
                        ? fontFamilyMapStyle[node.style.fontFamily]
                        : '';
                    const alignmentStyle = node.style.textAlign
                        ? alignmentMapStyle[node.style.textAlign]
                        : '';
                    const style = colorStyle || backgroundColorStyle || fontSizeStyle || fontStyle || alignmentStyle;
                    if (nodeName === 'span' && style) {
                        return currentStyle.add(style);
                    } else {
                        return currentStyle;
                    }
                },
                htmlToEntity: (nodeName, node) => {
                    if (nodeName === 'a') {
                        return Entity.create('LINK', 'MUTABLE', {url: node.href});
                    } else if (nodeName === 'img') {
                        return Entity.create('image', 'IMMUTABLE', {src: node.src});
                    }
                },
                textToEntity: (text) => {
                    const result = [];
                    text.replace(/\@(\w+)/g, (match, name, offset) => {
                        const entityKey = Entity.create('AT-MENTION', 'IMMUTABLE', {name});
                        result.push({entity: entityKey, offset, length: match.length, result: match});
                    });
                    return result;
                },
                htmlToBlock: (nodeName, node) => {
                    if (nodeName === 'blockquote') {
                        return {type: 'blockquote', data: {}};
                    } else if (nodeName === 'img') {
                        return {
                            type: 'image',
                            data: {
                                src: node.src,
                                caption: node.alt
                            }
                        };
                    } else if (nodeName === 'figure') {
                        return 'atomic';
                    }
                }
            })(code);
            // const blocksFromHTML = convertFromHTML(code); const state =
            // ContentState.createFromBlockArray(blocksFromHTML.contentBlocks,
            // blocksFromHTML.entityMap);
            this.setState({
                editorState: EditorState.createWithContent(contentState, decorator),
                code
            });
        };
        this.handleConvertToHTML = (editorState) => {
            const contentState = editorState.getCurrentContent();
            const html = convertToHTML({
                styleToHTML: (style) => {
                    if (styleMap[style]) {
                        return <span style={styleMap[style]}/>;
                    }
                },
                // blockToHTML: (block) => {     if (block.type === 'PARAGRAPH') { return <p/>;
                //    } },
                entityToHTML: (entity, originalText) => {
                    if (entity.type === 'LINK') {
                        return <a href={entity.data.url}>{originalText}</a>;
                    } else if (entity.type === 'image') {
                        return `<img src="${entity.data.src}" />`;
                    }
                    return originalText;
                },
                blockRendererFn: (block) => {
                    if (block.getType() === 'atomic' && block.length > 0 && Entity.get(block.getEntityAt(0)).getType() === ENTITY_TYPE) {
                        return {
                            component: ({block}) => {
                                const {src} = Entity
                                    .get(block.getEntityAt(0))
                                    .getData();
                                return <img src={src}/>;
                            },
                            editable: false
                        };
                    }
                },
                blockToHTML: (block) => {
                    if (block.type === 'paragraph') { 
                        return <p />;
                    } else if(block.type === 'atomic') {
                        return {
                            start: '<figure>',
                            end: '</figure>'
                        };
                    } else if(block.type === 'ordered-list-item') {
                        return {
                            element: <li />,
                            nest: <ol />
                        };
                    } else if(block.type === 'unordered-list-item') {
                        return {
                            element: <li />,
                            nest: <ul />
                        };
                    } else if(block.type === 'header-one') {
                        return <h1 />;
                    } else if(block.type === 'header-two') {
                        return <h2 />;
                    } else if(block.type === 'header-three') {
                        return <h3 />;
                    } else if(block.type === 'header-four') {
                        return <h4 />;
                    } else if(block.type === 'header-five') {
                        return <h5 />;
                    } else if(block.type === 'header-six') {
                        return <h6 />;
                    } else {
                        console.log();
                        return <p style={block.data}/>;
                    }
                }
            })(contentState);
            this.setState({code: html});
        };
    }
    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }
    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }
    _toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }
    _toggleAlignment(alignment) {
        const {editorState} = this.state;
        const nextContentState = Modifier.setBlockData(editorState.getCurrentContent(), editorState.getSelection(), {'textAlign': alignment});
        const nextEditorState = EditorState.push(editorState, nextContentState, 'change-block-data');
        this.onChange(nextEditorState);
    }
    _toggle(styleMap) {
        return (toggled) => {
            const {editorState} = this.state;
            const selection = editorState.getSelection();
            // Let's just allow one color at a time. Turn off all active colors.
            const nextContentState = Object
                .keys(styleMap)
                .reduce((contentState, style) => {
                    return Modifier.removeInlineStyle(contentState, selection, style);
                }, editorState.getCurrentContent());
            let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
            const currentStyle = editorState.getCurrentInlineStyle();
            // Unset style override for current color.
            if (selection.isCollapsed()) {
                nextEditorState = currentStyle.reduce((state, style) => {
                    return RichUtils.toggleInlineStyle(state, style);
                }, nextEditorState);
            }
            // If the color is being toggled on, apply it.
            if (!currentStyle.has(toggled)) {
                nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggled);
            }
            this.onChange(nextEditorState);
        };

    }
    _toggleLink(link) {
        const {editorState} = this.state;
        const selection = editorState.getSelection();
        if (selection.isCollapsed()) {
            return;
        }
        if (link) {
            this.setState({linkVisible: true});
        } else {
            this.onChange(RichUtils.toggleLink(editorState, selection, null));
        }
    }
    _toggleImage() {
        this.setState({imageVisible: true});
    }
    _toggleVariable() {
        this.setState({variableVisible: true});
    }
    _toggleUndoRedo(type) {
        if (type) {
            const {editorState} = this.state;
            this.onChange(EditorState.redo(editorState));
        } else {
            const {editorState} = this.state;
            this.onChange(EditorState.undo(editorState));
        }
    }
    _toggleConvert() {
        this.setState({
            codeVisible: !this.state.codeVisible
        });
    }
    _togglePerview() {
        this.setState({
            previewVisible: !this.state.previewVisible
        });
    }
    _handleLinkCancel() {
        this.setState({linkVisible: false});
    }
    _handleLinkOk() {
        const form = this.linkForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const {editorState} = this.state;
            const selection = editorState.getSelection();
            if (selection.isCollapsed()) {
                return;
            }
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {url: values.name});
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = EditorState.set(editorState, {currentContent: contentStateWithEntity});
            this.onChange(RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey));
            form.resetFields();
            this.setState({linkVisible: false});
        });
    }
    _handleImageCancel() {
        this.setState({imageVisible: false});
    }
    _handleImageOk() {
        const form = this.imageForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const {editorState} = this.state;
            this.onChange(imagePlugin.addImage(editorState, values.name));
            form.resetFields();
            this.setState({linkVisible: false});
        });
    }
    _handleVariableCancel() {
        this.setState({variableVisible: false});
    }
    _handleVariableOk() {
        const form = this.variableForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const {editorState} = this.state;
            const contentState = editorState.getCurrentContent();
            const selection = editorState.getSelection();
            const nextContentState = Modifier.insertText(contentState, selection, values.name);
            const newEditorState = EditorState.push(editorState, nextContentState, 'insert-fragment');
            this.onChange(newEditorState);
            form.resetFields();
            this.setState({variableVisible: false});
        });
    }
    saveLinkFormRef = (form) => {
        this.linkForm = form;
    }
    saveImageFormRef = (form) => {
        this.imageForm = form;
    }
    saveVariableFormRef = (form) => {
        this.variableForm = form;
    }
    render() {
        const {
            editorState,
            codeVisible,
            linkVisible,
            imageVisible,
            variableVisible,
            previewVisible,
            code
        } = this.state;
        // If the user changes block type before entering any text, we can either style
        // the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        const contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        const decorators = [
            new SimpleDecorator(findLinkEntities, Link),
            new SimpleDecorator(findImageEntities, Image)
        ];
        return (
            <div>
                <CollectionCreateForm
                    title='添加链接'
                    ruleMsg='请输入链接'
                    ref={this.saveLinkFormRef}
                    visible={linkVisible}
                    onCancel={this.handleLinkCancel}
                    onCreate={this.handleLinkOk}/>
                <CollectionCreateForm
                    title='添加图片'
                    ruleMsg='请输入图片链接'
                    ref={this.saveImageFormRef}
                    visible={imageVisible}
                    onCancel={this.handleImageCancel}
                    onCreate={this.handleImageOk}/>
                <CollectionCreateForm
                    title='插入变量'
                    ruleMsg='请输入变量'
                    ref={this.saveVariableFormRef}
                    visible={variableVisible}
                    onCancel={this.handleVariableCancel}
                    onCreate={this.handleVariableOk}/>
                <div className="RichEditor-root">
                    <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType}/>
                    <InlineStyleControls
                        editorState={editorState}
                        onToggle={this.toggleInlineStyle}/>
                    <ColorControls editorState={editorState} onToggle={this.toggle(colorStyleMap)}/>
                    <LineHeightControls
                        editorState={editorState}
                        onToggle={this.toggle(lineHeightStyleMap)}/>
                    <BackgroundColorControls
                        editorState={editorState}
                        onToggle={this.toggle(backgroundColorStyleMap)}/>
                    <FontControls editorState={editorState} onToggle={this.toggle(fontStyleMap)}/>
                    <AlignmentControls editorState={editorState} onToggle={this.toggleAlignment}/>
                    <FontSizeControls
                        editorState={editorState}
                        onToggle={this.toggle(fontSizeStyleMap)}/>
                    <EntityControls editorState={editorState} onToggle={this.toggleLink}/>
                    <ImageControls editorState={editorState} onToggle={this.toggleImage}/>
                    <VariableControls editorState={editorState} onToggle={this.toggleVariable}/>
                    <ConvertControls editorState={editorState} onToggle={this.toggleConvert}/>
                    <PerviewControls editorState={editorState} onToggle={this.togglePerview}/>
                    <UndoRedoEntityControls
                        editorState={editorState}
                        onToggle={this.toggleUndoRedo}/>
                    <div className={className}>
                        {!codeVisible
                            ? <Editor
                                    onClick={this.focus}
                                    blockStyleFn={getBlockStyle}
                                    customStyleMap={styleMap}
                                    decorators={decorators}
                                    editorState={editorState}
                                    handleKeyCommand={this.handleKeyCommand}
                                    onChange={this.onChange}
                                    onTab={this.onTab}
                                    plugins={plugins}
                                    placeholder="把不开心的事说出来让哥乐乐"
                                    ref="editor"
                                    spellCheck={false}/>
                            : <textarea
                                className={'RichEditor-coder'}
                                value={code}
                                onChange={this.handleConvertFromHTML}/>}
                    </div>
                </div>
                {previewVisible ? <div className={'RichEditor-perview'}>
                    <div className={'RichEditor-preview-control'}>
                        预览：
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                        __html: code
                    }}></div>
                </div> : ''}
            </div>
        );
    }
}

function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK');
    }, callback);
}
const Link = (props) => {
    const {url} = props
        .contentState
        .getEntity(props.entityKey)
        .getData();
    return (
        <a href={url} style={styles.link}>
            {props.children}
        </a>
    );
};
function findImageEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE');
    }, callback);
}
const Image = (props) => {
    const {height, src, width} = props
        .contentState
        .getEntity(props.entityKey)
        .getData();
    return (<img src={src} height={height} width={width}/>);
};
// Custom overrides for "code" style.
function getBlockStyle(block) {
    const alignment = block.getData() && block.getData().get('textAlign');
    if (alignment) {
        return `RichEditor-aligned-${alignment}`;
    }
    // switch (block.getType()) {
    //     case 'blockquote':
    //         return 'RichEditor-blockquote';
    //     default:
    //         return null;
    // }
}

const styles = {
    root: {
        fontFamily: 'monospace',
        padding: 20,
        width: 600
    },
    buttons: {
        marginBottom: 10
    },
    urlInputContainer: {
        marginBottom: 10
    },
    urlInput: {
        fontFamily: 'monospace',
        marginRight: 10,
        padding: 3
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10
    },
    button: {
        marginTop: 10,
        textAlign: 'center'
    },
    link: {
        color: '#3b5998',
        textDecoration: 'underline'
    }
};