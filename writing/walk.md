# Walking

Explaining EVERYTHING that could possibly impact walking.

## Newton's second law

When you are walking, how much force is needed to push yourself?

By Newton's second law,

$$\sum \vec{F} = m \vec{a}$$

## Acceleration

If you already have speed, by default you keep that speed (until friction or some other obstacle).

So, force is only theoretically needed if you need to accelerate: speed up or slow down.

Well, your legs have to move up and down in circles to maintain speed or stand up, but that will be dealt with later.

This equation is symmetric for either speeding up or slowing down. So both would take the same theoretical force.
In real life, it's much easier to slow down because friction and other stationary objects, again a topic for later.

Earth exerts a gravitation force which is a relative negative vertical acceleration of g=9.8 meters per second squared.
(Plagiarized from Wikipedia: <https://en.wikipedia.org/w/index.php?title=High-g_training&oldid=1235330437>) An untrained
individual usually black out (a complete loss of vision while still remaining consciousness, in contrast to a g-induced
loss of consciousness due to movement of blood away from the brain - consequently acceleration perpendicular to the spine
is much easier to withstand) between 4 and 6g, while rollar coasters typical do not expose the occupants to much more than
3g.

## Relativistic effects

It is highly unlikely for relativistic effects to be noticeable regarding walking, but it is technically possible for humans
be at that speed by having a low amount of acceleration for a very long time.

## Mass

If you are carrying something or even wearing slightly weighty clothes that will increase mass and require more
force by [Newton's second law](#newtons-second-law)

## Momentum

Substituting the definition of acceleration (derivative of velocity wrt time) in [Newton's second law](#newtons-second-law):

$$\sum \vec{F} = m \frac{\mathrm{d}\vec{v}}{\mathrm{d}t}$$

Note that momentum is mass times velocity. The momentum of large objects is greater than the momentum of lighter
objects at the same speed.

Assuming we can't change mass (deferred to later) then mass is constant and can be brought inside the derivative:

$$\sum \vec{F} = \frac{\mathrm{d}(m\vec{v})}{\mathrm{d}t} = \frac{\mathrm{d}\vec{p}}{\mathrm{d}t}$$

where $\vec{p}$ is momentum.

So the total force is the rate of change of momentum.

## Impulse

Impulse is defined as a change in momentum. If a ball bounces off a wall, the wall hath imparted impulse on the ball.

By equal and opposite reaction, when you push a wall (and the wall just stays still because it's massive), what seems
to happen is that you get pushed away from the wall. That is, you pushes the wall, the wall pushed you back.

Same with the ground. To move forward, you push the ground backward. A convenient way to turn is to push on a wall,
but pushing in a direction on the ground helps too. Note that the main feature allowing us to move forward on the ground
is friction.

Alternatively you can pull a rope. Maybe you are walking on roller blades on a pedestrian road, and you and your friend
are holding a rope. If the friend stands still like a wall, you can pull yourself forward towards your friend. Does
roller blading count as walking? Hmm.

For example, say you reflect your movement by bouncing on the bouncy castle wall or something. The impulse is:

$$\vec{J} = \Delta \vec{p} = \vec{p}_f - \vec{p}_i = {-m\vec{f}} - m\vec{f} = {-2m\vec{f}} = {-2\vec{p}_i}$$

So the wall imparts an impulse of negative twice your initial momentum from your initial momentum _in that direction_.

(Subscript i and f means initial and final respectively)

## Friction

Friction acts against intended motion. If you want to slow down, friction is your friend, if you want to keep speed
or increase speed, friction works against you. Of course, slowing down is not the only consideration, since you don't
want to crash and scrape yourself on the sidewalk.

Let $\mu$ be the friction coefficient of a surface: higher is less slippery.

Let $\vec{n}$ be the normal force: you don't go through a surface but along the surface. Any force going through the
surface is cancelled by normal force. This cancellation depends on how much forces would tend to go through the surface,
so normal force is directed perpendicularly away from the surface.

We have $\vec{f} = \mu \vec{n}$: friction is the friction coefficent of the surface times normal force. 

So, imagine you are sliding against the bouncy castle wall. Two scenarios: in both you walk forward but in the second
someone else is pushing you into the wall. In the second one, there is more friction, even though you slide against
the wall the same distance for both.

## Roundness, friction, and acceleration

Humans are not perfect spheres and the ground is not perfectly flat so there is extra friction. If you imagine a ball
rolling compared to a cube rolling, the edge of the cube tries to rotate into the ground, while the sphere rotates along
the ground and not into it. So, in order to stop quicker, plant your feet into the ground like the edge of a backwards
rolling cube, instead of just sliding against the ground like the sphere.

It is well known that rolling decreases friction against the ground damage. In turn, it preserves acceleration a bit
better. Humans cannot withstand too high accelerations, so this is another helpful thing about rolling. You might say
that rolling is not walking, so imagine multiple frontflips in a row instead, which is basically walking but someone
is spinning you around in between, or putting on low-friction spherical shoes in midair.

Another way to reduce acceleration safely is soft collision with snow, leaves, or feathers. Alternatively, if you are
walking on an extremely downhill slope, a parachute could be helpful to use the air to reduce acceleration. The steps
would look more like jumps but the motion is still the same, really.

## Spinning and moving forwards

Imagine you are walking and spinning at the same time. Why? Because it's fun, but more important is that if your
non-angular speed is constant throughout, you will move in a circle. Spin slowly enough relative to forward speed and
that circle looks more like an arc in the short term, i.e. it is more like turning, which is much more common since people
usually focus on what's in front of them instead of rapidly partaking fractions of a second of visual information. Also,
(AI: spinning moves the fluid in your inner ear's vestibular system rapidly, which signals to the brain that you are
moving. When you stop spinning, the fluid continues moving, creating a mismatch between what your brain expects and what
it senses, leading to dizziness and a feeling of being spun in the opposite direction). ((I like how due to Google's
botched quality of results the AI weighs equally some more extreme cases ranging from Neck Pain and Rhabdomyolysis and
Kidney Damage to Relativistic Effects)).

Consequently, to turn, you rotate about the vertical axis. And, for instance, turning right is typically done by rotating
about your right foot (moving forwards) than rotating about your left foot (moving backwards).

People typically move forwards instead of backwards for various reasons like being able to see forwards and your knees
bending in a way that more efficiently prefers going forwards.

Most people including me do not have such intuition about spinning when moving forwards, so without knowing that with
constant speed you should move in a circle, the attempted movement will probably be more like a 2D imprint of a helix
(DNA shape viewed at a certain angle) where at some points you turn faster and at others you move forward faster.
