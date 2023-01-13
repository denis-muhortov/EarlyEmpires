<template>
  <transition
    :enter-active-class="transition.enter"
    :leave-active-class="transition.leave"
  >
    <div
      v-show="isActive"
      :class="['c-toast', `c-toast--${mutType}`, `c-toast--${position}`]"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click="click"
      role="alert"
      v-html="mutMessage"
    />
  </transition>
</template>

<script>
import { removeElement } from './helpers/remove-element'
import Timer from './helpers/timer'
import Positions, { definePosition } from './defaults/positions'
import eventBus from './helpers/event-bus'

export default {
  name: 'promise-toast',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'default'
    },
    position: {
      type: String,
      default: Positions.BOTTOM_RIGHT,
      validator(value) {
        return Object.values(Positions).includes(value)
      }
    },
    maxToasts: {
      type: [Number, Boolean],
      default: false
    },
    duration: {
      type: [Number, Boolean],
      default: 4000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    queue: {
      type: Boolean,
      default: false
    },
    pauseOnHover: {
      type: Boolean,
      default: true
    },
    useDefaultCss: {
      type: Boolean,
      default: true
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    onSuccessMessage: {
      type: Function,
      default: () => {}
    },
    asyncFunction: {
      type: Function,
      default() {
        return Promise.resolve();
      }
    }
  },
  data() {
    return {
      isActive: false,
      parentTop: null,
      parentBottom: null,
      isHovered: false,
      timer: null,
      mutMessage: this.message,
      mutType: this.type,
    }
  },
  beforeMount() {
    this.createParents()
    this.setDefaultCss()
    this.setupContainer()
  },
  mounted() {
    this.showNotice()
    eventBus.$on('toast-clear', this.close)
  },
  methods: {
    createParents() {
      this.parentTop = document.querySelector('.c-toast-container--top')
      this.parentBottom = document.querySelector('.c-toast-container--bottom')

      if (this.parentTop && this.parentBottom) return

      if (!this.parentTop) {
        this.parentTop = document.createElement('div')
        this.parentTop.className = 'c-toast-container c-toast-container--top'
      }

      if (!this.parentBottom) {
        this.parentBottom = document.createElement('div')
        this.parentBottom.className =
          'c-toast-container c-toast-container--bottom'
      }
    },
    setDefaultCss() {
      const type = this.useDefaultCss ? 'add' : 'remove'
      this.parentTop.classList[type]('v--default-css')
      this.parentBottom.classList[type]('v--default-css')
    },
    setupContainer() {
      const container = document.body
      container.appendChild(this.parentTop)
      container.appendChild(this.parentBottom)
    },
    shouldQueue() {
      if (!this.queue && this.maxToasts === false) {
        return false
      }

      if (this.maxToasts !== false) {
        return (
          this.maxToasts <=
          this.parentTop.childElementCount + this.parentBottom.childElementCount
        )
      }

      return (
        this.parentTop.childElementCount > 0 ||
        this.parentBottom.childElementCount > 0
      )
    },
    showNotice() {
      if (this.shouldQueue()) {
        this.queueTimer = setTimeout(this.showNotice, 250)
        return
      }

      this.correctParent.insertAdjacentElement('afterbegin', this.$el)
      this.isActive = true



      this.asyncFunction().then((result) => {
        this.mutMessage = this.onSuccessMessage(result) ?? this.mutMessage
        this.mutType = 'success'
      }).catch((e) => {

        console.log(e);
        let error = e.error;


        if (!error) {
          this.mutMessage = e.message;
        } else if (error.code == 3050003) {
          this.mutMessage = error.details[0].message.split('message:')[1];
        } else {
          this.mutMessage = error.details[0].message;
        }
        this.mutType = 'error'
      }).finally(() => {
        this.timer = this.duration !== false ? new Timer(this.close, this.duration) : null
      })


      // this.timer =
      //   this.duration !== false ? new Timer(this.close, this.duration) : null
    },
    click() {
      this.onClick.apply(null, arguments)

      if (this.dismissible) {
        this.close()
      }
    },
    toggleTimer(newVal) {
      if (this.timer && this.pauseOnHover) {
        newVal ? this.timer.pause() : this.timer.resume()
      }
    },
    stopTimer() {
      this.timer && this.timer.stop()
      clearTimeout(this.queueTimer)
    },
    close() {
      this.stopTimer()
      this.isActive = false
      setTimeout(() => {
        this.onClose.apply(null, arguments)
        removeElement(this.$el)
      }, 150)
    }
  },
  computed: {
    correctParent() {
      return definePosition(this.position, this.parentTop, this.parentBottom)
    },
    transition() {
      return definePosition(
        this.position,
        {
          enter: 'fadeInDown',
          leave: 'fadeOut'
        },
        {
          enter: 'fadeInUp',
          leave: 'fadeOut'
        }
      )
    }
  },
  beforeUnmount() {
    eventBus.$off('toast-clear', this.close)
  }
}
</script>
<style lang="stylus">
@import './themes/default/index.styl'
.v--default-css
  @import './themes/default/colors.styl'
  @import './themes/default/toast.styl'
</style>
