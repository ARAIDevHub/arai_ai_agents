Steps to run the twitter client:
1. Build process
    - arai_twitter/tsup.config.ts
    - run `tsup`
    - dist/index.js
    - dist/index.d.ts

import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    outDir: "dist",
    sourcemap: true,
    clean: true,
    format: ["esm"], // Ensure you're targeting CommonJS
    external: [
        "dotenv", // Externalize dotenv to prevent bundling
        "fs", // Externalize fs to use Node.js built-in module
        "path", // Externalize other built-ins if necessary
        "@reflink/reflink",
        "@node-llama-cpp",
        "https",
        "http",
        "agentkeepalive",
        // Add other modules you want to externalize
    ],
});


   initializeClients 
   ["twitter"] 

   [index.ts - TwitterClientInterface.start] - Starting Twitter client
   [environment.ts - validateTwitterConfig] - Validating Twitter configuration
   ["base.ts - Logger - ◎ Twitter client started"] 

   [index.ts - TwitterManager.constructor] - Initializing TwitterManager
   [interactions.ts - TwitterInteractionClient.constructor] - Initializing TwitterInteractionClient
   [twitter - base.ts - ClientBase.init] - Initializing client
   ["◎ Waiting for Twitter login"] 

   ["base.ts - Logger - Logged in "] 
   ["base.ts - Logger - ℹ Successfully logged in and cookies cached."] 

 ◎ LOGS
   Twitter user ID(Ours):
   1869804944070750208 

 ◎ LOGS
   Twitter loaded(Ours): 
   {
            "id": "1869804944070750208",
            "username": "TEST174175",
            "screenName": "TEST",
            "bio": "A real girl, not an AI agent",
            "nicknames": []
  } 

twitter [base.ts - RequestQueue.add] - Adding request to queue
twitter [base.ts - RequestQueue.processQueue] - Processing queue

twitter [base.ts - ClientBase.cacheTweet] - Caching tweet
twitter [base.ts - ClientBase.cacheTweet] - Caching tweet
twitter [post.ts - TwitterPostClient.start] - Starting post client


twitter [base.ts - ClientBase.cacheTweet] - Caching tweet...
twitter [base.ts - ClientBase.cacheTweet] - Caching tweet...
twitter [interactions.ts - TwitterInteractionClient.start] - Starting interaction client
twitter [interactions.ts - TwitterInteractionClient.handleTwitterInteractions] - Handling Twitter interactions
 ["◎ Checking Twitter interactions"] 

 twitter [post.ts - TwitterPostClient.generateNewTweet] - Generating new tweet

 Caching 
 - CacheManager
    - ICacheManager
    - MemoryCacheAdapter 
    - FSCacheAdapter
    