import { html, css } from 'lit-element';
import { ArcSettingsBase } from './ArcSettingsBase.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tabs.js';
import '@anypoint-web-components/anypoint-tabs/anypoint-tab.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '../request-settings-panel.js';
import '../data-settings-panel.js';
import '../privacy-settings-panel.js';
import '../view-settings-panel.js';
import '../electron-experiments-settings-panel.js';
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
 * @demo demo/index.html
 * @memberof UiElements
 * @appliesMixin ArcSettingsPanelMixin
 */
export class ArcSettingsPanel extends ArcSettingsBase {
  static get styles() {
    return [
      ArcSettingsBase.styles,
      css`
      .container {
        display: flex:
        flex-direction: row;
        height: 100%;
      }

      :host([narrow]) .container {
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

      .nav > anypoint-item {
        cursor: pointer;
      }
      `
    ];
  }

  static get properties() {
    return {
      /**
       * Currently selected settings panel.
       */
      selected: { type: Number },
      /**
       * When set it renders narrow view.
       * It replaces side navigation with paper tabs
       */
      narrow: { type: Boolean, reflect: true },
      /**
       * When set `systemVariables` options in request settings is disabled.
       * Chrome apps does not have this option.
       */
      systemVariablesDisabled: { type: Boolean },
      /**
       * A link to application privacy policy
       */
      privacyPolicyUrl: { type: String },
      /**
       * When set REST APIs are supported in the application.
       */
      restApis: { type: Boolean },
      /**
       * When set it renders experiments tab for Electron app.
       */
      hasExperiments: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.selected = 0;
  }

  _processValues(values) {
    const panel = this.shadowRoot.querySelector('[data-settings="true"]');
    if (panel) {
      values = panel._processValues(values);
    }
    return values;
  }

  _setSettings(values) {
    const panel = this.shadowRoot.querySelector('[data-settings="true"]');
    if (panel) {
      panel._setSettings(values);
    }
  }

  _selectionHandler(e) {
    this.selected = e.detail.value;
  }

  _tabsTemplate() {
    const { selected, hasExperiments, compatibility } = this;
    return html`
    <anypoint-tabs
      .selected="${selected}"
      @selected-changed="${this._selectionHandler}"
      ?compatibility="${compatibility}">
      <anypoint-tab ?compatibility="${compatibility}">Request</anypoint-tab>
      <anypoint-tab ?compatibility="${compatibility}">Data</anypoint-tab>
      <anypoint-tab ?compatibility="${compatibility}">Privacy</anypoint-tab>
      <anypoint-tab ?compatibility="${compatibility}">View</anypoint-tab>
      ${hasExperiments ? html`<anypoint-tab ?compatibility="${compatibility}">Experiments</anypoint-tab>` : ''}
    </anypoint-tabs>`;
  }

  _listTemplate() {
    const { selected, hasExperiments, compatibility, outlined } = this;
    return html`
    <anypoint-dropdown-menu
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      name="viewListType">
      <label slot="label">Settings page</label>
      <anypoint-listbox
        class="nav"
        slot="dropdown-content"
        .selected="${selected}"
        @selected-changed="${this._selectionHandler}">
        <anypoint-item>Request</anypoint-item>
        <anypoint-item>Data</anypoint-item>
        <anypoint-item>Privacy</anypoint-item>
        <anypoint-item>View</anypoint-item>
        ${hasExperiments ? html`<anypoint-item>Experiments</anypoint-item>` : ''}
      </anypoint-listbox>
    </anypoint-dropdown-menu>`;
  }

  _requestTemplate() {
    const { systemVariablesDisabled, compatibility, outlined } = this;
    return html`<request-settings-panel
      data-settings="true"
      ?systemVariablesDisabled="${systemVariablesDisabled}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"></request-settings-panel>`;
  }

  _dataTemplate() {
    const { restApis, compatibility, outlined } = this;
    return html`<data-settings-panel
      data-settings="true"
      ?restApis="${restApis}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"></data-settings-panel>`;
  }

  _privacyTemplate() {
    const { privacyPolicyUrl, compatibility, outlined } = this;
    return html`<privacy-settings-panel
      data-settings="true"
      ?privacyPolicyUrl="${privacyPolicyUrl}"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"></privacy-settings-panel>`;
  }

  _viewTemplate() {
    const { compatibility, outlined } = this;
    return html`<view-settings-panel
      data-settings="true"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"></view-settings-panel>`;
  }

  _experimentsTemplate() {
    const { compatibility, outlined } = this;
    return html`<electron-experiments-settings-panel
      data-settings="true"
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"></electron-experiments-settings-panel>`;
  }

  _pageTemplate() {
    const { selected } = this;
    switch (selected) {
      case 0: return this._requestTemplate();
      case 1: return this._dataTemplate();
      case 2: return this._privacyTemplate();
      case 3: return this._viewTemplate();
      case 4: return this._experimentsTemplate();
    }
  }

  render() {
    const { narrow } = this;
    return html`
    <div class="container">
    ${narrow ? this._listTemplate() : this._tabsTemplate()}
    ${this._pageTemplate()}
    </div>`;
  }
}
