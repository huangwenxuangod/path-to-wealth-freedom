---
title: "Build a Claude Code Personal OS Step by Step in 40 Minutes | Moritz Kremb"
source: "https://www.youtube.com/watch?v=ACRd0Ikg_KI"
author:
  - "[[Peter Yang]]"
published: 2026-05-10
created: 2026-05-10
description: "Moritz is an AI founder who built a personal OS in Claude Code to manage his emails, create content, and even buy groceries. In this episode, he walks through everything you need to set up your own: f"
tags:
  - "clippings"
---
### The honest tradeoffs: OpenClaw vs. Claude Code

**0:00** · I built this claude OS system.

**0:02** · Basically, this system is essentially like a collection of a bunch of skills, a bunch of little automations. Every time I add a new tool or a new MCP or CLI or something, I just say add this to your tools.m MD. Overnight, it does this dreaming. It goes and checks the daily memory files and then creates a compressed version of it inside of the long-term memory file. It takes what I've ordered last week and just puts it into the cart again. So, it's basically like helping me automate my grocery shopping. Just get started.

**0:27** · The most important part is getting like this initial structure in place and then once you have that just like starting to connect your tools one by one.

**0:38** · Hey everyone. So one of the biggest first world problems that we all have now is should we set up a personal chief of staff in openclaw or claw code?

**0:47** · That's why I'm really excited to welcome my friend Moritz to talk about the pros and cons of each system. then uh he'll dive into exactly how he set up clock code to be his chief of staff from his folder structure to his skills. So welcome sir.

**1:00** · Thank you Peter. Happy to be on.

**1:02** · Yeah

**1:02** · it's great to have you man. So why don't we uh dive into it. I think you put together a diagram that shows how open claw and cloud code works. Can you share that?

**1:10** · Yeah

**1:10** · so I put this diagram here together. So basically comparing open claw and uh cloud code and we can go into like the pros and and cons of each because each have like certain pros and certain uh cons as well. Uh so let's start with the openclaw side. Um, so I would say one of the top pros of OpenClaw still is like this aspect of mobile access, you know, like it was built that you can bring it into a huge

**1:38** · range of different um like chat applications like Telegram, Discord, Slack and so on. That's just like I think one of the standout features also one of the things that made it so popular. And if we compare that to um what \[clears throat\] like claude code has has built over time, they've built this uh dispatch at some point and then they've also recently built like the telegram and discord plugins um which work fine I guess um but it's

**2:07** · still not as good as the like actual experience of using openclaw through through uh these chat applications.

**2:15** · Would you agree with that?

**2:16** · Yeah, I agree with I think open claw feels like you're talking to like a friend in like telegram and claw code dispatch and the channels thing is like not super reliable and if it's like a coding kind of first interface so it doesn't feel like text messaging a friend.

**2:30** · Yeah.

**2:30** · Exactly. Yeah. Like dispatch is you're like locked into their app and sometimes it can be good but it also doesn't feel you don't feel so free with it. I feel like yeah same experience with the telegram and the discord plugin was you know causing a lot of problems for me so uh I still prefer openclaw in that sense yeah so that's the the second one I would say is this feature of heartbeat

**2:58** · um which makes open claw kind of feel more like this always on thing uh so heartbeat uh for people that don't know it's basically this like uh thing that every 30 minutes. It kind of um by default triggers and open call comes alive like every 30 minutes. Um and you know like goes through some some tasks that you've specified inside of a heartbeat.mmd file. Um so this gives it like this always on nature.

**3:27** · Now, Claude Code, they've built some things over the last few months to I think uh mimic that a little bit. Like they built this loops feature. Um but it's kind of for a different use case and it also it only lasts for 3 days and then like it kind of turns off.

**3:49** · And yeah, \[snorts\] I think it's not really built for this like heartbeat functionality. you can kind of hack yourself into it a little bit, but the actual heartbeat feature I think doesn't really exist yet in cloud code.

**4:01** · What kind of uh stuff do you put in your heartbeat? Just at a high level.

**4:05** · So, I was trying different things and one of the main things that I had in there was actually just to like improve the memory. You remember like in the beginning the open claw memory was pretty bad. Um, and then I kind of just put into my heartbeat for to constantly like check the sessions and like what I've been doing on every heartbeat and just save it into my daily memory. So, that was like one of the things. Then I um put there also like management around my to-dos.

**4:35** · So, I wanted my to-do list to kind of feel like this uh thing that's just like selfch checkcking itself off like and working with me throughout the day while I work in my open claw. Um, so I had like something in there to to say like, "Hey, go check, you know, what I've been working on and check it off my to-do list by yourself so I don't need to do it myself, you know."

