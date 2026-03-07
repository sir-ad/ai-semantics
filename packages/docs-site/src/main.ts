import { WebAdapter } from '@grain/web';

const adapter = new WebAdapter({
    theme: {
        '--grain-primary': 'var(--text)',
        '--grain-background': 'transparent',
        '--grain-border': 'var(--border)',
        '--grain-font-family': 'var(--font-sans)',
    }
});

const exampleGrain = `<message role="assistant">
  <think visible="true">Initializing Grain Preview...</think>
  <stream speed="fast">Welcome to the future of interaction.</stream>
  <layout direction="row" gap="20px">
    <chart type="bar" data='[10, 45, 30, 70]' label="Performance" />
    <form schema='{"type": "object", "properties": {"email": {"type": "string"}}}' />
  </layout>
</message>`;

const target = document.getElementById('grain-render-target');
if (target) {
    adapter.render(exampleGrain, { container: target });
}
