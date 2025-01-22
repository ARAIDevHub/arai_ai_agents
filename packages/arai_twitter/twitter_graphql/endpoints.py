from dataclasses import dataclass, field
from typing import Optional, Dict, Any
import json

@dataclass
class Endpoint:
    url: str
    method: str = "GET"
    variables: Optional[Dict[str, Any]] = field(default_factory=dict)
    features: Optional[Dict[str, Any]] = field(default_factory=dict)
    field_toggles: Optional[Dict[str, Any]] = field(default_factory=dict)

    def get_url(self):
        if self.method == "GET" and (self.variables or self.features or self.field_toggles):
            params = []
            if self.variables:
                params.append(f"variables={json.dumps(self.variables, separators=(',', ':'))}")
            if self.features:
                params.append(f"features={json.dumps(self.features, separators=(',', ':'))}")
            if self.field_toggles:
                params.append(f"fieldToggles={json.dumps(self.field_toggles, separators=(',', ':'))}")
            return f"{self.url}?{'&'.join(params)}"
        return self.url

# API features
# These features are typically used in the 'features' parameter of the request
api_features = {
    "longform_notetweets_inline_media_enabled": True,
    "responsive_web_enhance_cards_enabled": False,
    "responsive_web_media_download_video_enabled": False,
    "responsive_web_twitter_article_tweet_consumption_enabled": False,
    "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": True,
    "interactive_text_enabled": False,
    "responsive_web_text_conversations_enabled": False,
    "vibe_api_enabled": False,
    "responsive_web_graphql_timeline_navigation_enabled": True,
    "responsive_web_graphql_exclude_directive_enabled": True,
    "verified_phone_label_enabled": False,
    "creator_subscriptions_tweet_preview_api_enabled": True,
    "responsive_web_graphql_skip_user_profile_image_extensions_enabled": False,
    "tweetypie_unmention_optimization_enabled": True,
    "responsive_web_edit_tweet_api_enabled": True,
    "graphql_is_translatable_rweb_tweet_is_translatable_enabled": True,
    "view_counts_everywhere_api_enabled": True,
    "longform_notetweets_consumption_enabled": True,
    "tweet_awards_web_tipping_enabled": False,
    "freedom_of_speech_not_reach_fetch_enabled": True,
    "standardized_nudges_misinfo": True,
    "longform_notetweets_rich_text_read_enabled": True,
    "subscriptions_verification_info_enabled": True,
    "subscriptions_verification_info_reason_enabled": True,
    "subscriptions_verification_info_verified_since_enabled": True,
    "rweb_lists_timeline_redesign_enabled": True,
    "hidden_profile_likes_enabled": False,
    "hidden_profile_subscriptions_enabled": False,
    "subscriptions_verification_info_is_identity_verified_enabled": False,
    "highlights_tweets_tab_ui_enabled": True,
    "rweb_video_timestamps_enabled": True,
    "unified_cards_ad_metadata_container_dynamic_card_content_query_enabled": False,
    "super_follow_badge_privacy_enabled": False,
    "super_follow_exclusive_tweet_notifications_enabled": False,
    "super_follow_tweet_api_enabled": False,
    "super_follow_user_api_enabled": False,
    "android_graphql_skip_api_media_color_palette": False,
    "creator_subscriptions_subscription_count_enabled": False,
    "blue_business_profile_image_shape_enabled": False,
}

# field toggles
field_toggles = {
    "withArticleRichContentState": False,
    "withAuxiliaryUserLabels": False,
}

