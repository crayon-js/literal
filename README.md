# 📝 Crayon Literal Templates

## 📚 About

`@crayon/literal` is an extension for [Crayon](https://github.com/crayon-js/crayon) that adds
support for styling using ES6 Literal Templates.

## ⚙️ Usage

```ts
// Remember to replace "version" with semver version
import crayon from "@crayon/crayon";
import "@crayon/literal";

console.log(
  crayon`{red I'm red! {blue I'm blue!} {bgBlue.bold I'm kind of both! But also bold!}}`,
);

// Methods are also supported
console.log(
  crayon`{rgb(0,255,0) Im green {bgHex(0xFF0000) and I have red background}}`,
);
```

## 🤝 Contributing

**Crayon** is open for any contributions.\
If you feel like you can enhance this project - please open an issue and/or pull request.\
Code should be well document and easy to follow what's going on.

**Crayon 4.x** follows [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).\
If your pull request's code could introduce understandability trouble, please add comments to it.

## 📝 Licensing

This project is available under **MIT** License conditions.
