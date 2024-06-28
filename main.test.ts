import { test } from "@cross/test";
import { assert, assertEquals, assertThrows } from "@std/assert";

import crayon from "@crayon/crayon";
import "./main.ts";

test("Literal", () => {
  assert(crayon`{red {bold Hello} world!}`.endsWith("\x1b[0m"));
  assertEquals(
    crayon`{red {bold Hello} world!}`,
    "\x1b[31m\x1b[1mHello\x1b[0m\x1b[31m world!\x1b[0m",
  );
  assertEquals(
    crayon`{rgb(255,0,17) methods {bgRgb(127,255,0) work!}}`,
    "\x1b[38;2;255;0;17mmethods \x1b[48;2;127;255;0mwork!\x1b[0m\x1b[38;2;255;0;17m\x1b[0m",
  );
});

test("Errors", () => {
  assertThrows(() => crayon`{inexistentStyle xyz}`);
});
