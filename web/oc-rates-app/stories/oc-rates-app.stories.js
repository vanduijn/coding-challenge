import { html } from 'lit';
import '../src/oc-rates-app.js';

export default {
  title: 'OcRatesApp',
  component: 'oc-rates-app',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <oc-rates-app
      style="--oc-rates-app-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </oc-rates-app>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
