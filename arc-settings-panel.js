/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {FlattenedNodesObserver} from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import '@advanced-rest-client/arc-request-settings-panel/arc-request-settings-panel.js';
import '@advanced-rest-client/arc-data-settings-panel/arc-data-settings-panel.js';
import '@advanced-rest-client/arc-privacy-settings-panel/arc-privacy-settings-panel.js';
import {ArcSettingsPanelMixin} from '@advanced-rest-client/arc-settings-panel-mixin/arc-settings-panel-mixin.js';
import '@advanced-rest-client/arc-view-settings-panel/arc-view-settings-panel.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-tabs/paper-tabs.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
/**
 * Settings panel for Advanced REST Client - electron app.
 *
 * It requires:
 *
 * - settings provider that handles `settings-read` and `settings-changed`
 * custom events
 * - all ARC models (required by data panel to clear data)
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ArcSettingsPanelMixin
 */
export class ArcSettingsPanel extends ArcSettingsPanelMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --arc-font-body1;
      @apply --arc-settings-panel;
    }

    [hidden] {
      display: none !important;
    }

    .container {
      @apply --layout-horizontal;
      height: 100%;
    }

    :host([narrow]) .container {
      @apply --layout-block;
      display: block;
    }

    .main-panels {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }

    :host([narrow]) .main-panels {
      max-width: 100%;
    }

    .nav {
      width: 200px;
      min-width: 120px;
    }

    .nav > paper-item {
      cursor: pointer;
      @apply --arc-font-menu;
    }
    </style>
    <div class="container">
      <template is="dom-if" if="[[narrow]]" restamp="">
        <paper-tabs selected="{{selected}}">
          <paper-tab>Request</paper-tab>
          <paper-tab>Data</paper-tab>
          <paper-tab>Privacy</paper-tab>
          <paper-tab>View</paper-tab>
          <template is="dom-repeat" items="[[customTabs]]">
            <paper-tab>[[item]]</paper-tab>
          </template>
        </paper-tabs>
      </template>
      <template is="dom-if" if="[[!narrow]]" restamp="">
        <paper-listbox selected="{{selected}}" class="nav">
          <paper-item>Request</paper-item>
          <paper-item>Data</paper-item>
          <paper-item>Privacy</paper-item>
          <paper-item>View</paper-item>
          <template is="dom-repeat" items="[[customTabs]]">
            <paper-item>[[item]]</paper-item>
          </template>
        </paper-listbox>
      </template>

      <iron-pages class="main-panels" selected="[[selected]]">
        <arc-request-settings-panel
          id="request"
          manual=""
          system-variables-disabled="[[systemVariablesDisabled]]"></arc-request-settings-panel>
        <arc-data-settings-panel
          id="data"
          manual=""
          rest-apis="[[restApis]]"></arc-data-settings-panel>
        <arc-privacy-settings-panel
          id="privacy"
          manual=""
          privacy-policy-url="[[privacyPolicyUrl]]"></arc-privacy-settings-panel>
        <arc-view-settings-panel id="view" manual=""></arc-view-settings-panel>
        <slot id="slot"></slot>
      </iron-pages>
    </div>
`;
  }
  static get properties() {
    return {
      /**
       * Currently selected settings panel.
       */
      selected: {
        type: Number,
        value: 0
      },
      /**
       * When set it renders narrow view.
       * It replaces side navigation with paper tabs
       */
      narrow: {type: Boolean, reflectToAttribute: true, value: false},
      /**
       * List of custom tabs added to the light DOM.
       */
      customTabs: {type: Array},
      /**
       * When set `systemVariables` options in request settings is disabled.
       * Chrome apps does not have this option.
       */
      systemVariablesDisabled: Boolean,
      /**
       * A link to application privacy policy
       */
      privacyPolicyUrl: String,
      /**
       * When set REST APIs are supported in the application.
       */
      restApis: Boolean
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._observer = new FlattenedNodesObserver(this.$.slot, (info) => {
      this._processNewNodes(info.addedNodes);
      this._processRemovedNodes(info.removedNodes);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

  _processNewNodes(nodes) {
    if (!nodes) {
      return;
    }
    nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    if (!nodes.length) {
      return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
      if (nodes[i].dataset.title) {
        if (!this.customTabs) {
          this.set('customTabs', [nodes[i].dataset.title]);
        } else {
          this.push('customTabs', [nodes[i].dataset.title]);
        }
      }
    }
  }

  _processRemovedNodes(nodes) {
    const titles = this.customTabs;
    if (!nodes || !titles) {
      return;
    }
    nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    if (!nodes.length) {
      return;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
      const title = nodes[i].dataset.title;
      if (title) {
        const index = titles.indexOf(title);
        if (index !== -1) {
          this.splice('customTabs', index, 1);
        }
      }
    }
  }

  _processValues(values) {
    values = this.$.request._processValues(values);
    values = this.$.data._processValues(values);
    values = this.$.privacy._processValues(values);
    values = this.$.view._processValues(values);
    return values;
  }

  _setSettings(values) {
    this.$.request._setSettings(values);
    this.$.data._setSettings(values);
    this.$.privacy._setSettings(values);
    this.$.view._setSettings(values);
  }
}
window.customElements.define('arc-settings-panel', ArcSettingsPanel);
