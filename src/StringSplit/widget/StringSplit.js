import {
    defineWidget,
    log,
    runCallback,
    execute,
} from 'widget-base-helpers';

import {
    empty as emptyElement,
} from 'dojo/dom-construct';

import {
    create as createElement,
} from 'mxui/dom';

import {
    add as addClass,
} from 'dojo/dom-class';

import template from './StringSplit.template.html';

export default defineWidget('StringSplit', template, {

    // Set in Modeler
    stringAttr: '',
    onClickMf: '',
    objEntity: '',
    xpathAttr: '',

    // Internal
    _obj: null,

    constructor() {
        this.log = log.bind(this);
        this.runCallback = runCallback.bind(this);
        this.execMf = execute.bind(this);
    },

    postCreate() {
        log.call(this, 'postCreate', this._WIDGET_VERSION);
    },

    update(obj, callback) {
        const stringToSplit = obj ? obj.get(this.stringAttr) : '';

        if ('' !== stringToSplit) {
            emptyElement(this.domNode);
            const stringList = stringToSplit.split(';');

            for (let i = 0; i < stringList.length; i++) {
                const str = stringList[ i ];
                const spanNode = createElement('span', str);
                addClass(spanNode, 'question_tags_item');

                if ('' !== this.onClickMf) {
                    this.connect(spanNode, 'click', () => {
                        mx.data.get({
                            xpath: `//${this.objEntity}[${this.xpathAttr} = '${str}']`,
                            callback: objs => {
                                const getObj = objs[ 0 ];
                                if (null !== getObj) {
                                    this.execMf(
                                        this.onClickMf,
                                        getObj.getGuid(),
                                        () => {},
                                        error => {
                                            logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
                                        }
                                    );
                                }
                            },
                        });
                    });
                }
                this.domNode.appendChild(spanNode);
            }
        }
        this.runCallback(callback, 'update');
    },
});