**4:59** · Yeah, the memory still needs improvement. So, yeah, it's a good idea to put the memory stuff in the heartbeat.

**5:04** · Yeah.

**5:04** · And then there's um whole thing around cron drops. So I think it's still much easier to use that in openclaw. So that's definitely a pro like you know openclaw is like this supposed to be this thing that's um either living on a separate device or like somewhere on a VPS in the cloud.

**5:22** · And um so I think it's much easier because of that to be able to like create chronrops. you just say like create a crown job and then it just runs you know and with cloud code they've introduced this uh first it was called I think schedule feature and now they uh renamed it to routines and it's

**5:45** · a little bit complicated to use because it's like there's a local version that runs locally and then you can also do like a cloud hosted version it's like a little bit more complicated to use although it is nice to see like a list of your routines in the Clocko app cuz OpenCloud I don't even know what kind of crown jobs I I have to ask what kind of crown jobs I have.

**6:06** · Yeah, that's true. Yeah. Or you have to go into this into like the really bad uh uh OpenCloud dashboard UI and try to find them there or like into this cron file but then it it just looks like code. Um cool. And then I would say the fourth point that I put in the pro of openclaw is this like feature of sub aents that you can just easily create a sub agent and um you know then can have your main agent interact with it.

**6:33** · Um and I think cloud code doesn't really have that they have this like so there are a couple ways around it. You can um kind of use an app like paperclip and combine it with cloud code and then you can manage sub agents. Um and they recently released this claude managed agent uh you know product which I think is going in that direction but right now it's not really consumer yet. I think it's more for developers.

**7:01** · This episode is brought to you by linear when engineers use tools like cursor clock and codecs. A lot of work happens invisibly. Someone can go from a bug report in Slack to a shipped fix without creating any record of what happened outside of the code editor. And that's fine for speed, but it makes coordination harder as you scale. Linear integrates with the very best agent coding tools directly like cursor and codeex. That way, anyone can see what an agent is working on and who assigned them to the task.

**7:29** · You get the speed of agents without losing visibility across the team. Product teams at OpenAI, Ramp, and Block are all using Linear to collaborate with AI agents. And I use Linear myself to run my creator business. So, check it out at linear.app/ app/ aents. That's linear.app/agents. Now, back to our episode.

**7:51** · What do you use sub aents for? Like, you have an orchestrator agent and a sub agent for like updating your newsletter post or editing videos. What do you use it for?

**7:58** · Well, to be honest, I actually I I know there are a lot of people on Twitter being like, I have a sub agent for that and you know, like for my content, everything. And I think um for most people, they actually don't need sub agents when they use OpenClaw. they just need like their main open claw agent and then they can create uh groups in telegram or wherever they use it to talk about different stuff and that's totally enough and that's also how I use it. Um I think sub agents maybe start to make sense if you if you like really want to separate context.

**8:30** · So if you if you want like one agent for each of your businesses for example um then it starts to make sense because otherwise you have to you like constantly have to manage context between all of these sub aents right and that also gets very very complex. I I do think uh one thing I do use it for is like if I draft a piece of content and I want someone to evaluate it or like kind of review it, I have a sub agent or like another agent for that so that it doesn't get biased by the fact that I drafted the content, you know. \[laughter\] So the reviewer and the drafter is se separate.

### Why Moritz switched to Claude Code

**9:03** · Cool. Then let's go into the pros of cloud code. So I would say the biggest one right now um for me is reliability.

**9:12** · Um because I don't know if like you've experienced that too, but with OpenClaw it's still it just breaks randomly. All of a sudden an update comes out and then something breaks or like the model just stops working. Um you know or yeah it just like it's just kind of still a quite techy product not super reliable yet. Yeah. So that's one thing.

**9:32** · The other one is that I mean obviously when when like anthropic cut off the access to to open claw I think that's when a lot of people switched over and um a lot of people said that the experience of openclaw was only this good because it was using uh the the opus model. So I would say right now it's probably like still the better uh model and that's like one of the reasons to use cloud code. Although I don't know, have you tried the new um GPD 5.5?

**10:04** · Uh I have not tried I GPD 5.4 is terrible with uh open claw. So like yeah because of because GPD 5.4 I I started switching more over to cloud code. They said 5.5 is better just like a guy working on it now. But apparently you can also still use the cloud CLI in open claw uh in some way shape or form. But uh yeah the the the the previous model like it just did not work with open call in my opinion.

