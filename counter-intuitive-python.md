# Counter intuitive python????

## 1

Uh oh how to fix this name error????

```py
class Node:
    def __init__(self, x: int, y: int, isOn: bool = False):
        self.x = x
        self.y = y
        self.isOn = isOn

    def __repr__(self):
        return f"{self.isOn}@{self.x},{self.y}"

    # NameError: Node is not defined
    def isBetween(self, nodeA: Node, nodeB: Node):
        return (
            self.x == (nodeA.x + nodeB.x) / 2 and
            self.y == (nodeA.y + nodeB.y) / 2
        )
```

<details>
<summary>Solution</summary>

Note: Please see the explanation
```py
from __future__ import annotations
```

</details>

<details>
<summary>Explanation</summary>

Another solution is to just put quotes around `Node`.

It's just a type hint, so it's ok to use a string instead of the class.

In fact that's what `from __future__ import annotations` does by default

(Note: Python doesn't check the types at runtime, they're just for programmers)
</details>
