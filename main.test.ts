// Copyright 2024 Im-Beast. All rights reserved. MIT license.
import { env, test } from "@beast/compat";
import { assert, assertEquals, assertThrows } from "@std/assert";

import crayon from "@crayon/crayon";
import "./main.ts";

const NO_COLOR = !!(env("NO_COLOR") && env("NO_COLOR") !== "0");

test.ignoreIf(!NO_COLOR)("NO_COLOR Literal", () => {
  assertEquals(crayon`{bold.rgb(255) {red Hello {yellow world}}}`, "Hello world");
});

test.ignoreIf(NO_COLOR)("Literal", () => {
  assert(crayon`{red {bold Hello} world!}`.endsWith("\x1b[0m"));
  assertEquals(
    crayon`{red {bold Hello} world!}`,
    "\x1b[31m\x1b[1mHello\x1b[0m\x1b[31m world!\x1b[0m",
  );

  const styledText = "{rgb(255,0,17) methods {bgRgb(127,255,0) work!}}";
  assertEquals(
    crayon`${styledText}`,
    crayon`{rgb(255,0,17) methods {bgRgb(127,255,0) work!}}`,
  );

  assertEquals(
    crayon`{rgb(255,0,17) methods {bgRgb(127,255,0) work!}}`,
    "\x1b[38;2;255;0;17mmethods \x1b[48;2;127;255;0mwork!\x1b[0m\x1b[38;2;255;0;17m\x1b[0m",
  );
});

test.ignoreIf(NO_COLOR)("Errors", () => {
  assertThrows(() => crayon`{inexistentStyle xyz}`);
});