**10:28** · Yeah it was not as proactive. um as Opus was.

**10:31** · Yeah.

**10:31** · Um and then it's I think overall also more secure uh cloud code although you know it's like the security kind of shows itself in off very often in just like asking you to approve something which can also get annoying and um yeah

**10:50** · and then like one way I've went around that is to kind of just set like bypass permission mode uh to always active and then I guess it becomes also a bit less secure but it's kind of cuz I think you and I have built systems on both and it's kind of like it's almost like fake work to a certain extent trying to figure out which of these systems to use but right now I'm I think I have all my email management calendar stuff and like just like trying to update Google docs and stuff still in open claw and then cloud code I use it to just like build if I want to build anything I use cloud code and maybe codeex to build uh I'm

**11:21** · not sure how you're dividing things but uh yeah exactly I think overall like open claw is it feels more like this it it has this potential to be more autonomous. It feels like this thing that you're, you know, supposed to be having somewhere in the cloud or somewhere on a different machine and that's like supposed to be more like an employee that's doing stuff for you autonomously. And to me, cloud code still feels more like a actual tool that I'm using on my main machine that's augmenting my work. The reliability is a big factor, man.

**11:53** · Well, I guess clock code isn't that reliable because they keep having downtime, but but assuming that they can fix fix that then the reliability like I switch a lot of my cron jobs over to cloud code just because it's more reliable. But now I guess now why don't we uh you have a full demo for clock code ready, right?

**12:08** · So why don't you show us a tour of how your clock OS works?

**12:12** · Yeah, exactly. Yeah, basically because of the open claw being unreliable, I've kind of tried to build my open claw system also in cloud uh just so that I like basically have both running at the same time. Um so yeah, I built my this this clawed OS system basically and uh maybe before I jump into the architecture, let me just uh show you like a couple of examples um so I think you know people can get a better feel for how it actually works. Um, okay.

**12:41** · I'm first going to copy this one and just open up my cloud code here. Uh, and by the way, this is the new desktop app, which is really awesome. Uh, I'll just paste this in here. I'm doing a demo, so it shouldn't share any sensitive information. And then I'll take this first prompt. Um, and the first prompt basically says, uh, get the transcript from this video. So, I'll go get a there's some like some video uh link, some Instagram video link.

**13:13** · Paste it here. So, get the transcript from this video and write two similar scripts for my offer. Then save them as docs in this G drive folder called claude content system. Okay.

**13:26** · You can you can get transcripts from Instagram videos automatically or it has some sort of tool to make.

**13:31** · Yeah.

**13:31** · So, in this case, it it has a tool here which is called talk script. So it's a MCP tool here and that basically helps it get the transcript. Um and then after it got the transcript, it yeah basically used the cloud code intelligence to write the scripts and then it uses another tool to actually access my G drive and uh you know create the files and put it in there.

**13:55** · The other tool is just like uh is is just like uh GWS CI Google Workspace. I would say that's probably like right now the most power powerful tool for me when using like this this system. It just unlocks so many things because I can access my G drive and do anything with it basically.

**14:13** · Yeah, I never bought into like just using like local MD files and Obsidian to manage everything. I I prefer everything still in G Drive because like it's in the cloud. I can use it on my phone and so on.

**14:23** · Yeah, I agree. I was kind of trying out both and when I was building my like content system I was you know having most of the things locally but at some point I started realizing that it's just not very nice like if everything is living somewhere locally on a machine and it's just harder to access so yeah it's much nicer when it's in a in a G drive. Okay.

**14:44** · Okay.

**14:44** · Looks like it's uh so you use this flow to basically make uh new Instagram real scripts. Yeah, I could I can Yeah, I can obviously kind of um define the prompt a little bit better or like put it as a into a skill uh for it to you know reference other files. But uh I just wanted to show like how fast you can yeah basically just get something from uh some you know some website and then upload it into a G drive. So where did it put this? Probably in scripts.

**15:16** · Yeah, right here.

**15:17** · Awesome. And and I think another benefit of this like for my open claw like I I don't give it access to my entire G drive. It has a separate email that I share some files with it because because I'm worried it'll screw things up. I think with cloud code it's just using my main creative credentials.

**15:30** · Yeah, you have like more trust in cloud code, right?

**15:34** · Yeah, I have more trust. Maybe I'll screw up too, but like yeah, so far I have more trust in cloud code.

### The folder structure that runs Moritz's entire OS

