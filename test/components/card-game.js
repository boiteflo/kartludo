export default {
  name: 'CardGame',
  props: ['element'],
  template: `
    <div class="card">
      <h2>Game Card</h2>
      <p>Location X: {{ element.x }}</p>
      <p>Location Y: {{ element.y }}</p>
      <p>Width: {{ element.width }}</p>
    </div>
  `
};