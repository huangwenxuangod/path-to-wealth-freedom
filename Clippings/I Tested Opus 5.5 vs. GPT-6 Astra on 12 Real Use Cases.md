---
title: "I Tested Opus 5.5 vs. GPT-6 Astra on 12 Real Use Cases"
source: "https://x.com/nateherk/status/2102904721698599231"
author:
  - "[[@nateherk]]"
published: 2026-09-24
created: 2026-09-24
description: "I put Claude Opus 5.5 and GPT-6 Astra through 12 tasks I'd actually use AI for, from editing videos and building websites to creating busine..."
tags:
  - "clippings"
---
![Image](https://pbs.twimg.com/media/HS8EoOkWcAAe6N4?format=jpg&name=large)

I put Claude Opus 5.5 and GPT-6 Astra through 12 tasks I'd actually use AI for, from editing videos and building websites to creating business deliverables and playable games.

My final score was 8–4 for Opus, but Astra used about 45% less time and came in about 38% lower on estimated API cost across those runs.

I preferred a lot of what Opus made. I also came away with several reasons to keep using Astra.

**TL;DR**

→ Opus won my website, video-editing, business-deliverable, learning-world, animated-story, Canva-drawing, and book-site comparisons.

→ Astra won the museum game, trip planner, coding challenge, and Instagram carousel.

→ These were my judgments in Claude Code and Codex, with both models on high effort. Many of the calls came down to my taste.

→ All dollar amounts below are estimated API costs. I ran the work through subscriptions.

→ I still want to test what happens when I give both models the same dollar budget and let the cheaper first attempt improve with feedback.

## How I Ran the Comparison

I sent the same prompts to the models in their respective apps, using the same relevant files, guidelines, and skills for the comparisons.

Both ran on high effort. For the cost comparison, I estimated what the work would have cost under API billing, because subscription usage doesn't translate into a simple per-task dollar charge.

The pricing I used put Astra's token rates at 2.5 times Opus's. That made its lower total task cost especially interesting to me: a higher token rate doesn't automatically mean a more expensive completed job.

I also fixed a mistake from my previous comparison, where two agents had ended up working on shared files. This time, I used separate worktrees so they couldn't touch each other's work.

Some Opus outputs were carried over from those earlier experiments, and I ran the same tasks with Astra. This is a comparison of my actual workflows and outputs, including the apps and tools around the models, rather than a controlled test of model intelligence alone.

The creative scores are personal. You might prefer a design that I didn't, which is why the actual outputs matter more than the tally by itself.

## 1\. Building a Branded Website

I gave both models the same PERKFORM brand guidelines and website prompt.

Opus layered the keys and coffee can separately from the background, brought text in as I scrolled, and built a can-opening animation around pulling the tab. It also created product imagery and rotating flavor visuals.

Opus's hero used a dark background with the can and keys layered in front.

![Image](https://pbs.twimg.com/media/HS8DLXAXsAAIG3Q?format=jpg&name=large)

The page felt like it was telling a story. Some details still needed work, including an awkwardly small piece of text, but I preferred the overall flow and darker hero section.

Astra made a lighter version with a large background word, layered product elements, and a flavor selector that changed the surrounding color. That flavor-selector section felt clean and premium to me.

Its animation merging coffee and protein into one idea was less smooth, and the first impression felt cheaper than Opus's.

→ Opus: about 40 minutes and $18.32.

→ Astra: about 32 minutes and $11.33.

**My winner: Opus.** Astra finished sooner for less estimated cost, but I preferred the design Opus gave me.

Both used the same reusable website skill. The difference came from the decisions each model made with that starting point.

## 2\. Editing an Event Sizzle Reel

I gave the agents a folder with 105 GB of footage from AIS Live and asked for a 30-second promotional reel for the October 17–18 event, edited with HyperFrames.

Opus built a much more energetic edit. It synchronized motion to the music, layered recordings over other footage, and used shadows and opacity to give the composition depth.

The Opus edit layered footage and graphics instead of just putting captions over a recording.

![Image](https://pbs.twimg.com/media/HS8DJ2nWwAAoH0f?format=jpg&name=large)

Astra found relevant B-roll and understood what it was looking at, but the opening felt awkward and quiet. The music came in slowly, and the whole piece lacked the energy I wanted for an event promo.

→ Opus: about 31 minutes and $10.

→ Astra: about 39 minutes and almost $22.

**My winner: Opus.** I preferred the result, and it also took less time and estimated cost in this run.

## 3\. Turning a Recording Into an Instagram Reel

Next, I gave them the same recording of me and asked for an Instagram reel using HyperFrames and the reel skill from my student kit.

The recording explains three ideas from my Karpathy breakdown: write a spec, define a verifier, and build an environment with the instructions and context the agent needs.

That gave both editors the same message to work with. Opus's version felt more engaging because of the B-roll, animation choices, and pacing.

Opus used a nested spec, verifier, and environment graphic in the reel.

![Image](https://pbs.twimg.com/media/HS8DH0kXIAAuSiG?format=jpg&name=large)

Some sound effects were a little much, so I wouldn't call it finished without adjustments. But Astra's version felt much plainer to watch.

Astra ran for about half the time and came in around $9, compared with roughly $11 for Opus.

**My winner: Opus.** I'd pay the difference for that stronger starting point.

I've had better editing results from Astra before. These attempts felt weaker to me, but that is an observation from my usage, not proof that the model itself changed.

## 4\. Creating a Business Deliverable Package

I gave each agent fictional company data for BrightPath and asked for an investor deck, a financial report, an analytics dashboard, and a client landing page.

I used a /goal prompt. One thing I liked about Astra in Codex was that it asked clarifying questions while keeping the work moving. For missing metrics, it asked what I wanted to use instead of leaving me to discover the gap later.

Astra's 17-slide deck was clean and restrained, although I wanted stronger branding and more visual depth. Its spreadsheet was neatly formatted, but many of the formulas I inspected were basic sums.

Opus's deck used imagery, visual boundaries, and charts in a way I preferred. Its financial workbook also felt more like an analysis, with sections for unit economics, cash, runway, and forecasts.

Opus's workbook had more formulas and references, which would make it easier to change inputs and see the report update.

For example, its unit-economics tab included a formula calculating LTV to CAC from other cells.

![Image](https://pbs.twimg.com/media/HS8DFtxXgAAOiFr?format=jpg&name=large)

That's something I care about in a deliverable. I don't want to regenerate a spreadsheet every time one input changes.

The dashboards were fairly similar. Both let me inspect different areas of the company, and neither stood out as dramatically better.

I preferred Opus's landing page because it told a clearer story with the data and visuals. It still had details I would change, including some odd alignment.

Opus finished roughly six or seven minutes sooner and cost about a dollar more.

**My winner: Opus.** The formulas and overall presentation were worth that difference to me, while Astra's clarifying questions were a behavior I appreciated.

## 5\. Making a Museum Escape Game

The prompt asked for a polished browser game where the player escapes a miniature museum after closing: three connected rooms, an inventory, five linked puzzles, contextual hints, sound controls, and an ending.

Opus interpreted that as an immersive first-person experience. It opened with a story, music, a dark museum, moonlight, and a flashlight. The world had atmosphere, although the camera controls took some getting used to.

Astra's game, The Last Curator, was easier for me to start interacting with immediately.

It felt more like a puzzle scene I was looking into. I could inspect a clock, read clues, work out the order of symbols, and open a cabinet without first figuring out how to move around a larger environment.

Opening the collection cabinet revealed another clue to read.

![Image](https://pbs.twimg.com/media/HS8DDf9WwAApGKd?format=jpg&name=large)

→ Opus: roughly 90 minutes and $31.

→ Astra: roughly 34 minutes and $8.

**My winner: Astra.** I liked Opus's ambition, but Astra gave me an accessible starting point much sooner and at a lower cost.

I didn't play either game all the way through in this comparison. My judgment here was based on the experience I explored, not a claim that every puzzle and ending had passed a full playthrough.

## 6\. Building a 3D World From My Videos

I asked both agents to use 100 of my recent YouTube videos, extract concepts, and turn them into a 3D world I could explore to learn those ideas.

Astra created rooms with concepts, experiments, quizzes, and stamps to collect. But I found some of the interactions confusing. I wanted something I could give a kid and have them understand what to do, and this didn't quite get there for me.

Opus created AI Explorer Academy, with a little robot, distinct rooms, and more intuitive demonstrations.

One experiment used balls to illustrate next-word prediction and temperature. Another let me compare an agent working in a loop with a one-shot attempt.

The rover demonstration put the think, act, check, and repeat steps inside a small obstacle course.

![Image](https://pbs.twimg.com/media/HS8DBqwXIAAHhMw?format=jpg&name=large)

There were still bugs. Some balls got stuck, and not every interaction was immediately obvious, but I preferred how the concepts were translated into things I could see and try.

→ Opus: 1 hour 44 minutes and roughly $60.

→ Astra: 45 minutes and roughly $12.

**My winner: Opus for the output I received.** The cost gap also makes this one worth testing again.

I want to give Astra feedback on that $12 version and let it keep going until it reaches the same $60 budget. I suspect it could improve substantially, but I haven't run that experiment yet.

It would also require more of my time to provide the feedback. That's part of the comparison, too.

## 7\. Planning a Month of Travel

I asked for an immersive 3D itinerary for October 1–30, with the links I'd need to plan the trip.

The route included Chicago, Iceland, Amsterdam for World Summit AI, San Francisco for AI events, California national parks, Zion and Bryce Canyon, and a return through Las Vegas.

Astra organized the itinerary around a globe with individual days and destinations I could click through.

![Image](https://pbs.twimg.com/media/HS8DAEyXcAA8nAz?format=jpg&name=large)

It included useful planning links, such as flight searches, driving routes, and park information. Opus found a similar overall itinerary, including events such as GitHub Universe, and added an autoplay journey through the days.

Opus's version was visually immersive, but it loaded slowly. Astra's felt a little cleaner to use.

→ Opus: about 29 minutes and $14.47.

→ Astra: about 32 minutes and $11.

**My winner: Astra.** Both were solid, but I preferred its presentation and access to the links.

These were planning outputs. I wasn't booking the trip or independently checking every reservation link during the comparison.

## 8\. Running a Coding Challenge

For the coding test, I had Grok design a challenge and had Fable 5.1 and GPT-6 Sol help review it. Then I gave that challenge to Opus and Astra and had the results reviewed again.

Both performed very well. The main scoring reported 100 out of 100 for each, although one Fable review included deductions with inconsistent arithmetic, so I wouldn't present the reviews as perfectly unanimous.

Astra's coding run took 35 minutes and 13 seconds at an estimated $9.14, compared with 2 hours and 29 minutes at $17.48 for Opus.

![Image](https://pbs.twimg.com/media/HS8C-UZXwAAsKa5?format=jpg&name=large)

That's less than a quarter of the runtime and roughly half the estimated cost.

**My winner: Astra.** The efficiency difference was much clearer than the difference in the reviewed code quality.

I'd still be comfortable having both agents inspect work and look for bugs. But this fit a pattern I kept seeing: when the task is very specific, Astra can be extremely efficient at carrying it out.

## 9\. Animating My Personal Story

I asked for a 30-second animated reel about me, using what the agent knew and whatever research and generated assets it wanted to use.

Opus chose a Pixar-style character wearing the light-blue shirt from my reference imagery. It narrated in the first person using my ElevenLabs voice clone and added a timeline running from September 2024 to the present.

Astra chose more of a claymation style and a third-person biography with a different voice. Its ending also pronounced “record” in a way that didn't fit the sentence.

Both interpretations were interesting, but Opus's timeline helped tie the scenes together. Astra's felt more like separate chapters.

→ Opus: almost 50 minutes and about $8.

→ Astra: about 20 minutes and $11.

**My winner: Opus.** I cared more about the final piece and its cost than how quickly this particular task finished.

## 10\. Drawing a Photo in Canva

I gave each agent a reference photo of me with Adam Sandler and asked it to open Canva and recreate it using browser-controlled painting tools. This was a drawing task, not an image-generation prompt.

Astra picked up details such as the texture of my shirt and the zippers on his, but the faces were badly distorted.

Opus's Canva drawing preserved a much more recognizable likeness of the two people in the reference.

![Image](https://pbs.twimg.com/media/HS8C8QgXIAADsjL?format=jpg&name=large)

It also cost less in this run.

**My winner: Opus.** This one wasn't close for me.

I showed earlier Astra drawings that looked better than this attempt. That makes me want to investigate the inconsistency, but a few examples don't establish why the result changed.

## 11\. Creating an Instagram Carousel

I sent both agents the same Polymarket post about an AI-opinion poll and asked for an Instagram carousel using the same skill.

Opus followed the overall format, but several images could have been positioned and centered more carefully.

Astra included the Polymarket source logo and the original post, which made the carousel's source easier to understand.

![Image](https://pbs.twimg.com/media/HS8C3kbWoAAlUiS?format=jpg&name=large)

I also preferred its opening caption and how it selected and arranged the information. It did repeat a robot image that I would have replaced, so there was still editing to do.

The poll figures were the subject of the sample carousel. This test was about turning that source into a useful visual post, not independently establishing those survey findings.

Astra finished in about half the time and came in at almost $7 versus about $10 for Opus.

**My winner: Astra.** This was a creative task where I preferred its judgment, which is why I wouldn't turn my overall preference into a rule that Opus always has better taste.

## 12\. Redesigning My Book Website

I gave the agents the existing Becoming AI Native website and asked for a new version. The old page had outdated audience figures, and I wanted to see whether either agent would notice.

Astra's version felt basic to me. I disliked the generic “AI” logo, and it carried over the old figures as though the page were the source of truth.

Opus went too dark for my taste. The first impression felt a little doomsday, which wasn't what I wanted for the book.

But its page told a better story. It included a first-page preview, chapters, frameworks, reviews, and details from the Amazon listing.

Opus's redesign displayed the book's frameworks as a visual gallery.

![Image](https://pbs.twimg.com/media/HS8CwG2W4AAcUcU?format=jpg&name=large)

I still would have changed the visual direction, and I wasn't treating either redesign as a completed fact-check of the book's marketing copy.

Both took about 14 minutes. Opus was roughly a dollar more expensive.

**My winner: Opus.** It gave me a better experience to work from, even though I didn't love the initial design.

## What the Final Numbers Tell Me

My score was eight wins for Opus and four for Astra.

Across the 12 experiments, Opus accumulated 10 hours, 53 minutes, and 57 seconds of active runtime, with an estimated API cost of $214.54.

Astra accumulated 6 hours, 1 minute, and 5 seconds, with an estimated API cost of $132.43.

That's 44.8% less active runtime and 38.3% lower estimated API cost for Astra across these runs.

![Image](https://pbs.twimg.com/media/HS8CmpDWYAA3h-v?format=jpg&name=large)

These totals don't mean I personally sat waiting for eleven hours, and they aren't my subscription bill. They are the summed active runtimes and API-equivalent estimates shown in the comparison.

Opus more often understood the creative direction I wanted without me spelling out every detail. Astra frequently got to a useful result with much less work on its side.

The analogy I used was that Claude feels like a wise old owl with judgment and taste, while GPT feels like an obedient worker who wants a specific spec and will figure out how to deliver it.

That's a rough description of my experience, not a universal limit on either model. Astra's carousel win is a good example of why the distinction isn't absolute.

For my work, I'd lean toward Opus when I want help figuring out the creative direction and Astra when I can clearly describe the outcome.

Both can handle a lot of the underlying work: apps, dashboards, code changes, and ordinary knowledge tasks. The harder part is communicating the details that make an output right for me.

I think of it as the shared 70% of the plumbing, followed by the personal 30% that makes me look at the result and actually want to use it. Those percentages are a way of describing the idea, not a measured split.

I walk through all 12 comparisons in the full video. Link in the first reply.

I'm choosing based on the work I need done, the feedback I'm willing to give, and the output I actually want to keep.