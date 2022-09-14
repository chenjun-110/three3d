// https://blog.csdn.net/Sheng_zhenzhen/article/details/108685176
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },

  globals: {
    defineEmits: true,
    document: true,
    localStorage: true,
    GLOBAL_VAR: true,
    window: true,
    defineProps: true,
    defineExpose: true
  },
  plugins: [],
  extends: ['plugin:vue/vue3-recommended'],

  rules: {
    //close lf error
    'import/no-unresolved': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/max-attributes-per-line':0,
    'no-unused-vars':0,
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-router-link-tag-prop': 'off',
    'import/extensions': 'off',
    'import/no-absolute-path': 'off',
    'no-async-promise-executor': 'off',
    'import/no-extraneous-dependencies': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/html-self-closing': 'off',
    'vue/attribute-hyphenation': 'off',
    "vue/v-on-event-hyphenation": 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-useless-escape': 'off',
    'no-bitwise': 'off',
    'vue/no-setup-props-destructure': ['off'],
    'vue/script-setup-uses-vars': ['off'],
    'no-param-reassign': ['off']
  }
}
