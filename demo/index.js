
import { html } from 'lit-html';
import { ArcDemoPage } from '@advanced-rest-client/arc-demo-helper/ArcDemoPage.js';
import '@anypoint-web-components/anypoint-checkbox/anypoint-checkbox.js';
import '@anypoint-web-components/anypoint-button/anypoint-button.js';
import '@advanced-rest-client/arc-demo-helper/arc-interactive-demo.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@advanced-rest-client/arc-local-store-preferences/arc-local-store-preferences.js';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/url-history-model.js';
import '@advanced-rest-client/arc-models/websocket-url-history-model.js';
import '@advanced-rest-client/arc-models/auth-data-model.js';
import '@advanced-rest-client/arc-models/host-rules-model.js';
import '@advanced-rest-client/arc-models/rest-api-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '@advanced-rest-client/arc-data-export/arc-data-export.js';
import '../arc-settings-panel.js';

class DemoPage extends ArcDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'restApis',
      'systemVariablesDisabled',
      'hasExperiments'
    ]);
    this._componentName = 'arc-settings-panel';
    this.demoStates = ['Filled', 'Outlined', 'Anypoint'];
    this.restApis = true;
    this.hasExperiments = true;

    this._demoStateHandler = this._demoStateHandler.bind(this);
    this._toggleMainOption = this._toggleMainOption.bind(this);

    window.addEventListener('file-data-save', this._fileExportHandler);
    window.addEventListener('google-drive-data-save', this._driveExportHandler);
  }

  _toggleMainOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoStateHandler(e) {
    const state = e.detail.value;
    this.outlined = state === 1;
    this.compatibility = state === 2;
  }

  _fileExportHandler(e) {
    e.preventDefault();
    e.detail.result = new Promise((resolve) => {
      console.log('File export handled');
      setTimeout(() => resolve(), 1000);
    });
  }

  _driveExportHandler(e) {
    e.preventDefault();
    e.detail.result = new Promise((resolve) => {
      console.log('Drive export handled');
      setTimeout(() => resolve({
        id: 'demo-id'
      }), 1000);
    });
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      compatibility,
      outlined,
      restApis,
      systemVariablesDisabled,
      hasExperiments
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the ARC settings panel element with various
          configuration options.
        </p>

        <arc-interactive-demo
          .states="${demoStates}"
          @state-chanegd="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <arc-settings-panel
            ?compatibility="${compatibility}"
            ?outlined="${outlined}"
            slot="content"
            ?restApis="${restApis}"
            ?systemVariablesDisabled="${systemVariablesDisabled}"
            ?hasExperiments="${hasExperiments}"></arc-settings-panel>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="restApis"
            @change="${this._toggleMainOption}"
          >
            REST APIs
          </anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="systemVariablesDisabled"
            @change="${this._toggleMainOption}"
          >
            Disable sys. vars.
          </anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            checked
            name="hasExperiments"
            @change="${this._toggleMainOption}"
          >
            Experiments
          </anypoint-checkbox>

        </arc-interactive-demo>
      </section>
    `;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          Advanced REST Client settings panel.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>The settings panel comes with 2 predefied styles:</p>
        <ul>
          <li><b>Material</b> - Normal state</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <arc-local-store-preferences></arc-local-store-preferences>
      <arc-data-export></arc-data-export>
      <project-model></project-model>
      <request-model></request-model>
      <auth-data-model></auth-data-model>
      <url-history-model></url-history-model>
      <websocket-url-history-model></websocket-url-history-model>
      <rest-api-model></rest-api-model>
      <variables-model></variables-model>
      <host-rules-model></host-rules-model>
      <arc-data-export></arc-data-export>

      <h2>ARC settings panel</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}

const instance = new DemoPage();
instance.render();
window._demo = instance;
