import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css' // optional for styling

/**
 * @param content Either raw content or HTML element array in order to have more flexibility on placement of content
 */
const getContent = (content: string | Array<string>) =>  {
  if (Array.isArray(content)) {
    return content.join('<br>');
  } else {
    return content;
  }
}

export default {
  mounted(el, binding) {
    if (!binding.value) return;

    const content = getContent(binding.value);

    tippy(el, {
      content: el.dataset['tippySize'] === 'xs' ? `<div class='text-xs'>${binding.value}</div>` : binding.value,
      allowHTML: true,
      placement: el.dataset['tippy-placement'] || 'top'
    });
  },
  updated(el, binding) {
    if (!binding.value) return;

    const content = getContent(binding.value);

    if (binding.value !== binding.oldValue) {
      el._tippy.setContent(content);
    }
  },
  beforeUnmount(el) {
    if (el.__popper__) {
      el.__tippy.destroy()
    }
  }
}