**15:40** · Yeah, let's show this one. So this one says find find all of the APIs I have used before and organize them in a Google sheet and upload to my drive. So yeah, this will do like a search into my local file system of like all the memories I've saved over o over time inside of like cloud OS and then just organize it, create a Google sheet and then upload it into my drive again using GWS.

**16:08** · Do you have some like fancy thing for the memory? Like do you have like Toby's QMD thing or is it's just like doing searches?

**16:14** · It's right now it's still pretty simple.

**16:17** · Um I kind of just mimic the like system that OpenClaw has. Uh or probably like even simpler than that than what OpenClaw has. Um and it's been working fine for me so far. Uh, but yeah, I do think that at at some point I'll probably hit some limits of it working well if if it gets to a lot of files and and very big files and then I'll probably use the QMD. Yeah.

**16:42** · Okay. So, you actually set up like the daily summaries and the memory thing that OpenC has here. You just told it to do it.

**16:49** · Yeah, exactly. Exactly. So I have um I have like a memory.md file and then I have like memory a memory folder with daily memory files in it.

**17:02** · Okay. You really are recreating open cloud. \[laughter\] Yeah, exactly.

**17:07** · I think cloud might have its own memory thing too like at the end of the every day it might save it somewhere. I just don't think maybe it's not in cloud code. Maybe it's just in regular cloud but I heard him talk about it somewhere.

**17:17** · Yeah.

**17:18** · Yeah.

**17:18** · Good question. Yeah, I think it's in the Yeah, regular cloud sheet is ready. So, basically, it extracted all of the APIs that I was working with in the in the past days and just put it in here.

**17:30** · So, these are all the APIs that your Claudia OS has access to.

**17:35** · Yeah, exactly. These are all of the ones that I've been kind of either mentioning or like checking out in the last few days. So, it probably took these from my memory files.

**17:45** · Hopefully, you're not paying for for all of them, but but yeah. \[laughter\] That sounds good. Yeah. All right, dude. So, why don't you show us how all this thing is set up?

**17:53** · As you mentioned, my um cloud OS called Claudia and basically there's the UI layer here. So, I like mostly just use it through the new Cloud Code desktop app and it's just like they've made such an improvement. I think it's been out for like 10 days. Before that, I was mostly using it through the terminal, but now that the desktop app is out, I'm just using it there.

**18:18** · And I don't know if you've seen, they have like these, you know, you can open up all of these things on the side as well, like you can see the files, you can like see a plan and so on. So, it's it's really good.

**18:30** · Yeah. And and they let you edit the markdown here, too. I don't know if you realized, but yeah.

**18:34** · Yeah, it's pretty good.

**18:35** · Yeah.

**18:35** · So, that's the main way I use it.

**18:37** · Now terminal I think only sometimes if like a couple of features are still uh missing or like sometimes I need to check something and I'll use the terminal. Um, and then if I really want to like go very into kind of editing a document mode, uh, then I'll actually use something like cursor or VS code, uh, with the cloud code extension because there I often want to, you know, I I'll want to like type something into the document uh, and then like reference something.

**19:08** · So, you know, basically highlight it and then edit it with AI. And for that, I think having this extension inside of cursor VS Code is really good.

**19:19** · So you you're using cursor to just edit edit documents.

**19:23** · Yeah, that's pretty funny. That's very funny because it's meant for coding, right? But you just use it edit documents.

**19:27** · Exactly.

**19:27** · Yeah. Yeah. I I think I haven't used it for coding in a while. I just kind of use it like obsidian basically.

**19:34** · Okay. So that's the UI layer. And now the I guess important part is how is the folder structure actually set up? And I mentioned this before when I was setting this up. I was basically looking at how open claw has done it and like copying that over. Uh and so there are some like these instruction files. Basically this is the most important one is this the cloud MD.

**19:58** · Um it kind of replaces on openclaw side the agents.md and it's like the first file that is like being read and that has is like kind of the master instruction. It's like the system prompt, right? So that's the important one inside of this. I can actually show it. Um you can see here is like your Claudia this your workspace and then I start with these files are imported into every session and then I reference these other files which I'm going to go into now.

### The memory loop that makes Claude Code remember everything

**20:28** · But um yeah basically I use this cloud MD to like pull in the other files as well. And then I have this part which is like a memory loop. This is to make sure that the memory here works. So this part basically says like it should save the daily memories. So after every interaction with it, it should save like one line into daily memory and then also sometimes save long-term memory.

**20:55** · After every chat message, it should save something.

**20:58** · Yeah.

**20:58** · So I think one of the downsides of it might be that it you know makes every chat a little like you know slightly longer but yeah I didn't want it to lose any information you know so okay um and then the identity and so is just kind of the per personality right exactly identity soul and then uh user

