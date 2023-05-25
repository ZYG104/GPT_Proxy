<script setup lang="ts">
import { marked } from "marked";
import Prism from "prismjs";
import { onMounted } from "vue";

import "prismjs/themes/prism.min.css";
import "prismjs/themes/prism-okaidia.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js";
import "prismjs/plugins/toolbar/prism-toolbar.min.css";
import "prismjs/plugins/toolbar/prism-toolbar.min.js";
import "prismjs/plugins/show-language/prism-show-language.min.js";
import "prismjs/plugins/highlight-keywords/prism-highlight-keywords.min.js";
import "./custom.css";

const props = defineProps(["content"]);

const parser = (content: string) => {
  const renderer = new marked.Renderer();

  renderer.code = (code, language: string) => { 
    if (Prism.languages[language]) {
      const highlightedCode = Prism.highlight(
        code,
        Prism.languages[language],
        language
      );
      return `<pre class="line-numbers language-${language}" ><code class="language-${language}">${highlightedCode}</code></pre>`;
    } else {
      const unknowLanguage = Prism.util.encode(code);
      return `<pre class="line-numbers"><code class="language-unknow">${unknowLanguage}</code></pre>`;
    }
  };

  return marked(content, { renderer });
};

// 自定义复制按钮
function setCopyBtn() {
  if (!Prism) {
    return;
  }

  const status = {
    default: "custom-copy-button-default icon-copy-default",
    success: "custom-copy-button-default icon-copy-success",
    error: "custom-copy-button-default icon-copy-error",
  };

  Prism.plugins.toolbar.registerButton("customCopy", function (env: any) {
    const copyBtn = document.createElement("div");
    copyBtn.className = "custom-copy-button";
    const icon = document.createElement("span");
    icon.className = status.default;
    copyBtn.appendChild(icon);

    const copyText = env.element.textContent;

    copyBtn.addEventListener("click", function () {
      if (navigator.clipboard) {
        try {
          navigator.clipboard.writeText(copyText);
          copySuccess(copyBtn, icon);
        } catch (error) {
          copyError(copyBtn, icon);
        }
      } else {
        const status = clipboardDisabled(copyText);
        if (status) {
          copySuccess(copyBtn, icon);
        } else {
          copyError(copyBtn, icon);
        }
      }
    });

    return copyBtn;
  });

  function copySuccess(btn: HTMLElement, icon: HTMLElement) {
    btn.classList.add("custom-copy-button-success");
    icon.className = status.success;
    setTimeout(() => {
      btn.classList.remove("custom-copy-button-success");
      icon.className = status.default;
    }, 1000);
  }

  function copyError(btn: HTMLElement, icon: HTMLElement) {
    btn.classList.add("custom-copy-button-error");
    icon.className = status.error;
    setTimeout(() => {
      btn.classList.remove("custom-copy-button-error");
      icon.className = status.default;
    }, 1000);
  }
}

// navigator.clipboard 被禁用时的备选方案
function clipboardDisabled(copyText: string): boolean {
  let status = false;

  const textArea = document.createElement("textarea");
  textArea.value = copyText;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    if (successful) {
      status = true;
    } else {
      status = false;
    }
  } catch (err) {
    status = false;
  }

  document.body.removeChild(textArea);

  return status;
}

onMounted(() => {
  setCopyBtn();
  Prism.highlightAll();
});
</script>
<template>
  <div v-html="parser(props.content)"></div>
</template>
