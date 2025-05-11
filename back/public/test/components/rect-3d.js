export default {
  name: 'rect-3d',
  props: ['element', 'json'],
  template: `
    <div 
      v-if="element"
      class="absolute"
      :style="{
        top: element.y + 'px',
        left: element.x + 'px',
        width: element.width + 'px',
        height: element.height + 'px',
        transform: 'rotateX(' + element.yaw + 'deg)',
        'background-color':element.color ? element.color : 'gray'
      }"
    >
      <slot></slot>
      <span v-if="json">{{ JSON.stringify(element, null, 2) }}</span>
    </div>
  `
};