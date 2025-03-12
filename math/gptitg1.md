> GPT's solution to an integral from an integral bee

Let
$$I = \int_1^{2025} \frac{dx}{\sqrt{\lceil x-1 \rceil} + \sqrt{\lfloor x+1 \rfloor}}$$

Step 1: Simplify the Ceiling and Floor Functions

For $x \in [n, n+1)$ where $n$ is an integer:
- $\lceil x-1 \rceil = n$
- $\lfloor x+1 \rfloor = n+1$

Thus, the integral splits into sums over integer intervals:

$$I = \sum_{n=1}^{2024} \int_n^{n+1} \frac{dx}{\sqrt{n} + \sqrt{n+1}}$$

Step 2: Compute the Integral Over Each Interval

Using the identity:

$$\frac{1}{\sqrt{n} + \sqrt{n+1}} = \sqrt{n+1} - \sqrt{n}$$

we get:

$$I = \sum_{n=1}^{2024} \int_n^{n+1} (\sqrt{n+1} - \sqrt{n}) dx$$

Since the integral over $[n, n+1]$ is simply the width $(n+1) - n = 1$, we obtain:

$$I = \sum_{n=1}^{2024} (\sqrt{n+1} - \sqrt{n})$$

Step 3: Telescoping Sum

The sum telescopes, leaving:

$$I = \sqrt{2025} - \sqrt{1} = 45 - 1 = 44$$

Final Answer

$$\boxed{44}$$
