export default {
  name: 'rect-triangle',
  props: ['element', 'json'],
  template: `
  <div 
      v-if="element"
      class="absolute"
      :style="{
        top: element.y + 'px',
        left: element.x + 'px',
        width: (element.width - element.height) + 'px',
        height: element.height + 'px'
      }"
    >
      <div class="relative" :style="{'background-color':(element.color ? element.color : 'gray'), width: '100%', height: '100%'}">
          <slot></slot>
          <span v-if="json">{{ JSON.stringify(element, null, 2) }}</span>
          <div class="triangle absolute" :style="{
            top:'0px',
            'aspect-ratio': '1 / 1',
            'right': '-' + Math.round(element.height) + 'px',
            'border-bottom': Math.round(element.height) + 'px solid transparent',
            'border-left': Math.round(element.height) + 'px solid ' + element.color
            }">
          </div>
      </div>
</div>
  `
};