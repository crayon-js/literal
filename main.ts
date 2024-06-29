// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { ColorSupport, prototype } from "@crayon/crayon/raw";
import { replace, replaceAll } from "@crayon/crayon/utils";

import crayon from "@crayon/crayon/base";
import type { Attribute, FourBitColor } from "@crayon/crayon/styles";

type BaseStyle = FourBitColor | Attribute;
const literalStyleRegex = /{([^\s{}]+)\s([^{}]+)}/;

// Parse string to a type
// e.g. "0" -> 0
//      "\"Hello\"" -> "Hello"
//      "`Hello`" -> "Hello"
//      "true" -> true
function compileType(string: string): string | number | boolean {
  switch (string) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      switch (string[0]) {
        case '"':
        case "'":
        case "`":
          return string.slice(1, -1);
        default:
          return Number(string);
      }
  }
}

// Parse string to crayon style method's styleBuffer
// e.g
//    "rgb(123,50,30)" -> crayon.rgb(123, 50, 30).styleBuffer
//    "bgHex(0xFF00FF)" -> crayon.bgHex(0xFF00FF).styleBuffer
export function parseStyleMethod(call: string): string {
  let methodName = "";
  let intermediate = "";
  const args = [];

  loop: for (let i = 0; i < call.length; i++) {
    const char = call[i];
    switch (char) {
      case ")":
        if (intermediate) args.push(compileType(intermediate));
        break loop;
      case "(":
        methodName = intermediate;
        intermediate = "";
        continue;
      case ",":
        args.push(compileType(intermediate));
        intermediate = "";
        continue;
      default:
        intermediate += char;
    }
  }

  // @ts-expect-error dynamic type
  return crayon[methodName]?.(...args)?.styleBuffer;
}

export function parseStyle(style: string): string {
  if (style.endsWith(")")) {
    return parseStyleMethod(style);
  }
  return crayon[style as BaseStyle]?.styleBuffer;
}

/** Implementation for Crayon's `prototype.literal` call when using ES6 Literal Templates */
export function literal(
  callSite: TemplateStringsArray,
  ...substitutions: unknown[]
): string {
  let text = "";
  for (let i = 0; i < callSite.length; ++i) {
    text += callSite[i];
    text += substitutions[i] ?? "";
  }

  let matches = text.match(literalStyleRegex);
  while (matches?.length) {
    const [section, styles, body] = matches;

    if (prototype.$colorSupport === ColorSupport.NoColor) {
      text = replace(text, section, body);
      matches = text.match(literalStyleRegex);
      continue;
    }

    let styleBuffer = "";
    for (const style of styles.split(".")) {
      const parsedStyle = parseStyle(style);
      if (!parsedStyle) throw new Error(`Invalid style: ${style}`);
      styleBuffer += parsedStyle;
    }

    const matchedText = replaceAll(body, "\x1b[0m", "\x1b[0m" + styleBuffer);
    text = replace(text, section, styleBuffer + matchedText + "\x1b[0m");

    matches = text.match(literalStyleRegex);
  }

  return text;
}

prototype.literal = literal;