**21:19** · MD is information about me uh and then various folders for business context and then I think this one tools.md is super important I have also like every time I add a new tool then or you know or a new MCP or CLI or something I just say add this to your tools.m MD and this way it knows

**21:40** · like what tools it has access to and I think that's the most important part actually then there's the like memory system as I mentioned I also have this like little thing built in now that it uh like overnight it does this dreaming so it goes and checks the daily memory files and then like you know creates a compressed version of it inside of the long-term memory file.

**22:06** · Is that like a crown job?

**22:07** · Yeah, it's a it's a routine. Yeah.

**22:09** · But how do you prevent this thing from becoming super long like the memory empty or or is it meant to be super long?

**22:16** · Yeah.

**22:16** · Uh I mean I my prompt is basically like uh you know just make it one line or something one or two lines. So far it's not gotten super long, but yeah, I think probably at some point I'll run into some issues and then I have to think of a better memory system.

**22:31** · Got it. Okay.

**22:32** · Yeah. And then obviously uh the env store all of the secrets like whenever I get API keys or or things like that, I'll put it in here.

**22:41** · How do you share this is a dumb question. How do you share secrets with claude? Do do you just paste it directly into EMV or do you because you don't want to you don't want to put the secret in the chat, right?

**22:51** · Yeah, I usually just open up my ENV file and and put it in there directly. Okay.

**22:55** · Instead of going through clot. Um I think one of the other ways that I also have on my list of of wanting to do um is to basically have like everything in one password. I've already set up my one password to have a separate vault just for agents and then um I can share my passwords into that vault. I just need to make sure that my you know cla OS also has access to that vault.

**23:23** · Okay. And just to summarize uh so basically every single conversation you have with Claudia it runs cloud.md and cloud.md refers to these other files that it can reference.

**23:32** · Yeah. This way it then you know um keeps building its memory and remembers things over time.

**23:38** · And for those of you watching I I guess we'll link to this uh exact we'll link to these diagrams in the comments if you want to check it out yourself. Yeah.

### CLI vs. MCP vs. API: which to pick and why it matters

**23:47** · Okay.

**23:47** · I think this part is the most important part actually the tools like you know there are different ways for it to use tools and there are different types of tools like one of one of the categories are CLIs these are basically you know like little programs running on your computer um and I think actually the fact that cloud code can use CLI is one of the advantages over co-work I believe because co-work is like kind of sandboxed every time you use it then it

**24:17** · can't like really use CLIs, but cloud code can. And that's one of the reasons why I prefer using cloud code over co-work.

**24:25** · Yeah. I don't use cork. \[laughter\] Yeah.

**24:28** · Yeah. There's too many buttons. I I prefer just having a chat.

**24:31** · I mean, I understood the reason for people to use co-work when they had the like only the co-work desktop app and claude code was like uh you know, you had to use it through the terminal. But now that there's a nice desktop UI for cloud code, like what's the point in using codework?

**24:48** · Yeah, I don't see a point. Yeah.

**24:50** · Okay.

**24:50** · And then yeah, there's obviously MCPS and I think like you know there are so many different ways to actually connect your MCPS. It's like I don't it's gotten pretty confusing at this point. Like you can connect them through the desktop app. you can like actually uh you know connect them directly from your cloud code like in the CLI and it's just I feel like it's a bit of a mess but yeah at the end of the day like you can connect MCPS and then uh your cloud code can use them.

**25:22** · Do you have them connected and turned on all the time cuz it's going to blow up your context, right? Or do you have uh I do actually but I think it's gotten better. um they've made this improvement that it doesn't, you know, bloat up your context that much. So, I haven't really noticed a big difference.

**25:40** · Okay, maybe I give another try.

**25:41** · And then obviously their APIs. So, you know, nowadays when I look for new software tools, I just always like the first thing I look for is uh do they have a CLI? And then do they have MCP?

**25:53** · And if not, then you know just at least like do they have an API and if not then I try to look for another tool that has one of these. \[snorts\] \[laughter\] Yeah. You got to have these three things otherwise people are not going to use your app.

### Skills walkthrough: automated grocery runs and video uploads

**26:06** · And then of course there's this other layer of skills like I have you know I've created several skills for my own workflows. Uh basically whenever I do a workflow several times I'll just say like turn this into a skill and then it's it's saved for future use. Let let's go through some let's just talk about some of these skills. Maybe you can describe a couple of these skills and what they actually do.