# Define endpoints based on the URLs found in the TypeScript code
endpoints = {
    "user_tweets": Endpoint(
        "https://twitter.com/i/api/graphql/E3opETHurmVJflFsUBVuUQ/UserTweets",
        "GET",
        {"count": 40, "includePromotedContent": False},
        api_features,
        field_toggles,
    ),
    "user_by_screen_name": Endpoint(
        "https://twitter.com/i/api/graphql/H8OOoI-5ZE4NxgRr8lfyWg/UserByScreenName",
        "GET",
        {"withSafetyModeUserFields": True},
        api_features,
        field_toggles,
    ),
    "followers": Endpoint(
        "https://twitter.com/i/api/graphql/rRXFSG5vR6drKr5M37YOTw/Followers",
        "GET",
        {"count": 40, "includePromotedContent": False},
        api_features,
        field_toggles,
    ),
    "following": Endpoint(
        "https://twitter.com/i/api/graphql/iSicc7LrzWGBgDPL0tM_TQ/Following",
        "GET",
        {"count": 40, "includePromotedContent": False},
        api_features,
        field_toggles,
    ),
    "user_by_screen_name_v2": Endpoint(
        "https://twitter.com/i/api/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName",
        "GET",
        {"withSafetyModeUserFields": True},
        api_features,
        field_toggles,
    ),
    "user_by_rest_id": Endpoint(
        "https://twitter.com/i/api/graphql/xf3jd90KKBCUxdlI_tNHZw/UserByRestId",
        "GET",
        {"withSafetyModeUserFields": True},
        api_features,
        field_toggles,
    ),
    "dm_inbox_timeline": Endpoint(
        "https://twitter.com/i/api/graphql/7s3kOODhC5vgXlO0OlqYdA/DMInboxTimeline",
        "GET",
    ),
    "search_timeline": Endpoint(
        "https://twitter.com/i/api/graphql/gkjsKepM6gl_HmFWoWKfgg/SearchTimeline",
        "GET",
        {"querySource": "typed_query", "product": "Top"},
        api_features,
        field_toggles,
    ),
    "create_grok_conversation": Endpoint(
        "https://twitter.com/i/api/graphql/6cmfJY3d7EPWuCSXWrkOFg/CreateGrokConversation",
        "POST",
    ),
    "tweet_result_by_rest_id": Endpoint(
        "https://twitter.com/i/api/graphql/hc-p-Bk_RF-FA-5xMv-Sg/TweetResultByRestId",
        "GET",
        {},
        api_features,
        field_toggles,
    ),
    "user_tweets_and_replies": Endpoint(
        "https://twitter.com/i/api/graphql/mCbpQvZAw8P3oyrfRkceqA/UserTweetsAndReplies",
        "GET",
        {"count": 40, "includePromotedContent": False},
        api_features,
        field_toggles,
    ),
    "list_latest_tweets_timeline": Endpoint(
        "https://twitter.com/i/api/graphql/9XqfD7zLnaJ-iwLh-tXh-g/ListLatestTweetsTimeline",
        "GET",
        {"count": 40},
        api_features,
        field_toggles,
    ),
    "home_timeline": Endpoint(
        "https://twitter.com/i/api/graphql/9zwVLJ48lmVUk8u_Gh9DmA/HomeTimeline",
        "GET",
        {"count": 40},
        api_features,
        field_toggles,
    ),
    "following_timeline": Endpoint(
        "https://twitter.com/i/api/graphql/XZlCTpzTo-AL39-WvGfDOg/FollowingTimeline",
        "GET",
        {"count": 40},
        api_features,
        field_toggles,
    ),
    "create_tweet": Endpoint(
        "https://twitter.com/i/api/graphql/oUvmDJb-Yx-TP-p-4iCn-A/CreateTweet",
        "POST",
        {},
        api_features,
        field_toggles,
    ),
    "create_retweet": Endpoint(
        "https://twitter.com/i/api/graphql/lZq_JkY-P-e_d7VAhP_Tow/CreateRetweet",
        "POST",
    ),
    "favorite_tweet": Endpoint(
        "https://twitter.com/i/api/graphql/i_LlJoI-v3vak-4RoEzzlA/FavoriteTweet",
        "POST",
    ),
    "audio_space_by_id": Endpoint(
        "https://twitter.com/i/api/graphql/ZYKSe-w7KEslx3JhSIk5LA/AudioSpaceById",
        "GET",
        {},
        api_features,
        field_toggles,
    ),
    "community_tweet_details": Endpoint(
        "https://twitter.com/i/api/graphql/Uv5R_-Chxbn তুরf7jkfJ5w/GetCommunityTweetDetails",
        "GET",
        {},
        api_features,
        field_toggles,
    ),
    "article": Endpoint(
        "https://twitter.com/i/api/graphql/g9lM-zj-RKR-y-AL_m1xHg/Article",
        "GET",
        {},
        api_features,
        field_toggles,
    ),
    "note_tweet": Endpoint(
        "https://twitter.com/i/api/graphql/o-V-x-h_r-Tg-r-r-n-v-g/NoteTweet",
        "POST",
    ),
    "trends": Endpoint(
        "https://api.twitter.com/1.1/trends/available.json",
        "GET",
    ),
    "send_dm": Endpoint(
        "https://twitter.com/i/api/1.1/dm/new2.json",
        "POST",
    ),
    "follow_user": Endpoint(
        "https://api.twitter.com/1.1/friendships/create.json",
        "POST",
    ),
}