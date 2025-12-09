import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * DOM 操作封装 Composable
 * 提供常用的 DOM 操作功能
 * 
 * 需求：10.1 - DOM 操作应封装在 composables 中
 */
export function useDom() {
  /**
   * 滚动到元素底部
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @param {object} options - 滚动选项
   */
  const scrollToBottom = async (elementRef, options = {}) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.scrollTo({
        top: elementRef.value.scrollHeight,
        behavior: options.smooth ? 'smooth' : 'auto',
      })
    }
  }

  /**
   * 滚动到元素顶部
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @param {object} options - 滚动选项
   */
  const scrollToTop = async (elementRef, options = {}) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.scrollTo({
        top: 0,
        behavior: options.smooth ? 'smooth' : 'auto',
      })
    }
  }

  /**
   * 滚动到指定位置
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @param {number} position - 滚动位置
   * @param {object} options - 滚动选项
   */
  const scrollTo = async (elementRef, position, options = {}) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.scrollTo({
        top: position,
        behavior: options.smooth ? 'smooth' : 'auto',
      })
    }
  }

  /**
   * 检查元素是否在视口中
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @returns {boolean} - 是否在视口中
   */
  const isInViewport = (elementRef) => {
    if (!elementRef.value) return false

    const rect = elementRef.value.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  /**
   * 获取元素尺寸
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @returns {object} - 包含 width 和 height 的对象
   */
  const getElementSize = (elementRef) => {
    if (!elementRef.value) {
      return { width: 0, height: 0 }
    }

    const rect = elementRef.value.getBoundingClientRect()
    return {
      width: rect.width,
      height: rect.height,
    }
  }

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} - 是否成功
   */
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // 降级方案：使用 execCommand
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textarea)
        return success
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  /**
   * 聚焦元素
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   */
  const focusElement = async (elementRef) => {
    await nextTick()
    if (elementRef.value) {
      elementRef.value.focus()
    }
  }

  /**
   * 失焦元素
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   */
  const blurElement = (elementRef) => {
    if (elementRef.value) {
      elementRef.value.blur()
    }
  }

  /**
   * 监听元素尺寸变化
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @param {Function} callback - 尺寸变化时的回调函数
   * @returns {Function} - 清理函数
   */
  const observeResize = (elementRef, callback) => {
    if (!elementRef.value) return () => {}

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        callback({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    resizeObserver.observe(elementRef.value)

    return () => {
      resizeObserver.disconnect()
    }
  }

  /**
   * 监听点击外部
   * @param {Ref<HTMLElement>} elementRef - 元素引用
   * @param {Function} callback - 点击外部时的回调函数
   */
  const useClickOutside = (elementRef, callback) => {
    const handleClick = (event) => {
      if (elementRef.value && !elementRef.value.contains(event.target)) {
        callback(event)
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClick)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClick)
    })
  }

  /**
   * 监听键盘事件
   * @param {string} key - 键名
   * @param {Function} callback - 回调函数
   * @param {object} options - 选项（ctrl, shift, alt, meta）
   */
  const useKeyboard = (key, callback, options = {}) => {
    const handleKeydown = (event) => {
      const { ctrl, shift, alt, meta } = options

      if (event.key === key) {
        if (ctrl && !event.ctrlKey) return
        if (shift && !event.shiftKey) return
        if (alt && !event.altKey) return
        if (meta && !event.metaKey) return

        callback(event)
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
    })
  }

  return {
    scrollToBottom,
    scrollToTop,
    scrollTo,
    isInViewport,
    getElementSize,
    copyToClipboard,
    focusElement,
    blurElement,
    observeResize,
    useClickOutside,
    useKeyboard,
  }
}