**26:28** · Uh okay. So this one this grocery is actually a skill that I've created to use the browser and I created this first on my on my openclaw as a skill. And I've basically like trained it to use the openclaw browser and then to like uh

**26:49** · log into my grocery like shopping application and like it the first step is it takes what I've ordered last week and just puts it into the cart again because these are the like the items that I order every week and then it just takes a list of um any new things that I need that I added through the chat and goes and searches for the products and then adds it to the cart. and then lets me approve it at the end. So, it's basically like helping me automate my grocery shopping.

**27:17** · Okay, that awesome.

**27:19** · This one is super useful. Video upload workflow. So, I have this in my in my content system where it's like I used to whenever I upload a video for my editor.

**27:30** · I would like go into Google and like create these uh folders and then you know drag them in there uh and then get the link and share it with my video editor. And this workflow basically just does everything. It I just need to say like run the video upload workflow. It creates like all of these folders and then all I need to do is just like upload my my files into exactly that folder and that's it.

**27:55** · I see. I see. Okay. I see. And and what's the difference between project and user? So project is in Claudia only and user is across all your projects, right? Your cloud code projects.

**28:05** · Yeah, exactly. Yeah, this one is only in Claudia. This one is global. I I think we're talk about this next, but like I feel like the whole podcast video production flow like I just wish there was more like APIs and skills to automate that stuff like like everything from recording the video to clean it up to uploading it to YouTube to making clips to you know making captions like like making a show notes like all this stuff is like super repetitive and I wish there was like a way to just like make it easier.

**28:32** · Yeah. I think the the problem to that is that um you know everybody everyone that creates content has their very own custom workflows.

**28:42** · Yeah.

**28:42** · Um and so it's very hard for like a SAS tool to come in and and be the tool to use for everyone.

**28:49** · But now that you have these tools with like you know cloud code and or open claw and connect like being able to connect to all of these different tools you can basically build these automations yourself.

**29:00** · Yeah.

**29:00** · With with the right APIs. Yeah, maybe I can talk about some of it later, but let's talk about routines real quick. First, yeah, so routines are like new feature of cloud code where you can automate stuff and there are \[clears throat\] uh so there are two different types of routines now. One is local, one is remote. So local is you yeah you always need to have the desktop app running.

### Local vs. remote routines (and when to use each)

**29:23** · So your computer needs to be on and then once you have a like one of these local routines uh triggering then it will actually run locally on your computer.

**29:36** · So it can you know it's able to use the CLIs on your computer and it it's just basically able to do everything that you're normally able to do when you're chatting with a tier on on your computer. Um, and then remote is kind of if you want an automation to just always be running even if your computer is not on.

**29:57** · Um, and this one is a little bit like slightly more complex to set up because what you need to do before that is to you need to create a repository and like put all of the stuff into that repository that it needs to be running this automation and then you like basically host host it on GitHub and that way it can like run in the cloud.

**30:19** · So it looks like you only have one remote routine YouTube monitor, right?

**30:22** · So it's looking at your stats or something. Yeah, this one is actually it's like it's looking at channels that I specified and then it's like scraping all of the latest videos of those channels and putting it into a sheets.

**30:38** · Uh so I can show you here. It's putting it like into this sheet with the you know like the views and likes and comments that it got. And this is running once a week and this is just to for uh to see what kind of videos similar channels are making for inspiration I guess.

**30:53** · Exactly.

**30:53** · \[laughter\] It's uh it's the the titles are just like just looking at a title like just being a YouTuber is so easy to just go crazy crazy like it's insane. It's it's like I try not to do that stuff but like it's just hard cuz like when you write it's insane like the clickthrough rate is like 2x.

**31:10** · So so you probably have another skill to do you have another skill to analyze this stuff and like maybe give you some suggestions or something? Yeah, I have the So, I have this one skill that's I think it's still running on my Open Claw, but it basically takes uh all of the things that I have in my idea folder.

**31:27** · Yeah.

**31:27** · Uh like all of the manual ideas that I've logged as well. We can go into that also later in the uh in the content machine, but uh yeah, it takes all of the ideas and then turns it into a weekly plan.

**31:39** · That makes sense. I think the problem with AI stuff is like the like there's new stuff dropping every week. So like some of the stuff that you've pulled is already out of date. \[laughter\] It's like Yeah.

**31:48** · Okay. Sure.

**31:49** · I do. Well, let's let's talk about let's talk about the content system. Yeah. This is the this is the capstone of this whole thing. Yeah.

### The full content pipeline from idea to posted video

**31:54** · Yeah.

**31:54** · So basically once you've you know set up like uh hooked up the tools and like set up this foundation you can start building systems like these where the system is essentially like a collection of a bunch of skills a bunch of like little automations that are like you know coming together to uh build this system.

**32:14** · So this one specifically is to create short form video contents and uh I built this initially in my open claw and I'm kind of in the process of migrating some of it over over into my cloud OS but um the way I I've been operating it is mainly through telegram.

**32:32** · So I have this like telegram uh group here with all of these subtopics and then I for example have this one for ideas and this is for the first step. So uh there's this idea capture step where I have several different ways to capture ideas. So one of them is directly through my telegram. So I can just say you know if I get an idea about something I can just say compare openclaw with cloud code and it basically logs that as an idea in in one of my idea docs.

**33:00** · Um and then I have the the YouTube scrape that I showed you this like automated way. Um, and then I've set up another way where I can when I scroll through my Twitter and something a post comes up as a good, you know, idea for inspiration, I can just uh like send that to my OpenClaw bots uh Twitter account and uh then I have an automation running which like looks into the DM and just logs all of these things that I've sent it.

**33:29** · That's very smart. Okay, so you just DM your OpenCloud account. Got it. That's very smart. I I've been I've been bookmarking it and I don't know I don't think there's like a bookmark API.

**33:38** · Yeah, exactly. Yeah, I was thinking like you know I bookmark so much stuff and it just lands in the bookmarks graveyard.

**33:44** · Um but there needs to be a way to get it out. Yeah. Okay. So once the ideas are captured I go into like a weekly planning step and there essentially it just like takes all of the ideas and just creates a weekly plan for me. So it picks out some of the topics and then writes like puts it into a schedule Monday, Tuesday, Wednesday and so on and adds a little bit more detail. Yeah, this one relatively easy.

**34:08** · But then the next step is once I've approved this plan, it can then start writing the scripts for me based on my past scripts also. So I've built up like a library of like my past scripts if I go here into uh yeah here. So, so here's like Yeah. So, here's, you know, like a content folder and it has short form scripts and it's like all of my scripts are living in here. So, it creates like one uh script for each day.

**34:40** · Wow. Okay.

**34:41** · And then I can obviously go in and like review them and add like a bit more detail if I want. And then it goes into the filming step where I just take that script and put it on my phone and basically like talk the script into my phone. Yeah, you like some people I think can you know they can just like talk into the camera and they don't really need a script or maybe just need like some bullet points but I usually need like at least something to talk about. I need to see something you know I can't just like open my phone and just start talking.

**35:11** · That makes sense.

**35:12** · Yeah.

**35:12** · And then after that, um, I have a video editor in the loop of this process. Like you could also do it without a video editor here. Um, depends on the style of your videos, of course, but my style of videos, it's usually like me talking and then sometimes it's me filming something on the screen to like show something. And like you could do that without an editor by just like talking and then turning it around and filming and so on.

**35:37** · Um, but yeah, the way I do it is I just film myself and then I film the thing on the screen and then I just like get all of those files and just send it uh to my editor. And this process here is also like semi-automated where I just say like run the video upload workflow and then it creates the right folder. It like pulls from the actual script so that it knows what it's about to create the folder name, creates the folder.

**36:04** · Um, and then I just need to basically from my phone just click the folder and upload everything there.

**36:12** · You record and upload from your phone.

**36:14** · Yeah.

**36:14** · Why don't you use some some uh, you know, video recording thing on the desktop? It's just easier. I I guess you're making clips, so it's just easier to make from the phone.

**36:22** · Yeah, true. And I also I like this natural style of, you know, this like UGC content on the phone. So, you know, I've I've tried like different kinds of content and uh usually the like most natural style just uh performs the best. So, I kind of just like over time just went with that.

**36:40** · Yeah, that makes sense. Just like off the cuff kind of thing.

**36:43** · Yeah.

**36:43** · Uh once that's done, my video editor will send me the link back to the uh drive where the finished video is. And then I can just paste that link to my agent and my agent can then use a a tool uh CLI tool to like post it on the various platforms.

**37:02** · Let's let's go because I'm I'm I'm still manually posting to type and then scheduling. So what what's the CLI tool that you use post?

**37:09** · So this one is postits. Yeah, I think they like they really exploded um and uh mainly because of OpenClaw and their CLI. So, uh yeah, their CLI is pretty good.

**37:21** · So, this is for posting videos specifically, right? It's not posting to X or anything. It's like posting clips.

**37:26** · I think actually they might also have X integration. Uh but yeah, I use it for for video for posting to YouTube, Instagram, and Tik Tok. Yeah. Yeah, they can add like you can add your captions and so on there too. So, I actually have that also um like partly automated where it generates the caption based on my script. Um but yeah, what I was going to say is that you want to be especially with Tik Tok, you want to be a bit careful with posting through API like um I think with Instagram and YouTube, it's usually fine.

**37:58** · It won't affect the performance, but with Tik Tok, it's it might affect their uh performance a bit. And um also if you're starting a new account, you kind of want to warm them up a bit first with like human uploads.

**38:11** · Yeah, with human Yeah, exactly. Human uploads. And um also with Instagram actually that's one of the things why I was also still posting Instagram manually for a while is um like they they have this edits app and um at some point like in the creator circles people were saying if you upload it into the edits app and then from there you post it on Instagram then it performs better and I did that and I think it worked.

**38:39** · Like it's always hard because you can't AB test it but I think it worked.

**38:43** · Interesting. Okay, I I'll check it out.

**38:45** · Yeah. And then and then you get your stats. That's the final step, right?

**38:48** · Yeah.

**38:49** · Yeah.

**38:49** · Actually, one thing here that I also find pretty useful is, you know, in Instagram, you often do these videos where you can give away something like a resource. Yeah.

**38:59** · Um, you know, like comment for this resource. And I also have that part automated where it's like it's based on the script. It creates a notion resource with all of my links inside of it. Um, and then it just puts that link of the notion resource into my minihat automation. Um, and you know, then that part is also automated and that also saves a lot of time.

**39:22** · Wow. Okay. All right. I I'm going to have to digest this a little bit more. I think I think all of us do, but um, but it sounds like the most manual part is just like creating the video and uh actually editing the video. That is the manual part, right?

**39:36** · Yeah.

**39:36** · For me personally, the manual part is like here because I want to make sure that the script is good. And yeah, if I just let AI write the script like completely sometimes it works, but like very often I just want to make sure it's good and and go and do some manual edits there. And then this part is actually not the filming part is not taking a lot of time for me because once the script is ready, it's just like 10 minutes basically like you open your phone just like say the script or like act the script more or less. Yeah. Yeah.

**40:07** · Uh and that's it. And then yeah, the uh the video editor, you know, but I I think he probably is like, you know, one video maybe takes him like half an hour um short form video. So also not that much time.

**40:21** · Yeah, that that that's what I was going to ask you about because you wrote in your title is the no AI slop flow and I was going to ask you if you just take the script directly and just like you know record it. So it's it's good to hear that you don't you don't just take directly from AI.

**40:34** · Yeah.

**40:34** · the the workflow that I like the most is I have it based on the planning, I have it create like some notes. So the script is actually not a script. It's more like notes and then I'll have a look at the notes and just like use my um whisper flow to add like more points into it. And then I have a skill which basically transforms notes into the like script style that I usually want.

**40:58** · So, I'm basically, you know, adding some notes, transforming it, adding notes, transforming it for like the seven videos that I post.

**41:09** · Got it. And and through this flow, you're able to post a video a day or something, like a clip a day.

**41:13** · Yeah. Yeah, roughly. Yeah.

**41:15** · Awesome, dude. This is super helpful.

**41:17** · Yeah. I I feel like being a creator like um we do so much repetitive work that like I feel like creators are kind of at the forefront of AI adoption because, \[laughter\] you know, you usually we don't have a big team and there's like so much work to do.

**41:28** · Yeah, I agree. And I think there's so much more you can do with this, right?

**41:32** · You can, you know, this is like only short form content. You can hook it up into like the long form part and like repurposing for Twitter and your newsletter and so on. So there's a lot you can do.

**41:42** · All right, Morris. Well, thanks so much, man. Uh, this is super helpful. Uh, do you have one f like do you have a closing tip for someone who wants to build something like this? Like build their personal OS on clock? I I think the tip is maybe just like build it one step at a time, right? Like think about what's taking up most of your time and build it one step at a time.

### Tips to start building your first personal OS

**41:58** · Yeah, exactly. just get started. I think the most important part is getting like this initial structure in place, the folder structure and then once you have that just like starting to connect your tools one by one and you you know you don't have to connect everything at once but you know just start with one and then uh yeah go from there.

**42:16** · Awesome. And and where can people find you uh online or or your stuff?

**42:21** · Uh yeah on Twitter uh my handle is mob. Uh so yeah you can find me there. All right, Morris, thanks so much for walking through this. This is super super helpful. Pretty advanced, but uh I'm sure a lot of people will try this.